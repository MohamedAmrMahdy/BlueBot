const Discord = require('discord.js');
let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');

module.exports = {
	name: 'disableverify',
    description: 'Disable Verify system to server',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        const verifyServerDB = client.serversDB[msg.guild.id].systems.verify;

        //check if already disabled
        if(!verifyServerDB.active){
            msg.reply(`The System is already disabled on this server`);
        }else{

            //restore database to default values
            dataBase.ref('/servers/' + msg.guild.id + '/systems/verify').set({
                active: false,
                channelID: "-1",
                roleName: "-1"
            }).then(()=>{
                
                //Refresh Offline Data
                dataBasef.refreshServersDB(client).then(()=>{
                    msg.reply("Verify System Disabled");
                })
            })
        }
    },
};