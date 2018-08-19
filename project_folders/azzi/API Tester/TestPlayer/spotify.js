var thisDevice;

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQCxz-2qTIFN1r1uPttFAZKAzyDeycZ3-PT34lniWyIUZ7N48-uPhQ12M8VGf0qQ8wecFI4-YtmhneQuxGIi4y13SvZ7SJWzQ_NFvctVn1Zkp8LGhlTXBUc_pjEhpcnwdGNb8b7cxtJ5SlC8uXOJoRoHKHdRRkMvEgxJ2F6ZafnRxZ5WcNapueNj7A';
    const player = new Spotify.Player({
    name: 'Test Player',
    getOAuthToken: cb => { cb(token); }
});

// Error handling
player.addListener('initialization_error', ({ message }) => { console.error(message); });
player.addListener('authentication_error', ({ message }) => { console.error(message); });
player.addListener('account_error', ({ message }) => { console.error(message); });
player.addListener('playback_error', ({ message }) => { console.error(message); });

// Playback status updates
player.addListener('player_state_changed', state => { console.log(state); });

    // Ready
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        thisDevice = device_id;
        return thisDevice;
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

 // Connect to the player!
    player.connect();

    $('#toggleplay').on("click", function() {
        player.togglePlay();
    });

    $('#forward').on("click", function() {
        player.previousTrack();
    });

    $('#back').on("click", function() {
        player.nextTrack();
    });

};

$('#search').on("click", function() {
    event.preventDefault();
    
    var songTitle = $("#track").val();
    
    var songArtist = $('#artist').val();
    
    var queryUrl = "https://api.spotify.com/v1/search?q="
    if (songTitle != "") {
        queryUrl = queryUrl + songTitle+'&type=track&';
    }

    if (songArtist != "") {
        queryUrl = queryUrl + songArtist +'&type=artist';
    }
    
    $.ajax({
        url: queryUrl,
        headers: {
            'Authorization' : 'Bearer ' + "BQCxz-2qTIFN1r1uPttFAZKAzyDeycZ3-PT34lniWyIUZ7N48-uPhQ12M8VGf0qQ8wecFI4-YtmhneQuxGIi4y13SvZ7SJWzQ_NFvctVn1Zkp8LGhlTXBUc_pjEhpcnwdGNb8b7cxtJ5SlC8uXOJoRoHKHdRRkMvEgxJ2F6ZafnRxZ5WcNapueNj7A",
        },
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var results = response.tracks.items;

        for (let i = 0; i < 5; i++) {
            var song = results[i];
            var artist = song.artists[0].name;
            var title = song.name;
            var id = song.id;
            var imgLarge = song.album.images[0].url;
            var imgMed = song.album.images[1].url;

            var newDiv = $('<div>'); 
            newDiv.addClass("option")
            newDiv.attr("title", title)
            newDiv.attr("artist", artist)
            newDiv.attr("song-id", id)
            newDiv.attr("lrg-img", imgLarge)
            newDiv.attr("med-img", imgMed)

            var imgDisp = $('<img src="'+imgMed+'">')
            var titleDisp = $('<p>'+title+'</p>')
            var artistDisp = $('<p>'+artist+'</p>')

            newDiv.append(imgDisp)
            newDiv.append(titleDisp)
            newDiv.append(artistDisp)

            $('#search-results').append(newDiv)

            console.log(thisDevice)
            
        }

    })

})

$(document).on('click', '.option', function() {
    event.preventDefault();

    var trackId = $(this).attr("song-id") 
    var playURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + thisDevice

    $.ajax({
        url: playURL,
        headers: {
            'Authorization' : 'Bearer ' + "BQCxz-2qTIFN1r1uPttFAZKAzyDeycZ3-PT34lniWyIUZ7N48-uPhQ12M8VGf0qQ8wecFI4-YtmhneQuxGIi4y13SvZ7SJWzQ_NFvctVn1Zkp8LGhlTXBUc_pjEhpcnwdGNb8b7cxtJ5SlC8uXOJoRoHKHdRRkMvEgxJ2F6ZafnRxZ5WcNapueNj7A",
        },
        data: '{"uris": ["spotify:track:'+trackId+'"]}',
        method: "PUT"
    })

})


