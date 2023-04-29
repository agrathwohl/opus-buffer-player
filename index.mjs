import abf from 'audio-buffer-from'
import AudioBufferList from 'audio-buffer-list'
import onMessage from './lib/decode.mjs'
import '@storyboard-fm/audio-core-library'

class FeedDecoder {
    constructor(feed='') {
        this.feed = feed
        this.messages = {}
        this.ctx = new AudioContext()
        this.ctx.toggle()
    }
    /**
     * When feed receives a new audio message, pass the URL to this function to
     * produce decoded opus file chunks, from which we can generate AudioBuffers
     */
    async _onNewMessage(url) {
        const opusChunks = await onMessage(url)
        this.messages[url] = await this._onNewMessageChunks(opusChunks)
        // TODO dispatch 'new-message' event
    }
    async _onNewMessageChunks(chunks) {
        console.log(chunks)
        const bufs = new AudioBufferList(
            chunks.map(c => abf(c.channelData[0], { sampleRate: 48000 }))
        )
        console.log(bufs)
        return bufs.join()
    }
    playMessage(url) {
        const buf = this.messages[url]
        const srcNode = this.ctx.createBufferSource()
        srcNode.buffer = buf
        srcNode.connect(this.ctx.destination)
        srcNode.start()
    }
    _playBuffer(ab) {
        const srcNode = this.ctx.createBufferSource()
        srcNode.buffer = ab
        srcNode.connect(this.ctx.destination)
        srcNode.start()
    }
}

export default FeedDecoder
