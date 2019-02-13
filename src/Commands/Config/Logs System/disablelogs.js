const Discord = require('discord.js');
let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');

module.exports = {
	name: 'disablelogs',
    description: 'Disable Logs system to server',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
        //get logs settings for the server from the database
        const logsServerDB = client.serversDB[msg.guild.id].systems.logs;
        //check if system already enabled
        if(!logsServerDB.active){
            msg.reply(`The System is already disabled on this server`);
        }else{
            //restore database to default values
            dataBase.ref('/servers/' + msg.guild.id + '/systems/logs').set({
                active: false,
                channelID: "-1"
            }).then(()=>{
                //Refresh Offline Data
                dataBasef.refreshServersDB(client).then(()=>{
                    msg.reply("Logs System Disabled"); 
                })
            })
        }
    },
};