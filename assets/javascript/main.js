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

function authorizeSpotify() {
    var token = "";
    var userID = "";
    var clientID = "b93cd2a896b04db6968176145cd8537f";
    var redirectURI = "https://atton88.github.io/spotify-test/playlist_host.html";
    var scopeParameter = "&scope=playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private user-read-currently-playing user-modify-playback-state user-read-playback-state app-remote-control streaming user-read-recently-played user-read-birthdate user-read-email user-read-private";
    var queryURL = "https://accounts.spotify.com/authorize/?client_id=" + clientID + "&response_type=token&redirect_uri=" + redirectURI + scopeParameter;
    
    console.log("current url: " + window.location.href);
    // var teststr = "https://atton88.github.io/spotify-test/#access_token=BQAdcq499rKKgiIIMgbS4bercAR_HZWgsAIiqg1q4hb2DUHbKgqY_CKnfNvayC83gPsjiBDmE3rSVQQzBZ5tSW66eiP7yT9J2ca9UIqK2rsB_HP5DOqOfWohieiA6liFvfHfLkhZeOMs5g&token_type=Bearer&expires_in=3600";
    window.open(queryURL,"_self");
}

// authorize spotify and save playlist name to firebase
$("#spotifyLoginBtn").on("click", function(){
  console.log($("#newPlaylistName").val());
  var userId = $("#newPlaylistName").val();
  // playlist cant be blank, replace with form validation
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

  var tempDiv2 = $("<div>").attr("class", "uk-card uk-card-default uk-card-body uk-padding-small playlistRoom");
  tempDiv2.html('<img class="roundPlaylistImg" src="temp-images/drake.jpg" alt="">' + "<p>" + name + "</p>")

  $(tempDiv2).val(name);
  // console.log("set val " + $(tempDiv2).val());
  // console.log($(tempDiv2));

  var tempDiv = $("<a>").attr("href", "playlist_guest.html");
    tempDiv.html(
      $("<div>").html(tempDiv2)
    )


  $("#playlistGrid").append(tempDiv);
})

$("#playlistGrid").on("click", ".playlistRoom", function(){
  console.log($(this).val());
  localStorage.playlistName = $(this).val();
})