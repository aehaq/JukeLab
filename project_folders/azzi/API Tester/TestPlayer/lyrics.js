$(document).on('click', '.option', function() {
    event.preventDefault();
    console.log("click successful")

    console.log(this)
    
    var songTitle = $(this).attr("title");
    
    var songArtist = $(this).attr("artist");
    
    var apiKey = "B11C1C1z1RkD3pCAbR5LpaftjkpaST0q2JICuY7SYx7jzSvYZ2IadJv0I98lLrAU"
    
    var queryUrl = "https://orion.apiseeds.com/api/music/lyric/" +songArtist +"/" + songTitle + "?apikey=" +apiKey
    
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response) {
        var song = response.result.track;
        console.log(song)
        var lyrics = song.text
        console.log(lyrics)
        $('#lyrics').html('<p>'  +lyrics.replace(/\r\n|\r|\n/g, "</br>")+ '</p>')
    })

})