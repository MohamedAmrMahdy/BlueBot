const axios = require('axios');
const MAX_RESULTS = 4;
const MAX_PLAYLIST_RESULTS = 25;

module.exports.SearchSoundCloud = async function (keywords){
    try {
        const response = await axios.get('https://api.soundcloud.com/tracks/', {
            params: {
                client_id: process.env.soundcloud_IDENTITY,
                q: keywords,
                linked_partitioning: 1,
                limit: MAX_RESULTS
            }
        })
        return response.data.collection;
    } catch (error) {
        console.error(error);
    }
};

module.exports.SearchYoutube = async function (keywords){
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                key: process.env.youtube_IDENTITY,
                part: "snippet",
                q: keywords,
                type: "video",
                order: "relevance",
                maxResults: MAX_RESULTS
            }
        })
        return response.data.items;
    } catch (error) {
        console.error(error);
    }
};

module.exports.SearchYoutubePlaylist = async function (keywords){
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
            params: {
                key: process.env.youtube_IDENTITY,
                part: "snippet",
                playlistId: keywords,
                maxResults: MAX_PLAYLIST_RESULTS
            }
        })
        return response.data.items;
    } catch (error) {
        console.error(error);
    }
};