const Discord = require('discord.js');
const client = new Discord.Client();

const SERVER_PREFIX = "$"

// Trigger New Message Sent
client.on('message', msg => {
    //Restructure the message
    const message = {   prefix: msg.content[0] , 
                        command: msg.content.toLowerCase().slice(1).split(" ")[0],
                        args: msg.content.toLowerCase().split(" ").slice(1),
                    }

    //Check if Self Talking
    if(msg.author.id == client.id ||
        message.prefix != SERVER_PREFIX
        ) return;

    //switch between commands
    switch (message.command) {
        case "ping":
            msg.reply("pong");
            break;
        case "test":
            msg.reply("Testing Success");
            break;
        default:
            msg.reply("Not A Registered Command");
            break;
    }
    console.log(message);
});


// Login Identity
client.login(process.env.BOT_IDENTITY);

// DEBUG / INFO
client.on('ready', () => console.log(`Bot Logged in as ${client.user.tag}!`))
    .on('disconnect', () => console.warn("Bot is disconnecting..."))
    .on('reconnecting', () => console.log("Bot reconnecting..."))
    .on('error', (e) => console.error(e))
    .on('warn', (e) => console.warn(e))
    .on('debug', (e) => console.info(e));
