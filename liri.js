
//Requiere the packets

require("dotenv").config();
var Spotify = require('node-spotify-api');
var request = require("request");
var moment = require('moment');
moment().format();
var fs = require("fs")
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);



var taskAction= process.argv[2];   //This variable define the actions


var nodeArray = process.argv;
var search = "";                  //This variable contains the strings for teh fulll search



for (var i = 3; i < nodeArray.length; i++) {

    if (i > 3 && i < nodeArray.length) {
        search = search + "%20" + nodeArray[i];  //Spaces a declare using %20, search for multi´ples words
    }
    else {
        search += nodeArray[i];      //Search using one word
    }
}

//Definie the options for LIRI


function liriOptions(){

switch (taskAction) {

case 'concert-this':
BandInTown(search);
break;

case 'spotify-this-song':
callSpotify(search);
break;

case 'movie-this':
MoviesSearch(search);
break;

case 'do-what-it-says':
break;

default:
console.log("Invalid Entry");
break;
}


}



//Here the call for spotify

function callSpotify(search){
  
userInput=search;

//we look for the sign if no option defined

if (!userInput){

    userInput="The%20Sign"; 

    console.log(userInput);
}// Close the condition

console.log(userInput);


spotify.search({ type: 'track', 
query: userInput }, 

function(err, data) {
  if (err) {
    return console.log('Error occurred: ' + err);
  }

  var info = data.tracks.items

  for (var i = 0; i < info.length; i++) {
      

      var albumObject = info[i].album;
      var trackName = info[i].name;
       var preview = info[i].preview_url
      var artistsInfo = albumObject.artists
   
      //To iterate in albums objec that  define an array
      for (var j = 0; j < artistsInfo.length; j++) {
          console.log("This is the Artist: " + artistsInfo[j].name)
          console.log("This is the Song Name: " + trackName)
          console.log("This is Preview of Song: " + preview)
          console.log("This is Album Name: " + albumObject.name)
          console.log("******************")
      }
    }



});

}



//Calls for BandsinTown

function BandInTown(search) {

var userInput= search;
var queryURL = "https://rest.bandsintown.com/artists/" + userInput + "/events?app_id=codingbootcamp"

 
request(queryURL, function (error, response, body) {
   
    if (!error && response.statusCode === 200) {
       
        var data = JSON.parse(body);  //Parse the json response

        //console.log(data);
      
        for (var i = 0; i < data.length; i++) {
      
            console.log("Venue: " + data[i].venue.name);
      
      
            if (data[i].venue.region == "") {
                console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
    
            } else {
                console.log("Location: " + data[i].venue.city + ", " + data[i].venue.region + ", " + data[i].venue.country);
            }
    
            var date = data[i].datetime;
            date = moment(date).format("MM/DD/YYYY");
            console.log("Date: " + date)
    
            console.log("**************")
        }
    }
});
}


//Here the function for movie search

function MoviesSearch(search){

  var movie;

  if (!search){
     movie = "Mr%20NoBody";
  }else{

    movie=search;
     console.log(movie);
  };


  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy"
            request(queryURL, function (error, response, body) {
               
              
              
              
              if (!error && response.statusCode === 200) {
                  
                var info = JSON.parse(body);
                    console.log("Title: " + info.Title)
                    console.log("Release Year: " + info.Year)
                    console.log("IMDB Rating: " + info.Ratings[0].Value)
                    console.log("Rotten Tomatoes Rating: " + info.Ratings[1].Value)
                    console.log("Country: " + info.Country)
                    console.log("Language: " + info.Language)
                    console.log("Plot: " + info.Plot)
                    console.log("Actors: " + info.Actors)

              }

 
            });


}



if (taskAction==="do-what-it-says") {

var fs = require("fs");

//Starts reading the random.tx
fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
        return console.log(error)
    }
    //Split data into array
    var textArr = data.split(",");
    taskAction = textArr[0];
    search = textArr[1];
    
    liriOptions();
});
}

liriOptions();