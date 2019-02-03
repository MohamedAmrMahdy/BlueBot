const Discord = require('discord.js');
let dataBase = require('../database/database');
let dataBasef = require('../database/databasefunc');

module.exports = {
	name: 'enableverify',
    description: 'Enable Verify system to server',
    args: true,
    argsFailMsg: 'Please enter channel id to track and the role to give, read help example',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        const verifyServerDB = client.serversDB[msg.guild.id].systems.verify;
        //check if system already enabled
        if(verifyServerDB.active){
            msg.reply(`The System is already enabled on this server`);
        }else{
            //read channel id entered
            let channelid = args[0];

            //read role name entered
            let rolename = args.join(" ").slice(channelid.length+1);

            //restore database to default values
            dataBase.ref('/servers/' + msg.guild.id + '/systems/verify').set({
                active: true,
                channelID: channelid,
                roleName: rolename
            }).then(()=>{

                //Refresh Offline Data
                dataBasef.refreshServersDB(client).then(()=>{
                    msg.reply("Verify System Activated"); 
                })
            })
        }
    },
};