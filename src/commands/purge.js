const Discord = require('discord.js');

module.exports = {
	name: 'purge',
	description: 'Delete X number of messages in the channel',
    args: true,
    argsFailMsg: 'Please provide a number of messsages to be deleted',
	async execute(client, msg, server_prefix, args) {
        const delNum = parseInt(args[0],10);
        if ( !delNum || delNum < 2 || delNum > 100 )
            return msg.reply("Please provide a number between 2 and 100");
        //return messages to delete 
        const fetchedMessages = await msg.channel.fetchMessages({limit: delNum});
        msg.channel.bulkDelete(fetchedMessages).catch(e => msg.reply('Failed To Delete Messages Check Premissions'));
    },
};