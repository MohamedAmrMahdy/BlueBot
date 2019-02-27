//Resume Music Player
module.exports = {
	name: 'resume',
	description: 'Resume Music Player',
	args: false,
	argsFailMsg: '',
	async execute(client, msg, server_prefix, args) {
	if(client.musicPlayerData[msg.guild.id] === undefined) return;
        if(client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
        if(client.musicPlayerData[msg.guild.id].playing) return;

        client.musicPlayerData[msg.guild.id].dispatcher.resume();
        client.musicPlayerData[msg.guild.id].playing = true;
        
	},
};