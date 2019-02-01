let dataBase = require('../database/database');
const Discord = require('discord.js');

 //Reset The Server Prefix on the database
module.exports = {
	name: 'resetprefix',
	description: 'Change Bot Prefix for your server (default prefix : " * " )',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
		dataBase.ref('/servers/' + msg.guild.id).set({
            name: msg.guild.name,
            prefix: '*'
        });
        msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('#2962ff')
            .setDescription(`${msg.author},`)
            .addField(`✇ Server Resetted Successfully`,`
                ➽ Name: ${msg.guild.name}
                ➽ Prefix: ${'*'}
            `)
        );
	},
};

//Change Server Prefix on the database
module.exports = {
	name: 'prefix',
	description: 'Ping!',
    args: true,
    argsFailMsg: 'Enter thre new prefix',
	execute(client, msg, server_prefix, args) {
		dataBase.ref('/servers/' + msg.guild.id + '/prefix').set(args[0]);
        msg.channel.sendEmbed(new Discord.RichEmbed()
            .setColor('#2962ff')
            .setDescription(`${msg.author},`)
            .addField(`✇ Prefix Changed`,`
                ➽ The new server prefix now is ${args[0]}
            `)
        );
	},
};