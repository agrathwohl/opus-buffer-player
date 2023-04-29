import FeedDecoder from './index.mjs'

const decoder = new FeedDecoder()
console.log('New decoder for a feed', decoder)

console.log('decoder receiving new message')
await decoder._onNewMessage('https://artifcats-sbv2-dev20230419195650735000000003.s3.us-east-2.amazonaws.com/clgzhdyou0000ky087xyxvs7m.opus')
console.log(decoder)
console.log('decoder finished decoding the message into an AudioBuffer')
