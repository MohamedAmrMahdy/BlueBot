const Discord = require('discord.js');
const client = new Discord.Client();
let dataBase = require('./database');

// Trigger New Message Sent
client.on('message', msg => {
    //Restructure the message
    const message = {   
        prefix: msg.content[0] , 
        command: msg.content.toLowerCase().slice(1).split(" ")[0],
        args: msg.content.toLowerCase().split(" ").slice(1),
    }

    //get server prefix
    let server_prefix = "*"
    dataBase.ref('/servers/'+msg.guild.id+'/prefix')
            .on('value', (snapshot)=>{ server_prefix = snapshot.val() });

    //Check if Self Talking & Using Prefix
    if(msg.author.id == client.id || message.prefix != server_prefix) return;

    //switch between commands
    switch (message.command) {
        //Simple Command for Testing bot response
        case "ping":
            msg.channel.send('Testing Bot Ping.....').then(sent => {
                sent.edit(`Bot Ping = ${(sent.createdTimestamp - msg.createdTimestamp)} ms`);
            });
            break;

        //Reset The Server Data on the database
        case "resetthisserver":
            dataBase.ref('/servers/' + msg.guild.id).set({name: msg.guild.name , prefix: '$'});
            msg.reply("Reset Success");
            break;

        //Change Server Prefix on the database
        case "prefix":
            dataBase.ref('/servers/' + msg.guild.id + '/prefix').set(message.args[0]);
            msg.reply("Prefix Changed Successfully to : " + message.args[0]);
            break;

        default:
            msg.reply("Not A Registered Command");
            break;
    }
    console.log(message);
});

// Login Identity
client.login(process.env.BOT_IDENTITY);

//Joined a server
client.on("guildCreate", guild => {
    console.log("Bot Joined a new Server: " + guild.name);
    //Add the server to the databse with default settings
    dataBase.ref('/servers/' + guild.id).set({name: guild.name , prefix: '$'});
});

//Removed from a server
client.on("guildDelete", guild => {
    console.log("Bot Left a Server: " + guild.name);
    //Remove the server to the databse with default settings
    dataBase.ref('/servers/' + guild.id).remove();
});

// DEBUG / INFO
client.on('ready', () => {
    console.log(`Bot Logged in as ${client.user.tag}!`)
    //Update the Database servers count where the bot exists
    dataBase.ref('/botstates/').set({servers: client.guilds.size});
    })
    .on('disconnect', () => console.warn("Bot is disconnecting..."))
    .on('reconnecting', () => console.log("Bot reconnecting..."))
    .on('error', (e) => console.error(e))
    .on('warn', (e) => console.warn(e))
    .on('debug', (e) => console.info(e));