const Discord = require('discord.js');
const client = new Discord.Client();

//FireBase Setup
let admin = require("firebase-admin");
let serviceAccount = {
    "type": "service_account",
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key.replace(/\\n/g, '\n'),
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.client_x509_cert_url
    };
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://blue-bot-discord.firebaseio.com"
});
let db = admin.database();

// Trigger New Message Sent
client.on('message', msg => {
    //Restructure the message
    const message = {   prefix: msg.content[0] , 
                        command: msg.content.toLowerCase().slice(1).split(" ")[0],
                        args: msg.content.toLowerCase().split(" ").slice(1),
                    }
    //get server prefix
    let server_prefix = "*"
    db.ref('/servers/'+msg.guild.id+'/prefix').on('value', (snapshot)=>{ server_prefix = snapshot.val() });

    //Check if Self Talking & Using Prefix
    if(msg.author.id == client.id ||
        message.prefix != server_prefix
        ) return;

    //switch between commands
    switch (message.command) {
        case "ping":
            msg.reply("pong");
            break;
        case "test":
            msg.reply("Testing Success");
            break;
        //Reset The Server Data on the database
        case "resetthisserver":
            db.ref('/servers/' + msg.guild.id).set({name: msg.guild.name , prefix: '$'});
            msg.reply("Reset Success");
            break;
        //Change Server Prefix on the database
        case "prefix":
            db.ref('/servers/' + msg.guild.id + '/prefix').set(message.args[0]);
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
    db.ref('/servers/' + guild.id).set({name: guild.name , prefix: '$'});
});

//Removed from a server
client.on("guildDelete", guild => {
    console.log("Bot Left a Server: " + guild.name);
    //Remove the server to the databse with default settings
    db.ref('/servers/' + guild.id).remove();
});

// DEBUG / INFO
client.on('ready', () => {
    console.log(`Bot Logged in as ${client.user.tag}!`)
    //Update the Database servers count where the bot exists
    db.ref('/botstates/').set({servers: client.guilds.size});
    })
    .on('disconnect', () => console.warn("Bot is disconnecting..."))
    .on('reconnecting', () => console.log("Bot reconnecting..."))
    .on('error', (e) => console.error(e))
    .on('warn', (e) => console.warn(e))
    .on('debug', (e) => console.info(e));
