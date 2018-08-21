var thisDevice;
var apiKey = 'BQD3gvGqsVCr7YJNsnVk9yq7uTxzOjFxvTcSdngZwojuVazjH3c39xWP_aowm27LFYO606Nik1VQKAOtC_DRYKaGRztelkILOLglTMS4k4TcbF_rgYT3XZgxRU-WeKrfot8nU_y-LS8BUQl957DhL5DsHtLnwdOh-usH7xW7eIgSOuDHgRnzOMLsRC6RgeO8voqPO8TQaH4YdKZnzHwz4vs0zV-Ra7WGk19Id0iIszfJT86g4k7hmZ7XiB2PqDgZ_87tSoVJJs3l';
var userID;
var myId = 'y0boqvzwlmvycue8917uz1ylg';
var playlistID;

// This function should create a spotify playlist (Currently returns error)
function makePlaylist () {
    $.post({
        data: '{"name": "jukeLab", "public": true}',
        headers: {
            'Authorization' : 'Bearer ' + apiKey,
            'Content-Type' : "application/json"
        },
        url: 'https://api.spotify.com/v1/users/'+ myId +'/playlists',
        success: function(newPlaylist) {
            console.log(newPlaylist);
            playlistObject = newPlaylist;
            playlistID = newPlaylist.id;
            console.log(playlistID);
            loadPlaylist();
            return playlistID;
        },
        error: function(errorObject) {
            console.log("Ajax Post failed")
            console.log(errorObject)
        }
    })
}

//loading playlist
function loadPlaylist() {
    var loadURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + thisDevice;

    $.ajax({
        url: loadURL,
        headers: {
            'Authorization' : 'Bearer ' + apiKey,
        },
        data: '{"context_uris": ["spotify:playlist:'+playlistID+'"]}',
        method: "PUT"
    })

}


// This function returns the user's Id
function getUserInfo () {
    queryURL = "https://api.spotify.com/v1/me";

    $.ajax({
        url: queryURL,
        headers: {
            'Authorization' : 'Bearer ' + apiKey,
        },
        method: "GET"
    }).then(function(response) {
        console.log("response");
        userID = response.id;  //get user ID
        console.log(response);
        console.log("User Id: " + userID + " retrieved");
        // makePlaylist()
    })
    return userID;
}

window.onSpotifyWebPlaybackSDKReady = () => {
    const token = apiKey;
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

    // Ready (also returns the id for the device to a master variable)
    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        thisDevice = device_id;
        makePlaylist();
        return thisDevice;
    });

    // Not Ready
    player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
    });

    // Connect to the player!
    player.connect();

    // functions to control the spotify player
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

// When the search button is clicked.
$('#search').on("click", function() {
    event.preventDefault();

    // Pulls song info    
    var songTitle = $("#track").val();
    
    var songArtist = $('#artist').val();

    //Query URL for searching songs, note: Only takes one query, type needs to be selected    
    var queryUrl = "https://api.spotify.com/v1/search?q="
    if (songTitle != "") {
        queryUrl = queryUrl + songTitle+'&type=track&';
    }

    if (songArtist != "") {
        queryUrl = queryUrl + songArtist +'&type=artist&';
    }
    
    $.ajax({
        url: queryUrl,
        headers: {
            'Authorization' : 'Bearer ' + apiKey,
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

// spotify:user:y0boqvzwlmvycue8917uz1ylg:playlist:0AH0ZjJeUpU7taDXPxjJJN

//Add song to playlist on click. (working!)
$(document).on('click', '.option', function() {
    event.preventDefault();

    var trackID = $(this).attr("song-id")

    addTrack(trackID);

    loadPlaylist();

})

//Make a playlist 




    // 
    // var playURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + thisDevice

    // $.ajax({
    //     url: playURL,
    //     headers: {
    //         'Authorization' : 'Bearer ' + apiKey,
    //     },
    //     data: '{"uris": ["spotify:playlist:'+playlistID+'"]}',
    //     method: "PUT"
    // })

//Add song to playlist
function addTrack(songID) {

    $.ajax({
        type: "POST",
        data: '{"uris": ["spotify:track:'+songID+'"]}', 
        headers: {
            'Authorization' : 'Bearer ' + apiKey,
            'Content-Type' : "application/json"
        },
        url: 'https://api.spotify.com/v1/playlists/'+playlistID+'/tracks',
        success: function() {
            console.log('Track added to playlist');
        },
        error: function() {
            console.log("Ajax Post failed")
        }
    })

}