//Pause Music Player
module.exports = {
	name: 'pause',
	description: 'Pauses Music Player',
	args: false,
	argsFailMsg: '',
	async execute(client, msg, server_prefix, args) {
		if(client.musicPlayerData[msg.guild.id] === undefined) return;
        if(client.musicPlayerData[msg.guild.id].dispatcher === undefined) return;
        if(!client.musicPlayerData[msg.guild.id].playing) return;

        client.musicPlayerData[msg.guild.id].dispatcher.pause();
        client.musicPlayerData[msg.guild.id].playing = false;

	},
};