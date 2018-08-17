var songTitle = "africa"

var songArtist = "toto"

var apiKey = "B11C1C1z1RkD3pCAbR5LpaftjkpaST0q2JICuY7SYx7jzSvYZ2IadJv0I98lLrAU"

var queryUrl = "https://orion.apiseeds.com/api/music/lyric/" +songArtist +"/" + songTitle + "?apikey=" +apiKey

$.ajax({
    url: queryUrl,
    method: "GET"
}).then(function(response) {
    console.log(response.result.track);
})

