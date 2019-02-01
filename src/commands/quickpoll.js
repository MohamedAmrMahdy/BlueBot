const Discord = require('discord.js');

//Return Random Yes or No
module.exports = {
	name: 'quickpoll',
	description: 'Ask a question and get reply from our bot with yes or no',
    args: true,
    argsFailMsg: 'Enter the question you wanna ask',
	execute(client, msg, server_prefix, args) {
        msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('#2962ff')
            .setDescription(`${msg.author},`)
            .addField(`✇ ${args.join(' ').toUpperCase()}`,`
                ➽ ${Math.random() >= 0.5? " Yes" : " No" }
            `)
        );
    },
};