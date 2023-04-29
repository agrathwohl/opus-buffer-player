/**
 * Decode new audio messages in the feed.
 * Once a message arrives, provide its URL and duration as input into the
 * function in order to receive Uint8 decoded audio chunks. Create AudioBuffers
 * with these chunks.
 */

import { OggOpusDecoder } from 'ogg-opus-decoder'


async function initDecoder() {
    const decoder = new OggOpusDecoder()
    await decoder.ready
    console.log('decoder ready')
    return decoder
}

async function onMessage(url) {
    const chunks = []
    const dec = []
    const bufs = []
    const decoder = await initDecoder()
    const resp = await fetch(url)
    for await (const chunk of readChunks(resp.body.getReader())) {
        const decoded = await decoder.decode(chunk)
        dec.push(decoded)
    }
    return dec
}

function readChunks(reader) {
    return {
        async* [Symbol.asyncIterator]() {
            let readResult = await reader.read()
            while (!readResult.done) {
                yield readResult.value
                readResult = await reader.read()
            }
        },
    }
}

export default onMessage
