const Discord = require('discord.js');
const DefaultEmoji = require('node-emoji');
module.exports = {
	name: 'react',
	description: 'send a message with reaction / useful with nitro reacts',
    args: true,
    argsFailMsg: 'Enter the reaction name you wanna send',
	execute(client, msg, server_prefix, args) {
        let emoji = msg.guild.emojis.find(emoji => emoji.name === args[0]);
		if(emoji === null) {
            if (DefaultEmoji.hasEmoji(args[0].toLowerCase())) {
                emoji = DefaultEmoji.get(args[0].toLowerCase())
                msg.channel.fetchMessages({ limit: 2 }).then(messages => {
                    let lastMessage = messages.array()[1];
                    lastMessage.react(emoji);
                    msg.delete()
                })
                .catch(console.error);
            }
        };
    },
};