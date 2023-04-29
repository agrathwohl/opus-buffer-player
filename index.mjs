import abf from 'audio-buffer-from'
import AudioBufferList from 'audio-buffer-list'
import onMessage from './lib/decode.mjs'

class FeedDecoder {
    constructor(ctx=null, feed='') {
        this.ctx = ctx
        this.feed = feed
        this.messages = {}
    }
    /**
     * When feed receives a new audio message, pass the URL to this function to
     * produce decoded opus file chunks, from which we can generate AudioBuffers
     */
    async _onNewMessage(url) {
        const opusChunks = await onMessage(url)
        // const bufList = await this._onNewMessageChunks(opusChunks)
        this.messages[url] = await this._onNewMessageChunks(opusChunks)
        // TODO dispatch 'new-message' event
    }
    async _onNewMessageChunks(chunks) {
        const bufs = new AudioBufferList(
            chunks.map(c => abf(c.channelData[0], { sampleRate: 48000 }))
        )
        return bufs.join()
    }
}

export default FeedDecoder
