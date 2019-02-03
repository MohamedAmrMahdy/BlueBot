const Discord = require('discord.js');

module.exports = {
	name: 'random',
	description: 'Return Random number between range given',
    args: true,
    argsFailMsg: 'Enter the lowest and highest expected number',
	execute(client, msg, server_prefix, args) {
        msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('#2962ff')
            .setDescription(`${msg.author},`)
            .addField(`✇ Random Generated Number Between ${args[0]} and ${args[1]}:`,`
                ➽ ${(Math.floor(Math.random() * parseInt(args[1])) + parseInt(args[0]))}
            `)
        );
    },
};