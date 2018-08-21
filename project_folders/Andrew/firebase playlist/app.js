function generatePlaylist(token, userID) {

    var userID = "124009025";
    var playlistID = "7oDMrkzI3GI5IZvO95wVdN";
    var token = "BQAY6041r6pSmrhduztBqX4OkZSoUkC1ugVBWA6p6Mnvbx5Nl-DqRpM9tuKpaKQSINLwf3shov0JSDj3_5BnA00EEbnPzH00GovR5ON_tlG0TgdfIRtNqpHNunT0UOKaTdEPzPMwn9tBOOzYrCOsMvX3SorLNran4-rxHKobdAQ_v2NbP4BCHnden_co5DYhl6b5GZvVfSUhnOiA07x6xfi-T-BTaCWm_G74jzViO3IA6KMAxqi1HJ8";
    var queryURL = "https://api.spotify.com/v1/users/" + userID + "/playlists/" + playlistID + "/tracks";

    $.ajax({
        url: queryURL,
        headers: {
            'Authorization' : 'Bearer ' + token,
        },
        method: "GET"
        }).then(function(response) {
        console.log(response.items);

    })



}
generatePlaylist();
