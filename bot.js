const fs = require('fs');
const Discord = require('discord.js');
let dataBase = require('./src/database/database');
const client = new Discord.Client();

client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

// reading commands in the Collection and require them
for (const file of commandFiles) {
	const command = require(`./src/commands/${file}`);
	client.commands.set(command.name, command);
}

// Trigger New Message Sent
client.on('message', msg => {
    //get server prefix
    dataBase.ref('/servers/' + msg.guild.id + '/prefix').once('value').then( async (snapshot) => {
        server_prefix = snapshot.val()

        //Restructure the message
        const message = {
            prefix: msg.content[0],
            command: msg.content.toLowerCase().slice(server_prefix.length).split(/ +/)[0],
            args: msg.content.toLowerCase().split(/ +/).slice(server_prefix.length),
        }

        //Check if Self Talking & Using Prefix
        if (msg.author.bot || message.prefix != server_prefix) return;

        //Check if command exist
        if (!client.commands.has(message.command)) return msg.reply("Not A Registered Command");

        const command = client.commands.get(message.command);

        //Check for arguments
        if (command.args && !message.args.length) return msg.channel.send(`${command.argsFailMsg}, ${msg.author}!`);

        console.log(message);

        //excute the command
        try {
            command.execute(client, msg, server_prefix, message.args);
        } catch (error) {
            console.error(error);
            msg.reply(`command execution faild! \n Contact Bot Developers`);
        }
    });
});

// Login Identity
client.login(process.env.BOT_IDENTITY);

client.on('guildCreate', (guild) => { //When Bot joined a server
        console.log("Bot Joined a new Server: " + guild.name);
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 
        //Add the server to the databse with default settings
        dataBase.ref('/servers/' + guild.id).set({
            name: guild.name,
            prefix: DEFAULT_PREFIX
        });
    })
    .on('guildDelete', (guild) => { //When Bot get removed from a server
        console.log("Bot Left a Server: " + guild.name);
        client.user.setActivity(`with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`); 
        //Remove the server to the databse with default settings
        dataBase.ref('/servers/' + guild.id).remove();
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