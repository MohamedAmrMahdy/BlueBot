module.exports = {
	name: 'ping',
	description: 'Used to Test for Bot Response Time and check it\'s availablity',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
		msg.channel.send('Testing Bot Ping.....').then(sent => {
            sent.edit(`Bot Ping = ${(sent.createdTimestamp - msg.createdTimestamp)} ms`);
        });
	},
};