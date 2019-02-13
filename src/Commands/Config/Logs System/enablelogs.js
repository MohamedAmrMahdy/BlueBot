const Discord = require('discord.js');
let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');

module.exports = {
	name: 'enablelogs',
    description: 'Enable Logs system to server',
    args: true,
    argsFailMsg: 'Please enter channel id to send logs and log level',
	execute(client, msg, server_prefix, args) {
        //get logs settings for the server from the database
        const logsServerDB = client.serversDB[msg.guild.id].systems.logs;
        //check if system already enabled
        if(logsServerDB.active){
            msg.reply(`The System is already enabled on this server`);
        }else{
            //read channel id entered
            let channelid = args[0];

            //restore database to default values
            dataBase.ref('/servers/' + msg.guild.id + '/systems/logs').set({
                active: true,
                channelID: channelid
            }).then(()=>{
                //Refresh Offline Data
                dataBasef.refreshServersDB(client).then(()=>{
                    msg.reply("Logs System Activated"); 
                })
            })
        }
    },
};