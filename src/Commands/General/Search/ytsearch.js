const Discord = require('discord.js');
const { SearchYoutube } = require('../../../Axios/Search');

module.exports = {
	name: 'ytsearch',
    description: 'Search YouTube videos',
    args: true,
    argsFailMsg: 'Enter Search Keywords',
	execute(client, msg, server_prefix, args) {
        SearchYoutube(args.join(" ")).then((results)=>{

            for (const video of results){
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setThumbnail(video.snippet.thumbnails.high.url)
                    .addField(`✇ ${video.snippet.title} :`,`
                    ➽ Channel Name: ${video.snippet.channelTitle}
                    ➽ Description: 
                    ${video.snippet.description}
                    ➽ Video URL: 
                    https://www.youtube.com/watch?v=${video.id.videoId}
                    ➽ Channel URL: 
                    https://www.youtube.com/channel/${video.snippet.channelId}
                    `)
                );
            }
        });
    },
};
