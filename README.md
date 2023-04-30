# `FeedDecoder`

A feed decoding class. Converts new opus audio messages into AudioBuffer for immediate playback.

Run the `example.mjs` to see it work.

The class expects the opus to be mono @ 48kHz.

## Getting Started

After doing `npm install`, use this npm script to build the module and the web worker:

```sh
npm run build-all
```

Move the outputs `feeddecoder.js` and `decodeworker.js` to `test`.

Then, run this script to launch the test server:

```sh
npm run serve
```

## Implementation Guide
> This repo provides a `FeedDecoder` class and a `DecodeWorker` Web Worker.

Read on to learn how to integrate the Web Worker and the class into your app.

### `DecodeWorker` Web Worker
First we need to instantiate the Web Worker. This should happen as soon as the
audio messages feed loads. This is so that we can begin decoding opus audio files
provided by the feed right away.

To get the worker running, do the following immediately after the page loads:

```js
const decodeWorker = new Worker('decodeworker.js')
```

When the feed receives a new opus audio message URL, send it to the decode worker:

```js
decodeWorker.postMessage({url})
```

The web worker will send a new message containing the decoded audio data once
decoding is done.

### `FeedDecoder` Class
Before we can do anything with the decoded audio returned by our Web Worker, we
need to also instantiate a class instance of `FeedDecoder`. This class should
*also* be loaded immediately after page load.

Setup the class this way:

```js
import FeedDecoder from 'feeddecoder'
const decoder = new FeedDecoder({feed: 'feedId'})
// or in vanilla JS...
// const FD = FeedDecoder.default
// const decoder = new FD({feed: 'feedId'})
```

Listen on the web worker to send new audio to the feed decoder class instance:

```js
decodeWorker.onmessage = async function (chunks) {
  // Create an AudioBuffer from the chunks returned by the worker
  const audioBuffer = await decoder._onNewMessageChunks(chunks.data)

  // Save the audio buffer to the FeedDecoder's `messages` object
  decoder.messages[messageId] = audioBuffer

  // Play the audio:
  decoder._playBuffer(audioBuffer)
}
```

You can setup some event listeners for audio playback too:

```js
decoder.e.on('play', () => console.log('play emitted'))
decoder.e.on('pause', () => console.log('pause emitted'))
decoder.e.on('stop', () => console.log('stop emitted'))
decoder.e.on('seek', () => console.log('seek emitted'))
```

## TODOs

### Playback Controls
- [x] play
- [x] seek
- [x] pause
- [x] stop
- [x] resume

### Time
- [x] playback duration tracking
- [x] `TimeRanges` tracking
- [x] `AudioContext` newEvent/endEvent

### Events
#### `MediaElement`
- [x] `play`
- [x] `pause`
- [x] `stop`
- [x] `canplay`/`canplaythrough`
- [ ] `waiting`
- [x] `seeked`
