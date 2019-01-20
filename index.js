const Discord = require('discord.js');
const client = new Discord.Client();

// Trigger Bot Started
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Trigger New Message Sent
client.on('message', msg => {

    // reply with pong when read the message contain ping
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }

});

// Login Identity
client.login(process.env.BOT_IDENTITY);

//DEBUG
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
client.on('debug', (e) => console.info(e));
