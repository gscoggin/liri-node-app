//npm rquired packages to make the app work
require("dotenv").config();
var fs = require('fs');
var keys = require('./keys.js');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api')

//create new instances of API keys
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//Set divider variables to help make the output pretty
var mainDivider = "========================================";
var minorDivider = "----------------------------------------";

//function to list out all the commands the app can use, will run if no commands are provided
function listCommands() {
  console.log(`${mainDivider}\n${"WELCOME TO LIRI-BOT! HERE'S WHAT I CAN DO!"}\n${mainDivider}`)
  console.log(`${"Use the following commands to run Liri-Bot:"}\n${minorDivider}\n${"'my-tweets' : To list the last 20 tweets"}\n${minorDivider}\n${"'spotify-this-song' + 'song name': To lists the Artist, Song Name, Preview Link, and Album"}\n${minorDivider}\n${"'movie-this' + 'movie title': To lists the Movie Title, Release Year, IMDB Rating, Rotten Tomatoes Rating, Country, Language, Plot, Cast"}\n${mainDivider}`);
}

//twitter parameters
var params = {
  screen_name: 'CaliforniaStuck',
}
//Variable to print Twitter handle nicely
var handle = "@californiaStuck"

//function to call the twitter API
function getTweets() {
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(mainDivider + "\nTweet Number " + (i + 1) + " - " + handle + ": " + tweets[i].text, "\nCreated at: " + tweets[i].created_at);
      }
    }
  });
}

// * `spotify-this-song`

function spotifyThis(songTitle) {
  spotify.search({
    type: 'track',
    query: songTitle
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    //return the Artist, Song Name, Perview Link and Album Name. 
    console.log(`${mainDivider}\n${'Artist Name: ' + data.tracks.items[0].album.artists[0].name}\n${minorDivider}\n${'Song Name: ' + data.tracks.items[0].name}\n${minorDivider}\n${'Preview URL: ' + data.tracks.items[0].preview_url}\n${minorDivider}\n${'Album Name: ' + data.tracks.items[0].album.name}\n${mainDivider}`);
  });
}

//Advice from use .split to split the content of the random.txt file into two. 
//fs.read will return a string. need to parse that with split into the commands. 

function movieThis(movieTitle) {
  request("http://www.omdbapi.com/?t=" + movieTitle + "&plot=short&apikey=trilogy", function (error, response, body) {
    if (JSON.parse(body).Response === 'False') {
      return console.log(JSON.parse(body).Error);
    }
    if (!movieTitle) {
      request("http://www.omdbapi.com/?t=Mr+Nobody&plot=short&apikey=trilogy", function (error, response, body) {
        console.log(`${mainDivider}\n${"Movie Title: "}${JSON.parse(body).Title}\n${minorDivider}\n${"Release Date: "}${JSON.parse(body).Year}\n${minorDivider}\n${"IMDB Rating: "}${JSON.parse(body).Ratings[0].Value}\n${minorDivider}\n${"Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value}\n${minorDivider}\n${"Filmed In: " + JSON.parse(body).Country}\n${minorDivider}\n${"Language: " + JSON.parse(body).Language}\n${minorDivider}\n${"Plot: " + JSON.parse(body).Plot}\n${minorDivider}\n${"Staring: " + JSON.parse(body).Actors}\n${mainDivider}`)
      })
    } else if (!error && response.statusCode === 200) {

      console.log(`${mainDivider}\n${"Movie Title: "}${JSON.parse(body).Title}\n${minorDivider}\n${"Release Date: "}${JSON.parse(body).Year}\n${minorDivider}\n${"IMDB Rating: "}${JSON.parse(body).Ratings[0].Value}\n${minorDivider}\n${"Rotten Tomatoes Score: " + JSON.parse(body).Ratings[1].Value}\n${minorDivider}\n${"Filmed In: " + JSON.parse(body).Country}\n${minorDivider}\n${"Language: " + JSON.parse(body).Language}\n${minorDivider}\n${"Plot: " + JSON.parse(body).Plot}\n${minorDivider}\n${"Staring: " + JSON.parse(body).Actors}\n${mainDivider}`)
    }
  })
};

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (err, data) {
    if (err) {
      return console.log(err);
    }

    data = data.split(",");
    // console.log(data[1]);
    masterFunction(data[0], data[1] || null);

  });
}


var masterFunction = function (command, value) {
    if (command === "my-tweets") {
      getTweets();
    } else if (command === "spotify-this-song") {
      spotifyThis(value);

    } else if (command === "movie-this") {
      movieThis(value);

    } else if (command === "do-what-it-says") {
      doWhatItSays();

    } 
    else { 
      listCommands();
    }
  }

    masterFunction(process.argv[2] || null, process.argv[3] || null);

    // if (process.argv[2] == "my-tweets") {

    //   getTweets();

    // } else if (process.argv[2] == "spotify-this-song") {

    //   spotifyThis(process.argv[3]);

    // } else if (process.argv[2] == "movie-this") {

    //   movieThis(process.argv[3]);

    // } else if (process.argv[2] == "do-what-it-says") {

    //   readFile();

    // } else {

    //   listCommands();

    // };

    // // * `do-what-it-says`
    // Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
    // It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
    // Feel free to change the text in that document to test out the feature for other commands.