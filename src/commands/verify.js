const Discord = require('discord.js');

module.exports = {
	name: 'verify',
    description: 'Add Verified role to user',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        const verifyServerDB = client.serversDB[msg.guild.id].systems.verify;

        //check if the verify system enabled on server
        if(!verifyServerDB.active) return msg.reply(`Not Enabled on this server use ${server_prefix}enableverify`);

        //check for specific channel
        if(verifyServerDB.channelID != msg.channel.id && verifyServerDB.channelID != "-1" ) return;

        //check for already having the role
        const role = msg.guild.roles.find(r => r.name === verifyServerDB.roleName);
        if(msg.member.roles.some(role => role.name === verifyServerDB.roleName)) return msg.reply("You already have the role");
        
        //get bot highest role pos
        highestRolePos = -1;
        msg.guild.me.roles.map((role)=>{if(role.position>highestRolePos)highestRolePos=role.position});

        //check if bot role lower than the assigning role
        if(highestRolePos<role.position) return msg.reply(`Cannot Assign role check bot have higher role than ${role.name} role`);

        //check if bot has manage roles premission
        if(!msg.guild.me.hasPermission('MANAGE_ROLES')) return msg.reply(`Cannot Assign role check for premission 'Manage Roles' given to bot`);
                
        //give role to message author
        msg.member.addRole(role).then(()=>{
            msg.react('👍');
            msg.reply("You Have Been Verified");
        }).catch((e)=>{
            console.log(e);
        });
        
    },
};