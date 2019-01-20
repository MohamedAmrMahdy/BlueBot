const Discord = require('discord.js');
const client = new Discord.Client();

// Trigger New Message Sent
client.on('message', msg => {

    // reply with pong when read the message contain ping
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }

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
