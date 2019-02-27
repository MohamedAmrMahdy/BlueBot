//Unmute Music Player
module.exports = {
	name: 'unmute',
	description: 'Unmute Music Player',
	args: false,
	argsFailMsg: '',
	async execute(client, msg, server_prefix, args) {
		if (client.musicPlayerData[msg.guild.id] === undefined) return;
		if (client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
		if (!client.musicPlayerData[msg.guild.id].playing) return;

		client.musicPlayerData[msg.guild.id].muted = false;
		client.musicPlayerData[msg.guild.id].dispatcher.setVolume(client.musicPlayerData[msg.guild.id].volume);
	},
};