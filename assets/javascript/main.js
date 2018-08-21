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

// playlist icon locations
var arrayIcons = ["ipod.png", 
                  "mic.png", 
                  "radio.png",
                  "speaker.png",
                  "speaker2.png",
                  "vinyl-icon.png",
                  "wave.png"
                ];

// Creates URL to authorize spotify account and get access token
function authorizeSpotify() {
    var clientID = "b93cd2a896b04db6968176145cd8537f";
    var redirectURI = "https://aehaq.github.io/JukeLab/playlist_host.html";
    var scopeParameter = "&scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-read-currently-playing user-modify-playback-state user-read-playback-state app-remote-control streaming user-read-recently-played user-read-birthdate user-read-email user-read-private";
    var queryURL = "https://accounts.spotify.com/authorize/?client_id=" + clientID + "&response_type=token&redirect_uri=" + redirectURI + scopeParameter;
    
    // Go to spotify page to for authorization, redirects to playlist_host.html
    window.open(queryURL,"_self");
}

// authorize spotify and save playlist name to firebase
$("#spotifyLoginBtn").on("click", function(){
  event.preventDefault();
  console.log($("#newPlaylistName").val());
  var userId = $("#newPlaylistName").val();

  // playlist can't be blank
  if (!$("#newPlaylistName").val()) {
    alert("Enter Playlist Name"); 
    return;
  }

  // check if name is taken
  database.ref().child(userId).once('value').then(function(snapshot) {
    console.log(snapshot.val()); // show current rooms obj
    // if taken, do nothing
    if (snapshot.val() !== null) {
      alert('name ' + userId + ' taken! Choose a different name.');
      return;
    }
    // if available, authorize and create
    else {
      localStorage.playlistName = $("#newPlaylistName").val();
      authorizeSpotify();
    }
  });
})

// Populate current playlists
database.ref().on("child_added", function(roomObj) {
  var name = roomObj.val().name;

  var rnd = Math.floor(Math.random() * 7);   // for random icon

  // Create temp elements
  var tempDiv2 = $("<div>").attr("class", "uk-card uk-card-default uk-card-body uk-padding-small playlistRoom");
  tempDiv2.html('<img class="roundPlaylistImg" src="assets\\images\\music icons\\' + arrayIcons[rnd] + '" alt="">' + "<p>" + name + "</p>")
  $(tempDiv2).val(name);

  var tempDiv = $("<a>").attr("href", "playlist_guest.html").html($("<div>").html(tempDiv2));

  $("#playlistGrid").append(tempDiv); // append
})

// On click of playlist, store name into local storage to carry to redirect page
$("#playlistGrid").on("click", ".playlistRoom", function(){
  console.log($(this).val());
  localStorage.playlistName = $(this).val();
})

// On click of logo, go to index.html
$("#logo").on("click", function(){
  window.location.href = 'index.html';
})