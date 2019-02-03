const Discord = require('discord.js');
let dataBase = require('../database/database');
let dataBasef = require('../database/databasefunc');

module.exports = {
	name: 'addcolor',
    description: 'Add Color to colors system',
    args: true,
    argsFailMsg: 'Please enter color name and role name, read help example',
	execute(client, msg, server_prefix, args) {
        //get verify settings for the server from the database
        const colorServerDB = client.serversDB[msg.guild.id].systems.colors;
        
        //read channel id entered
        let colorname = args[0];
        
        //read role name entered
        let rolename = args.join(" ").slice(colorname.length+1);

        //try to get the role from server roles
        const role = msg.guild.roles.find(r => r.name === rolename);

        //check if role exist
        if(!role) return msg.reply("role doesn't exist");

        //check if system already disabled
        if(!colorServerDB.active){
            msg.reply(`First Color Added and activated the color system`);
            dataBase.ref('/servers/' + msg.guild.id + '/systems/colors/active').set(true);
        }

        //restore database to default values
        dataBase.ref('/servers/' + msg.guild.id + '/systems/colors/colorsStored/' + colorname).set(rolename).then(()=>{

            //Refresh Offline Data
            dataBasef.refreshServersDB(client).then(()=>{
                msg.reply(`${colorname} Color have been added used ${server_prefix}color ${colorname} to assign it on you`); 
            })
        })
        
    },
};