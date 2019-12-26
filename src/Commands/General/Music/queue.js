const Discord = require("discord.js");
//Show Music Player Queue
module.exports = {
	name: 'queue',
	description: 'Shows Music Player Queue',
	args: false,
	argsFailMsg: '',
	async execute(client, msg, server_prefix, args) {
		if(client.musicPlayerData[msg.guild.id] === undefined) return;
        if(client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
        let richEmbed = new Discord.RichEmbed()
        richEmbed.fields = [];
        richEmbed.setTitle("🤖 Queue").setColor("#2962ff");
        client.musicPlayerData[msg.guild.id].queue.map(song => {
            richEmbed.addField(`${song.title}`,`Author : ${song.trackAuthor} | Requested by : ${song.requester.user.username}`)
        })
        msg.channel.send(richEmbed)
	},
};