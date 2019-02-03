const fs = require('fs');
const Discord = require('discord.js');
let dataBase = require('./src/database/database');
let dataBasef = require('./src/database/databasefunc');
const client = new Discord.Client();
client.commands = new Discord.Collection();

//initialise the bot after getting offline data
dataBasef.refreshServersDB(client).then(()=>{
    // reading commands in the commands folder , require them and add them to collection
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
    }

    // Login Identity
    client.login(process.env.BOT_IDENTITY);
})

// Trigger New Message Sent
client.on('message', msg => {
    //Restructure the message
    const message = {
        prefix: msg.content[0],
        command: msg.content.toLowerCase().slice(client.serversDB[msg.guild.id].prefix.length).split(/ +/)[0],
        args: msg.content.split(/ +/).slice(client.serversDB[msg.guild.id].prefix.length),
    };

    //Check if Self Talking & Using Prefix
    if (msg.author.bot || message.prefix != client.serversDB[msg.guild.id].prefix) return;

    //Track commands used
    console.log(message);

    //Check if command exist
    if (!client.commands.has(message.command)) return msg.reply("Not A Registered Command");

    //return command from commands stored
    const command = client.commands.get(message.command);

    //Check for arguments
    if (command.args && !message.args.length) return msg.channel.send(`${command.argsFailMsg}, ${msg.author}!`);

    //excute the command
    try {
        command.execute(client, msg, client.serversDB[msg.guild.id].prefix, message.args);
    } catch (error) {
        console.error(error);
        msg.reply(`command execution faild! \n Contact Bot Developers`);
    };
});

client.on('guildCreate', (guild) => { //When Bot joined a server
        console.log("Bot Joined a new Server: " + guild.name);
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 

        //Add the server to the databse with default settings
        dataBase.ref('/servers/' + guild.id).set({
            name: guild.name,
            prefix: '*',
            systems : {
                verify : {
                    active : false,
                    channelID : "-1",
                    roleName : "-1"
                },
                colors:{
                    active: false
                }
            }
        }).then(()=>{
            //Refresh Offline Data
            dataBasef.refreshServersDB (client);
        });
    })
    .on('guildDelete', (guild) => { //When Bot get removed from a server
        console.log("Bot Left a Server: " + guild.name);
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 

        //Remove the server to the databse with default settings
        dataBase.ref('/servers/' + guild.id).remove().then(()=>{
            
            //Refresh Offline Data
            dataBasef.refreshServersDB (client);
        });
    })
    .on('guildMemberAdd', () => { //When someone join a server
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 
    })
    .on('guildMemberRemove', () => { //When someone leave a server
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 
    })
    .on('ready', () => {
        console.log(`Bot Logged in as ${client.user.tag}!`)
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 
    })
    .on('disconnect', () => console.warn("Bot is disconnecting..."))
    .on('reconnecting', () => console.log("Bot reconnecting..."))
    .on('error', (e) => console.error(e))
    .on('warn', (e) => console.warn(e))
    .on('debug', (e) => console.info(e));