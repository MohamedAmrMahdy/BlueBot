const Discord = require('discord.js');
const ytdl = require('ytdl-core');
const search = require('youtube-search');
const axios = require('axios');
const { SearchYoutubePlaylist, SearchYoutube, SearchSoundCloud } = require('../../../Axios/Search');

const regex = {
	YOUTUBE_VIDEO: /(?:https?:\/\/)?(?:www\.)?(youtube.com|youtu.be)/,
	YOUTUBE_PLAYLIST: /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
	SOUNDCLOUD_LINK: /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/
}

const emojiNumbers = ['0⃣', '1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];

//Show Bot Information like Uptime/MemUsage/Servers/channels/users
module.exports = {
	name: 'play',
	description: 'Initiate Music Player and play song',
	args: true,
	argsFailMsg: 'Please Enter Youtube Video URL / Youtube Playlist URL / SoundCloud URL / Search keyword',
	async execute(client, msg, server_prefix, args) {
		inputArg = args.join(" ");

		const oldmessage = await msg.channel.send(new Discord.RichEmbed()
			.setTitle('Checking for Youtube Video URL / Youtube Playlist URL / SoundCloud URL / Search keyword')
		);

		//[1]// Searching Phase
		const Search = SeachPhase(msg, inputArg, oldmessage);
		Search.then(results =>{
			console.log(results);
			//[2]// Structure Phase

		}).catch(msg.reply("Error or no response"));
		//[3]// Stream Phase

	},
};

function SeachPhase(msg, inputArg, oldmessage) {
	return new Promise(async function (resolve, reject) {
		let searchResults = [];
		/** contain needed data from search results
		 * - title
		 * - description
		 * - trackAuthor
		 * - trackThumbnail
		 * - trackID
		 */

		if (inputArg.match(regex.YOUTUBE_PLAYLIST)) {
			msg.channel.fetchMessage(oldmessage.id).then(msg => {
				const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle('Collecting data from tracks in playlist');
				msg.edit(NewEmbed)
			})

			let playlistID = inputArg.match(regex.YOUTUBE_PLAYLIST)[2];
			let results = await SearchYoutubePlaylist(playlistID).catch((err) => { console.log(err); });

			for (const video of results) {
				searchResults.push({
					title: video.snippet.title,
					description: video.snippet.description,
					trackAuthor: video.snippet.channelTitle,
					trackThumbnail: video.snippet.thumbnails.high.url,
					trackID: video.snippet.resourceId.videoId
				});
			}
			resolve(searchResults);
		} else if (inputArg.match(regex.YOUTUBE_VIDEO)) {
			msg.channel.fetchMessage(oldmessage.id).then(msg => {
				const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle('Collecting data from Youtube Video');
				msg.edit(NewEmbed)
			})

			let results = await SearchYoutube(inputArg).catch((err) => { console.log(err); });

			searchResults.push({
				title: results[0].snippet.title,
				description: results[0].snippet.description,
				trackAuthor: results[0].snippet.channelTitle,
				trackThumbnail: results[0].snippet.thumbnails.high.url,
				trackID: results[0].id.videoId
			});
			resolve(searchResults);
		} else if (inputArg.match(regex.SOUNDCLOUD_LINK)) {
			msg.channel.fetchMessage(oldmessage.id).then(msg => {
				const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle('Collecting data from Video');
				msg.edit(NewEmbed)
			})

		} else {
			msg.channel.fetchMessage(oldmessage.id).then(msg => {
				const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(`Searching for " ${inputArg} " in youtube`);
				msg.edit(NewEmbed)
			})

			let results = await SearchYoutube(inputArg).catch((err) => { console.log(err); });
			for (let i = 0; i < results.length; i++) {
				msg.channel.fetchMessage(oldmessage.id).then(msg => {
					const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0])
						.addField(`[${i + 1}] - ${results[i].snippet.channelTitle}`, `${results[i].snippet.title}`)
					msg.edit(NewEmbed).then(msg => msg.react(emojiNumbers[i + 1]))
				})
			}

			msg.channel.fetchMessage(oldmessage.id).then(message => {
				const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(`Choose a Result to play`);
				message.edit(NewEmbed).then(newerMessage => {

					const filter = (reaction, user) => {
						return emojiNumbers.includes(reaction.emoji.name) && user.id === msg.author.id;
					};

					newerMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
						.then(collected => {
							const reaction = collected.first();
							const number_collected = emojiNumbers.findIndex(element => { return element === reaction.emoji.name });
							newerMessage.clearReactions()
							message.reply(`You Choosed : ${results[number_collected - 1].snippet.title}`);
							searchResults.push({
								title: results[number_collected - 1].snippet.title,
								description: results[number_collected - 1].snippet.description,
								trackAuthor: results[number_collected - 1].snippet.channelTitle,
								trackThumbnail: results[number_collected - 1].snippet.thumbnails.high.url,
								trackID: results[number_collected - 1].id.videoId
							});
							resolve(searchResults);
						})
						.catch(collected => {
							console.log(collected);
							console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
							message.reply('you didn\'t react with neither results.');
							reject();
						});
				})
			})
		}
	})
}