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
localStorage.test = "test";


function authorizeSpotify() {
    var token = "";
    var userID = "";
    var clientID = "b93cd2a896b04db6968176145cd8537f";
    var redirectURI = "https://atton88.github.io/spotify-test/player.html";
    var scopeParameter = "&scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-read-currently-playing user-modify-playback-state user-read-playback-state app-remote-control streaming user-read-recently-played user-read-birthdate user-read-email user-read-private";
    var queryURL = "https://accounts.spotify.com/authorize/?client_id=" + clientID + "&response_type=token&redirect_uri=" + redirectURI + scopeParameter;
    
    console.log("current url: " + window.location.href);
    // var teststr = "https://atton88.github.io/spotify-test/#access_token=BQAdcq499rKKgiIIMgbS4bercAR_HZWgsAIiqg1q4hb2DUHbKgqY_CKnfNvayC83gPsjiBDmE3rSVQQzBZ5tSW66eiP7yT9J2ca9UIqK2rsB_HP5DOqOfWohieiA6liFvfHfLkhZeOMs5g&token_type=Bearer&expires_in=3600";
    window.open(queryURL,"_self");
}

// authorize spotify and save playlist name to firebase
$("#spotifyLoginBtn").on("click", function(){
  console.log($("#newPlaylistName").val());
    localStorage.playlistName = $("#newPlaylistName").val();
  // database.ref().push(newPlaylist);
  authorizeSpotify();
})

// Populate current playlists
// database.ref().on("child_added", function(childSnapshot) {



// })