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
console.log(roomNameRef);

// Declare variables
var isHost = false;
var token = "BQCT6DSi9InPRpOepVsvd1RKwchMge9172D6auFSB7kaSLRj5O9O_QX_cXhYTzTHHdvKqEBKhpPcPaZFDqktpj8j0yU8K3L2ifNLVg91wPJDU9piv29kPdIIhGw_GWAK9vdpgxTGjdnd1LFpHqQdzO_Vq74yybcTsxELyj6PuB7vdxkp24z6-7jShCKFsPYmmD2nE3YapozEmVlHsFCVim3jpLaIGuGkvZ4k89LYt5HKU8BdnEz7v1M";
var roomName = "test";
console.log(roomName);
var roomNameRef = database.ref().child(roomName);

// function to get user id (not used currently)
search("africa");

function search (track) {
    queryURL = "https://api.spotify.com/v1/search?type=track&market=us&limit=5&q=" + track;
    user = "124009025";

    $.ajax({
        url: queryURL,
        headers: {
            'Authorization' : 'Bearer ' + token,
        },
            method: "GET"
            }).then(function(response) {
            console.log(response);
            console.log(response.tracks.items);
                ////////////////////////////////////
            // enter to firebase
            roomNameRef.update({"tracks": response.tracks.items});
    }
)}

var count = 0;
roomNameRef.child("tracks").on("value", function(snapshot) {
    console.log(snapshot.val());
    count++;
    console.log("count: " + count)

    // append current tracks
    var tracks = snapshot.val();
    var i = 0;
    // for (var i = 0; i < tracks.length; i++){
        
    // }

    var tempH3 = $("<h3>").text(tracks[i].name).addClass("song-title uk-card-title");
    var tempP = $("<p>").text(tracks[i].artists[0].name).addClass("artist-name");
    // tempH3.append(tempP);
    var tempDiv = $("<div class='uk-card-body uk-width-5-6@s uk-animation-slide-top-small'>")
    
    tempDiv.append(tempH3, tempP);

    var tempCanvas = $("<canvas width='117' height='117'></canvas>");
    var tempImg = $("<img>").addClass("artist-icon").attr("src", "assets/images/childish.jpg").attr("alt", "Image").attr("uk-cover");
    var tempDiv2 = $("<div>").addClass("uk-card-media-right uk-flex-last uk-cover-container uk-width-1-6@s uk-animation-slide-top-small").attr("id", "avatar");
    tempDiv2.append(tempCanvas, tempImg);

    var tempDiv3 = $("<div>").addClass("uk-card-hover uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin uk-animation-toggle").attr("uk-grid");
    // tempDiv3.append(tempDiv, tempDiv2);
    $("#playlistQueue").append(tempDiv, tempDiv2);


})

$("#test-button").on("click", function(){
    console.log("test");
    roomNameRef.update({"tracks/0": "test"});
    roomNameRef.child("tracks")
})