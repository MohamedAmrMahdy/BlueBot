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
        if(!verifyServerDB.active){
            msg.reply(`Not Enabled on this server use ${server_prefix}enableverify`);
        }else{
            //check for specific channel
            if(verifyServerDB.channelID != msg.channel.id && verifyServerDB.channelID != "-1" ) return;

            //check for already having the role
            const role = msg.guild.roles.find(r => r.name === verifyServerDB.roleName);
            if(msg.member.roles.some(role => role.name === verifyServerDB.roleName)) return msg.reply("You already have the role");
            
            //give role to message author
            try{
                msg.member.addRole(role).then(()=>{
                    msg.reply("You have been Verified");
                });
            }catch(e){
                msg.reply("Failed");
            }
        }
    },
};