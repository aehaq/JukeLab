// Initialize Firebase
var config = {
    apiKey: "AIzaSyC1CNzGvk1-txN23py3SyoVRrLmWbpbdvY",
    authDomain: "jukelab-e2948.firebaseapp.com",
    databaseURL: "https://jukelab-e2948.firebaseio.com",
    projectId: "jukelab-e2948",
    storageBucket: "jukelab-e2948.appspot.com",
    messagingSenderId: "607552764798"
};
firebase.initializeApp(config);
var database = firebase.database();

// Declare variables
var isHost = false;
var token;
var roomName = localStorage.playlistName;

var userID;
var deviceId;
var playlistID;

console.log(roomName);

// Change room name
$("#playlistName").text(roomName);

// if user is host, make new playlist and add key to database
if (window.location.href.includes("access_token")) {
    var isHost = true;
    token = parseURL(window.location.href);
    console.log("parsed token: " + token);
    roomName = roomName;
    userID = getUserInfo();  
    var newPlaylist = {
        name: roomName,
        token: token, 
    }
    database.ref().child(roomName).set(newPlaylist);
    // database.ref().push(newPlaylist);
    console.log(newPlaylist);
} else {
    // if guest, search firebase, get authentication token
    database.ref().child(roomName).once('value').then(function(snapshot) {
        console.log("playlist info", snapshot.val());
        console.log("token:", snapshot.val().token);
        token = snapshot.val().token;
        userID = getUserInfo();
})
}

// check localstorage for name
console.log("get item: " + roomName);

///////////////////////////////////////////////////
// Initialize Spotify SDK and parse token from url
window.onSpotifyWebPlaybackSDKReady = () => {
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
deviceId = device_id
return deviceId;
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
//////////////////////////////////////////////////////////////

//parse url, returns token
function parseURL(str) {
    console.log(str);
    str = str.split("#access_token=");
    str = str[1].split("&token_type");
    console.log(str[0]);
    return str[0];
}

// function to get user id (not used currently)
function getUserInfo () {
    queryURL = "https://api.spotify.com/v1/me";
    user = "124009025";

    $.ajax({
        url: queryURL,
        headers: {
            'Authorization' : 'Bearer ' + token,
        },
        method: "GET"
        }).then(function(response) {
        console.log("response");
        var userID = response.id;  //get user ID
        console.log(response);
        console.log(userID);
        if (isHost) {
            makePlaylist(userID);
        }
    })
    return userID;
}

//////////////////////////////////////////////////////////////

$(function(){
    console.log("test js page");

})



// When the search button is clicked.
$('#search').on("click", function() {
    event.preventDefault();

    console.log('Search function clicked');

    $('#search-results').empty();

    // Pulls search info    
    var searchQuery = $("#search-input").val();
    
    //Query URL for searching songs, note: Only takes one query, type needs to be selected    
    var searchUrl = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track"
    
    $.ajax({
        url: searchUrl,
        headers: {
            'Authorization' : 'Bearer ' + token,
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

            var resultCard = $('<div class="uk-card-hover uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin-small uk-animation-toggle" uk-grid>'); 

            var imageCard = $('<div class="avatar uk-card-media-right uk-flex-last uk-cover-container uk-width-1-4@s uk-animation-slide-top-small">');

            var infoCard = $('<div class="uk-card-body uk-width-3-4@s uk-animation-slide-top-small">');
            
            infoCard.append('<h4 class="song-title uk-card-title">'+ title +'</h4><p class="artist-name">by '+artist+'</p>');
            
            imageCard.append('<canvas width="117" height="117"></canvas><img class="artist-icon" src="'+imgMed+'" alt="Image" uk-cover>');
            
            resultCard.append(infoCard);
            resultCard.append(imageCard);
            
            resultCard.addClass("option");
            resultCard.attr("title", title);
            resultCard.attr("artist", artist);
            resultCard.attr("song-id", id);
            resultCard.attr("lrg-img", imgLarge);
            resultCard.attr("med-img", imgMed);
            
            $('#search-results').append(resultCard);
        }

    })

})

//////////////////////

function makePlaylist (userID) {
    $.post({
        data: '{"name": "jukeLab", "public": false}',
        headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : "application/json"
        },
        url: 'https://api.spotify.com/v1/users/'+ userID +'/playlists',
        success: function(newPlaylist) {
            console.log(newPlaylist);
            playlistID = newPlaylist.id;
            console.log(playlistID)
        },
        error: function(errorObject) {
            console.log("Ajax Post failed")
            console.log(errorObject)
        }
    })
}


console.log("testing this page");
