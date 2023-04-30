import abf from 'audio-buffer-from'
import AudioBufferList from 'audio-buffer-list'
import onMessage from './lib/decode.mjs'
import Trp from 'timeranges-plus'
import EventEmitter from 'eventemitter3'
import '@storyboard-fm/audio-core-library'

/**
 * FeedDecoder is a class for managing a feed's incoming audio messages. It
 * eagerly consumes and decodes opus audio files into AudioBuffer for immediate
 * and easy playback via the Web Audio API.
 */
class FeedDecoder {
    constructor(feed='', ctx=null) {
        this.feed = feed
        this.messages = {}
        this.ctx = ctx || new AudioContext()
        this.progress = 0
        this.played = new Trp()
        this.e = new EventEmitter()
    }
    _prepareCtx() {
        if (this.ctx.verifyACL()) {
            if (this.ctx.state !== 'running') this.ctx.toggle()
        }
    }
    /**
     * When feed receives a new audio message, pass the URL to this function to
     * produce decoded opus file chunks, from which we can generate AudioBuffers
     */
    async _onNewMessage(url) {
        const opusChunks = await onMessage(url)
        this.messages[url] = await this._onNewMessageChunks(opusChunks)
        this.e.emit('new-message')
        // TODO dispatch 'new-message' event
    }
    async _onNewMessageChunks(chunks) {
        console.log(chunks)
        const bufs = new AudioBufferList(
            chunks.map(c => abf(c.channelData[0], { sampleRate: 48000 }))
        )
        this.e.emit('message-ready')
        return bufs.join()
        // TODO dispatch 'message-ready' event
    }
    playMessage(url, seek=0) {
        this._prepareCtx()
        const buf = this.messages[url]
        const srcNode = this.ctx.createBufferSource()
        srcNode.buffer = buf
        srcNode.connect(this.ctx.destination)
        this.srcNode = srcNode
        this._startSrcNode(0, seek)
    }
    /**
     * Creates the AudioBufferSourceNode and connects it to the destination node.
     * Whenever this class needs to start playback of audio (play/resume/etc.)
     * it should eventually call this method to ensure underlying logic.
     */
    _startSrcNode(when=0, seek=0) {
        // TODO: 'play' event
        if (!this.srcNode) return
        this._prepareCtx()
        const oldProgress = this.progress
        this.srcNode.start(when, seek)
        this.progress = seek
        this.ctx.newEvent('streamplayer-play')
        if (oldProgress !== this.progress) this.e.emit('seeked')
        this._startProgressTracker()
        this.e.emit('play')
        this.playing = true
        this.seeking = false
        this.paused = false
    }
    /**
     * Stop playing the AudioBuffer. While _pauseBuffer() does not reset
     * this.progress, this method does.
     */
    _stopBuffer() {
        if (!this.srcNode) return
        cancelAnimationFrame(this.rAF)
        this.srcNode.onended = () => {
            this.ctx.endEvent('streamplayer-play')
            const { begin, end } = this.ctx._eventTimings['streamplayer-play']
            this.played.add(begin - begin, end - begin)
            this.progress = 0
            this.e.emit('stop')
            this.playing = false
            this.seeking = false
            this.paused = false
            this.srcNode = null
        }
        this.srcNode.stop()
    }
    _pauseBuffer() {
        if (!this.srcNode) return
        this.srcNode.onended = () => {
            this.e.emit('pause', this.playhead)
            this.ctx.endEvent('streamplayer-play')
            const { begin, end } = this.ctx._eventTimings['streamplayer-play']
            this.played.add(begin - begin, end - begin)
            this.progress = this.playhead
            this.paused = true
            this.playing = false
        }
        cancelAnimationFrame(this.rAF)
        this.srcNode.stop()
    }
    _playBuffer(ab, seek=0) {
        const srcNode = this.ctx.createBufferSource()
        srcNode.buffer = ab
        srcNode.connect(this.ctx.destination)
        this.srcNode = srcNode
        this._startSrcNode(0, seek)
    }
    _resumeBuffer() {
        if (!this.srcNode) return
        if (!this.paused) return console.error('Not paused so cant resume')
        const bufferToSeek = this.srcNode.buffer
        const newSrcNode = this.ctx.createBufferSource()
        newSrcNode.buffer = bufferToSeek
        newSrcNode.connect(this.ctx.destination)
        this.srcNode = newSrcNode
        this._startSrcNode(0, this.playhead)
    }
    _seekBuffer(seek) {
        if (!this.srcNode) return
        this.seeking = true
        // Seeking works by *PAUSING* buffer playback first, so that we get a
        // progress update. The `seek` arg augments this.progress to find the
        // correct time to begin playing back from.
        this._pauseBuffer()
        const bufferToSeek = this.srcNode.buffer
        const newSrcNode = this.ctx.createBufferSource()
        newSrcNode.buffer = bufferToSeek
        newSrcNode.connect(this.ctx.destination)
        this.srcNode = newSrcNode
        this._startSrcNode(0, seek + this.playhead)
    }
    _startProgressTracker() {
        const startTime = this.ctx.getOutputTimestamp().contextTime
        const progressSnapshot = this.progress
        let elapsed
        // Helper function to output timestamps 
        const outputTimestamps = () => {
          try {
              const ts = this.ctx.getOutputTimestamp()
              elapsed = ts.contextTime - startTime
              this.playhead = progressSnapshot + elapsed
              this.e.emit('timeupdate', this.playhead)
              // Keep going until we reach end of audio buffer
              if (!this.paused &&
                  !this.seeking &&
                  ts.contextTime - startTime < this.srcNode.buffer.duration) {
                this.rAF = requestAnimationFrame(outputTimestamps); // Reregister itself
              } else {
                  cancelAnimationFrame(this.rAF)
              }
          } catch (err) {
              return err
          }
        }
        this.rAF = requestAnimationFrame(outputTimestamps)
    }
}

export default FeedDecoder
