const Twit = require('twit');
const config  = require('./config');
const bot = new Twit(config);
const url = 'https://www.googleapis.com/blogger/v3/blogs/8419556441121513390/posts?maxResults=1&key=' + process.env.BLOGGER;

//get initial blog id
var request = require('request-promise');
request(url, function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  var myblogpost = JSON.parse(body);
  let oldid = myblogpost["items"][0]["id"];

// every 1 second, check blog id again to see if it has changed
// if it has, then parse and post to twitter
  var requestLoop= setInterval(function() {
    var secondrequest = require('request-promise');
    secondrequest(url, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      var myblogpost2 = JSON.parse(body);

      let myid = myblogpost2["items"][0]["id"];

      if (oldid != myid) {
        console.log("New post! Old id:" + oldid + " New id:" + myid);
        oldid = myid;
        console.log(myid);

        let thecontent = myblogpost2["items"][0]["content"];

        //TWITTER//
        let twitterstring = thecontent.split("[!TWITTER!]")[1];
        console.log("Twitter string" + "text" + twitterstring + "Type:" + typeof(twitterstring));

        if (typeof(twitterstring) != 'undefined') {
          console.log("TRUE");
          bot.post('statuses/update', {
            status: twitterstring  + "\n" + myblogpost2["items"][0]["url"]
          }, (err, data,response) => {
            if(err) {
              console.log(err)
            } else {
              console.log(`${data.text} tweeted!`)
            }
          })
        };
      }
      else {
        console.log("No new post.")
      }

      //other social media go below

    })
  },1000);
});
