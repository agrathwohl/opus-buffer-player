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
