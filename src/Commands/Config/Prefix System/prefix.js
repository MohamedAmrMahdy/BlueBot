let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');
const Discord = require('discord.js');

module.exports = {
	name: 'prefix',
	description: 'Change Bot Prefix for your server (default prefix : " * " )',
    args: true,
    argsFailMsg: 'Enter thre new prefix',
	execute(client, msg, server_prefix, args) {
        //Change Server Prefix on the database
		dataBase.ref('/servers/' + msg.guild.id + '/prefix').set(args[0]).then(()=>{

            //Refresh Offline Data
            dataBasef.refreshServersDB(client).then(()=>{
                msg.channel.sendEmbed(new Discord.RichEmbed()
                .setColor('#2962ff')
                .setDescription(`${msg.author},`)
                .addField(`✇ Prefix Changed`,`
                    ➽ The new server prefix now is ${args[0]}
                `)
            );
            })
        })
	},
};