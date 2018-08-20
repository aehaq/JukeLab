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
console.log(roomName);

// Change room name
$("#playlistName").text(roomName);

// if user is host, make new playlist and add key to database
if (window.location.href.includes("access_token")) {
    var isHost = true;
    token = parseURL(window.location.href);
    console.log("parsed token: " + token);
    roomName = roomName;
    var newPlaylist = {
        name: roomName,
        token: token
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
            })
            return userID;
    }

