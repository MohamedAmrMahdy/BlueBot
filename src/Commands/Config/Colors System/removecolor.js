const Discord = require('discord.js');
let dataBase = require('../../../database/database');
let dataBasef = require('../../../database/databasefunc');

module.exports = {
	name: 'removecolor',
    description: 'Removes Color from colors system',
    args: true,
    argsFailMsg: 'Please enter color name, read help example',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        let colorServerDB = client.serversDB[msg.guild.id].systems.colors;

        //check if system already disabled
        if(!colorServerDB.active) return msg.reply("Color doesn't exist and Colors system not active");

        //read channel id entered
        let colorname = args[0];

        //check if color exist
        if(!colorServerDB.colorsStored[colorname]) return msg.reply(`Color doesn't exist`);
        
        //restore database to default values
        dataBase.ref('/servers/' + msg.guild.id + '/systems/colors/colorsStored/' + colorname).remove().then(()=>{
    
            //Refresh Offline Data
            dataBasef.refreshServersDB(client).then(()=>{

                //refresh offline variable
                colorServerDB = client.serversDB[msg.guild.id].systems.colors;

                //check if if last color removed to deactivate the system
                if(!colorServerDB.colorsStored){
                    msg.reply(`last Color got removed and the color system got deactivated`);

                    //Deactivate the colors system
                    dataBase.ref('/servers/' + msg.guild.id + '/systems/colors/active').set(false).then(()=>{
                        
                        //Refresh Offline Data
                        dataBasef.refreshServersDB(client).then(()=>{
                            msg.reply(`${colorname} Color has been removed`); 
                        })
                    });
                }else{
                    //Refresh Offline Data
                    dataBasef.refreshServersDB(client).then(()=>{
                        msg.reply(`${colorname} Color has been removed`); 
                    })
                }
            })
        })
        
    },
};