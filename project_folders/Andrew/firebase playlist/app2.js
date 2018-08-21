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
var token = "BQAY6041r6pSmrhduztBqX4OkZSoUkC1ugVBWA6p6Mnvbx5Nl-DqRpM9tuKpaKQSINLwf3shov0JSDj3_5BnA00EEbnPzH00GovR5ON_tlG0TgdfIRtNqpHNunT0UOKaTdEPzPMwn9tBOOzYrCOsMvX3SorLNran4-rxHKobdAQ_v2NbP4BCHnden_co5DYhl6b5GZvVfSUhnOiA07x6xfi-T-BTaCWm_G74jzViO3IA6KMAxqi1HJ8";
var roomName = "craig's playlist";
console.log(roomName);
var roomNameRef = database.ref().child(roomName);
var songArray = [];

// // function to get user id (not used currently)
// search("africa");

// function search (track) {
//     queryURL = "https://api.spotify.com/v1/search?type=track&market=us&limit=5&q=" + track;
//     user = "124009025";

//     $.ajax({
//         url: queryURL,
//         headers: {
//             'Authorization' : 'Bearer ' + token,
//         },
//             method: "GET"
//             }).then(function(response) {
//             console.log(response);
//             console.log(response.tracks.items);
//                 ////////////////////////////////////
//             // enter to firebase
//             roomNameRef.update({"tracks": response.tracks.items});
//     }
// )}
// roomNameRef.child("list").set([{
//     title : "Africa",
//     artist : "Toto",
//     id : "id",
//     imgLarge : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg",
//     imgSmall : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg"
// },
// {
//     title : "Africa2",
//     artist : "Toto2",
//     id : "id",
//     imgLarge : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg",
//     imgSmall : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg"
// },
// {
//     title : "Africa2",
//     artist : "Toto2",
//     id : "id",
//     imgLarge : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg",
//     imgSmall : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg"
// },
// {
//     title : "Africa2",
//     artist : "Toto2",
//     id : "id",
//     imgLarge : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg",
//     imgSmall : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg"
// },
// ]);

var count = 3;
roomNameRef.on("child_added", function(snapshot) {
    console.log(snapshot.val());
    console.log("count: " + count)

    // append current tracks
})

// append current tracks and updates on track change
roomNameRef.on("value", function(snapshot) {
    // console.log(snapshot.val());    
    songArray = snapshot.val();
    console.log(songArray);

    // sets global var to current playlist
    songArray = snapshot.val().list;
    // console.log(songArray);

    $(".songAppend").empty();

    console.log(snapshot.val().list);
    // if empty
    if (!snapshot.val().list) {
        // var tempP = $("<p>").addClass("song-title uk-margin-remove").text(snapshot.val().list[i].title);
        // var tempP2 = $("<p>").addClass("artist-name uk-margin-remove").text("By: " + snapshot.val().list[i].artist);
        // tempDiv = $("<div>").addClass("song-info").append(tempP, tempP2);
        tempDiv2 = $("<div>").addClass("uk-card-body trackItem").html('<img class="artist-icon" src=' + "https://partyspace.com/images/blog_entries/no-music.png" + ' alt="Image">');
        tempDiv3 = $("<div uk-grid>").addClass("trackCard uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin").append(tempDiv2);
        $(".songAppend").append(tempDiv3);
    }
    else {
        // for every item in firebase array, append song card
        for (var i = 0; i < snapshot.val().list.length; i++) {
            var tempP = $("<p>").addClass("song-title uk-margin-remove").text(snapshot.val().list[i].title);
            var tempP2 = $("<p>").addClass("artist-name uk-margin-remove").text("By: " + snapshot.val().list[i].artist);
            tempDiv = $("<div>").addClass("song-info").append(tempP, tempP2);
            tempDiv2 = $("<div>").addClass("uk-card-body trackItem").html('<img class="artist-icon" src=' + snapshot.val().list[i].imgSmall + ' alt="Image">').prepend(tempDiv);
            tempDiv3 = $("<div uk-grid>").addClass("trackCard uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin").append(tempDiv2);
            $(".songAppend").append(tempDiv3);
        }
    }
})

$("#test-button").on("click", function(){
    songArray.push(
        {
            title : "Africa",
            artist : "Toto",
            id : "id",
            imgLarge : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg",
            imgSmall : "https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/95/8e/f3/958ef37f-f942-288f-de15-ec914a25b2a3/074643772822.jpg/313x0w.jpg"
        }
    );
    roomNameRef.child("list").set(songArray);
})