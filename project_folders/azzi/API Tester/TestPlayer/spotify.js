window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQAGaCaSxnAj3B_dbkqrP2PDkCbzLe7odr0yCnFbmVfhreASCBN24I1X_FnihMEo71PzN1Molb1EBvLnvoxjqvIV_vgkiCfIZSBwj1VsbTPG50_6GScPV0FN5cGt7J1W9Wnhskvu69rgblEXhwSThuXx8MDIy_3wPv97Xw4RlRiIQlUSzPD5gB8eVSBtmCUaFCBZ5gHtVjozFKchKH_FQBvD4NEgz8t3Cho0-ixb4SPU90BftE2ANZo';
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