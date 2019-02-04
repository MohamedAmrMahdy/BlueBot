const Discord = require('discord.js');
let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');

module.exports = {
	name: 'enableantiads',
    description: 'Enable AntiAds system to server',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
        //get antiads settings for the server from the database
        const antiadsServerDB = client.serversDB[msg.guild.id].systems.antiads;
        
        //check if system already enabled
        if(antiadsServerDB.active){
            msg.reply(`The System is already enabled on this server`);
        }else{
            //restore database to default values
            dataBase.ref('/servers/' + msg.guild.id + '/systems/antiads/active').set(true).then(()=>{

                //Refresh Offline Data
                dataBasef.refreshServersDB(client).then(()=>{
                    msg.reply("Antiads System Activated"); 
                })
            })
        }
    },
};