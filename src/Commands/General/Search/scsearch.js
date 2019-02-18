const Discord = require('discord.js');
const request = require('request');
const axios = require('axios');
const MAX_RESULTS = 5;

async function SearchSoundCloud (keywords){
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
module.exports = {
	name: 'scsearch',
    description: 'Search SoundCloud Tracks',
    args: true,
    argsFailMsg: 'Enter Search Keywords',
	execute(client, msg, server_prefix, args) {
        SearchSoundCloud(args.join(" ")).then((results)=>{
            if(!results[0]) return msg.reply("No Results Found Search by Title, Username or Description");
            for (const track of results){
                msg.channel.send(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setThumbnail(track.artwork_url)
                    .addField(`✇ ${track.title} :`,`
                    ➽ User Name: ${track.user.username}
                    ➽ Genre: 
                    ${track.genre}
                    ➽ Track URL: 
                    ${track.permalink_url}
                    ➽ Channel URL: 
                    ${track.user.permalink_url}
                    `)
                );
            }
        });
    },
};