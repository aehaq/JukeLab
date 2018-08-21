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
var roomNameRef = database.ref().child(roomName);

var roomNameRef = database.ref().child(roomName);

var userID;
var deviceId;
var playlistID;
var songArray = [];

console.log(roomName);

// Change room name
$("#playlistName").text(roomName);

// if user is host, make new playlist and add key to database
if (window.location.href.includes("access_token")) {
    var isHost = true;
    token = parseURL(window.location.href);
    console.log("parsed token: " + token);
    roomName = roomName;
    userID = getUserID();
    console.log(userID);
    // makePlaylist();
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
        userID = getUserID();
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
player.addListener('player_state_changed', state => { 
    console.log(state); 
    // If the song finishes playing
    if (state.position === 0 && paused === true) {
        songArray.shift();
        roomNameRef.child("list").set(songArray);
    }
});

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

$('#pauseSongBtn').on("click", function() {
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
function getUserID () {
    queryURL = "https://api.spotify.com/v1/me";

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
        // if (isHost) {
        //     makePlaylist(userID);
        // }
    })
    return userID;
}

// append current tracks and updates on track change
roomNameRef.on("value", function(snapshot) {
    // console.log(snapshot.val());    



    // console.log(songArray);

    $(".songAppend").empty();

    // if no songs in playlist
    if (!snapshot.val().list) {
        // var tempP = $("<p>").addClass("song-title uk-margin-remove").text(snapshot.val().list[i].title);
        // var tempP2 = $("<p>").addClass("artist-name uk-margin-remove").text("By: " + snapshot.val().list[i].artist);
        // tempDiv = $("<div>").addClass("song-info").append(tempP, tempP2);
        songArray=[];
        tempDiv2 = $("<div>").addClass("uk-card-body trackItem").html('<img class="artist-icon" src=' + "https://partyspace.com/images/blog_entries/no-music.png" + ' alt="Image">');
        tempDiv3 = $("<div uk-grid>").addClass("trackCard uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin").append(tempDiv2);
        $(".songAppend").append(tempDiv3);
    }
    else {
        // sets global var to current playlist
        songArray = snapshot.val().list;
        
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

// TEST BUTTON TO ADD SONG, DELETE ON FINAL
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

//////////////////////////////////////////////////////////////

// When the search button is clicked.
$('#search').on("click", function() {
    event.preventDefault();

    console.log('Search function clicked');

    $('#search-results').empty();

    // Pulls search info    
    var searchQuery = $("#search-input").val();
    
    //Query URL for searching songs, note: Only takes one query, type needs to be selected    
    var searchUrl = "https://api.spotify.com/v1/search?q=" + searchQuery + "&type=track"
    
    //Searches Spotify for song info
    $.ajax({
        url: searchUrl,
        headers: {
            'Authorization' : 'Bearer ' + token,
        },
        method: "GET"
    }).then(function(response) {
        console.log(response);
        var results = response.tracks.items;

        // Grabs info regarding the first few results
        for (let i = 0; i < 10; i++) {
            var song = results[i];
            var artist = song.artists[0].name;
            var title = song.name;
            var id = song.id;
            var imgLarge = song.album.images[0].url;
            var imgMed = song.album.images[1].url;

            //Prints card info
            var resultCard = $('<button class="option uk-modal-close uk-card-hover uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin-small uk-animation-toggle" uk-grid>'); 

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

// // Make Spotify Playlist (No longer using)
// function makePlaylist (userID) {
//     $.post({
//         data: '{"name": "jukeLab", "public": false}',
//         headers: {
//             'Authorization' : 'Bearer ' + token,
//             'Content-Type' : "application/json"
//         },
//         url: 'https://api.spotify.com/v1/users/'+ userID +'/playlists',
//         success: function(newPlaylist) {
//             console.log(newPlaylist);
//             playlistID = newPlaylist.id;
//             console.log(playlistID)
//         },
//         error: function(errorObject) {
//             console.log("Ajax Post failed")
//             console.log(errorObject)
//         }
//     })
// }

//////////////////////////

//Add songs to firebase when selected from search

$(document).on('click', '.option', function() {
    event.preventDefault();

    var title = $(this).attr("title");
    var artist = $(this).attr("artist");
    var id = $(this).attr("song-id");
    var imgLarge = $(this).attr("lrg-img");
    var imgMed = $(this).attr("med-img");

    songArray.push(
        {
            title : title,
            artist : artist,
            id : id,
            imgLarge : imgLarge,
            imgSmall : imgMed
        }
    );
    roomNameRef.child("list").set(songArray);

})


// Add songs to list from array

function printCurrent(snapList) {

    //grab variables for first song
    var title = snapList[0].title;
    var artist = snapList[0].artist;
    var id = snapList[0].id;
    var img = snapList[0].imgLarge;

    //begin playing first song
    if (isHost) {

        var loadURL = 'https://api.spotify.com/v1/me/player/play?device_id=' + deviceId
        $.ajax({
            url: loadURL,
            headers: {
                'Authorization' : 'Bearer ' + token,
    
            },
            data: '{"uris": ["spotify:track:'+id+'"]}',
            method: "PUT"
        })
    }

    //display lyrics for playing song
    var orionApiKey = "B11C1C1z1RkD3pCAbR5LpaftjkpaST0q2JICuY7SYx7jzSvYZ2IadJv0I98lLrAU"
    var queryLyrics = "https://orion.apiseeds.com/api/music/lyric/" + artist +"/" + title + "?apikey=" + orionApiKey

    $.ajax({
        url: queryLyrics,
        method: "GET"
    }).then(function(response) {
        var song = response.result.track;
        console.log(song)
        var lyrics = song.text
        if (lyrics) {
            $('#lyrics').html('<h4 id="lyricsDisplay" class="uk-padding">'  +lyrics.replace(/\r\n|\r|\n/g, "</br>")+ '</h4>')
        } else {
            $('#lyrics').html('<h4 id="lyricsDisplay" class="uk-padding"> Sorry, no Lyrics available for this track. </h4>')
        };
    });

    //Clear old playlist
    $('#upcoming').empty();

    //display currently playing song
    var trackContainer = $('<div class="trackCard uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin" uk-grid>'); 

    var trackCard = $('<div class="uk-card-body trackItem">')

    var infoCard = $(' <div class="song-info">');
    
    infoCard.append(' <p class="song-title uk-margin-remove">'+title+'</p><p class="artist-name uk-margin-remove">by '+artist+'</p>');
    var previewImg = $(' <img class="artist-icon" src="'+img+'" alt="Image">')

    trackCard.append(infoCard);
    trackCard.append(previewImg)
    trackContainer.append(trackCard);
    $('#upcoming').append(trackContainer)


    //display info for queued songs
    for (let i = 1; i < snapList.length; i++) {
        let item = snapList[i];

        var title = item.title;
        var artist = item.artist;
        var img = item.imgLarge;

        var trackContainer = $('<div class="trackCard uk-card uk-card-small uk-card-default uk-grid-collapse uk-margin" uk-grid>'); 

        var trackCard = $('<div class="uk-card-body trackItem">')

        var infoCard = $(' <div class="song-info">');

        infoCard.append(' <p class="song-title uk-margin-remove">'+title+'</p><p class="artist-name uk-margin-remove">by '+artist+'</p>');
        var previewImg = $(' <img class="artist-icon" src="'+img+'" alt="Image">')

        trackCard.append(infoCard);
        trackCard.append(previewImg)
        trackContainer.append(trackCard);
        $('#upcoming').append(trackContainer)
    }

}

roomNameRef.on("value", function(snapshot) {
    var snapList = snapshot.val().list
    printCurrent(snapList)
});

