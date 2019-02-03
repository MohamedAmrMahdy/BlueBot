const Discord = require('discord.js');

module.exports = {
	name: 'unassigncolor',
    description: 'Unassign color from you',
    args: true,
    argsFailMsg: 'Enter color name',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        const colorServerDB = client.serversDB[msg.guild.id].systems.colors;

        //read channel id entered
        let colorname = args[0];

        //try to get the role from server roles
        const role = msg.guild.roles.find(r => r.name === colorServerDB.colorsStored[colorname]);

        //check if role exist
        if(!role) return msg.reply("role doesn't exist");

        //check for not having the role
        if(!msg.member.roles.some(role => role.name === colorServerDB.colorsStored[colorname])) return msg.reply("You already dont have the color assigned");
        
        //get bot highest role pos
        highestRolePos = -1;
        msg.guild.me.roles.map((role)=>{if(role.position>highestRolePos)highestRolePos=role.position});

        //check if bot role lower than the assigning role
        if(highestRolePos<role.position) return msg.reply(`Cannot Assign role check bot have higher role than ${colorname} role`);

        //check if bot has manage roles premission
        if(!msg.guild.me.hasPermission('MANAGE_ROLES')) return msg.reply(`Cannot Assign role check for premission 'Manage Roles' given to bot`);
        
        //give role to message author
        msg.member.removeRole(role).then(()=>{
            msg.reply("Color have been removed");
        }).catch((e)=>{
            console.log(e);
        });
        
    },
};