const Discord = require('discord.js');
const VOLUMECHANGEVALUE = 20;
//Change Music Player Volume
module.exports = {
	name: 'volume',
	description: 'Unmute Music Player',
	args: true,
	argsFailMsg: 'Enter a volume or use [up|down]',
	async execute(client, msg, server_prefix, args) {
        if(client.musicPlayerData[msg.guild.id] === undefined) return;
        if(client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
        let newVolume = client.musicPlayerData[msg.guild.id].volume;
        if(args[0] == 'up'){
            newVolume = Math.max((client.musicPlayerData[msg.guild.id].volume * 100 + VOLUMECHANGEVALUE)) / 100;
            if( newVolume <= 1 && newVolume >= 0 ) client.musicPlayerData[msg.guild.id].volume = newVolume ;
        }else if (args[0] == 'down'){
            newVolume = Math.max((client.musicPlayerData[msg.guild.id].volume * 100 - VOLUMECHANGEVALUE)) / 100;
            if( newVolume <= 1 && newVolume >= 0 ) client.musicPlayerData[msg.guild.id].volume = newVolume ;
        }else {
            newVolume = parseInt(args[0])/100;
            if( newVolume <= 1 && newVolume >= 0 ) client.musicPlayerData[msg.guild.id].volume = newVolume ;
        }
        console.log(client.musicPlayerData[msg.guild.id].volume);
        client.musicPlayerData[msg.guild.id].dispatcher.setVolume(client.musicPlayerData[msg.guild.id].volume);
        (client.musicPlayerData[msg.guild.id].volume == 0)? client.musicPlayerData[msg.guild.id].muted = true:client.musicPlayerData[msg.guild.id].muted = false;
	},
};