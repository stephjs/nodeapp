//require twitter, spotify, request, fs
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require("request");
var fs = require('fs');


//the user will call node liri.js ___<command>____
var command = process.argv[2];
var movieName = "";
var songName="";
var nodeArgs = process.argv;

//function performed depends on user command
//node liri.js my-tweets
//this calls the last 20 tweets
if (command == "my-tweets") {
    myTweets();

//node liri.js spotify-this-song Yellow
//this calls the song Yellow and tells artist, album, etc.
//can be for any song and for songs with multiple words in titles
}else if (command == "spotify-this-song"){
    for (var i=3; i<nodeArgs.length; i++){
    	if (i>3 && i< nodeArgs.length){
    		songName = songName + " " + nodeArgs[i];
    	}else {
    	    songName = songName + nodeArgs[i];
    	}
    }
    spotifythis();
    
//node liri.js movie-this Midnight in Paris
//this calls the movie Midnight in Paris and movie data
//can be for any movie even with multiple words in titles
}else if (command == "movie-this"){
    myMovies();
    
//node liri.js do-what-it-says
}else if (command =="do-what-it-says"){
    fs.readFile('random.txt', 'utf8', function(error, data){
       var thatFile = data.split(',');
       songName = thatFile[1];
       //console.log(songName);
       spotifythis();
    });
}

//spotify function
function spotifythis(){
    //console.log(songName);
    
    spotify.search(
        { type: 'track', query: songName}, 
        function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            }
    
            //simplify requesting things from the song object
            var song = data.tracks.items[0];
    
            console.log(song.name);
    
            //some songs have more than one artist
            if (song.artists.length > 1) {
                for (var i=0; i<song.artists[i]; i++) {
                    console.log(song.artists[i].name);
                }
            }else console.log("Artist: "+song.artists[0].name);
    
            console.log("Album: "+song.album.name);
            console.log(song.preview_url);
        }
    );
}

//twitter function
function myTweets(){
    
    
    
    //this is my twitter username
    var username = "cinderellacoder";
    console.log("@" +username+" Twitter Timeline");
    
    //the keys are in the keys.js file
    //so must require this file
    var keys = require('./keys.js');
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret,
        count: 20
    });
    
    //get command for 20 twitter statuses from my timeline 
    client.get(
        'statuses/user_timeline', 
        
        //function for getting the tweets
        function(err, stephTweets) {
            if (err) {
                console.log(err);
    	        return;
            }
            
            for (var eachTweet in stephTweets) {
                //var tcount = stephTweets[eachTweet].max_id;
                var time = stephTweets[eachTweet].created_at;
                var tweet = stephTweets[eachTweet].text;
                var output = time + " || @"+ username + ": " + tweet;
    	        console.log(output);
            }
        }
    );
}

//movie function
function myMovies(){
    var movieName = "";
    for (var i=3; i<nodeArgs.length; i++){
    	if (i>3 && i< nodeArgs.length){
    		movieName = movieName + "+" + nodeArgs[i];
    	}else {
    	    movieName = movieName + nodeArgs[i];
    	}
    }
    
    //query ombd and add rotton tomatoes rating stuff
    var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&tomatoes=true';
    
    
    request(queryUrl, function(err, response, moviestuff) {
    
        // If the request is successful (i.e. if the response status code is 200)
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }
            console.log("Title: " + JSON.parse(moviestuff).Title);
            console.log("Actors: " + JSON.parse(moviestuff).Actors);
            console.log("Plot: " + JSON.parse(moviestuff).Plot);
            console.log("Year: " + JSON.parse(moviestuff).Year);
            console.log("Country: " + JSON.parse(moviestuff).Country);
            console.log("Language: " + JSON.parse(moviestuff).Language);
            console.log("IMDB Rating: " + JSON.parse(moviestuff).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(moviestuff).tomatoRating);
            console.log("URL: " + JSON.parse(moviestuff).tomatoURL);
    });
}