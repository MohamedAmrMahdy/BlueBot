const Discord = require('discord.js');
//Stop Music Player and clear queue
module.exports = {
	name: 'stop',
	description: 'Stop Music Player',
	args: false,
	argsFailMsg: '',
	async execute(client, msg, server_prefix, args) {
        if(client.musicPlayerData[msg.guild.id] === undefined) return;
        if(client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
        client.musicPlayerData[msg.guild.id].queue = [];
        client.musicPlayerData[msg.guild.id].playing = false;
        client.musicPlayerData[msg.guild.id].dispatcher.end();
	},
};