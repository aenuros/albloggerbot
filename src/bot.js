const Twit = require('twit')
const config  = require('./config')

const bot = new Twit(config)

bot.post('statuses/update', {
  status: 'Hello, world! This is a test - please ignore. \n https://www.acelinguist.com/2018/10/dialect-dissection-indie-girl-voice.html'
}, (err, data,response) => {
  if(err) {
    console.log(err)
  } else {
    console.log(`${data.text} tweeted!`)
  }
})
