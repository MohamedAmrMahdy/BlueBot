const Discord = require('discord.js');
const moment = require('moment');
const mDF = require('moment-duration-format');
const client = new Discord.Client();
let dataBase = require('./database');

const HUMAN_LEVELS = ({
	0: 'No Verification',
	1: 'Low: Must Have Verified Email',
	2: 'Medium: Must Have Verified Email & Registered on Discord for longer than 5 minutes',
	3: '(╯°□°）╯︵ ┻━┻: Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes',
	4: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻: Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes & verified phone'
});

// Trigger New Message Sent
client.on('message', async msg => {
    //Restructure the message
    const message = {
        prefix: msg.content[0],
        command: msg.content.toLowerCase().slice(1).split(" ")[0],
        args: msg.content.toLowerCase().split(" ").slice(1),
    }

    //get server prefix
    let server_prefix = "*"
    dataBase.ref('/servers/' + msg.guild.id + '/prefix').once('value').then( async (snapshot) => {
        server_prefix = snapshot.val()

        //Check if Self Talking & Using Prefix
        if (msg.author.bot || message.prefix != server_prefix) return;

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
                dataBase.ref('/servers/' + msg.guild.id).set({
                    name: msg.guild.name,
                    prefix: '$'
                });
                msg.reply("Reset Success");
                break;

            //Change Server Prefix on the database
            case "prefix":
                dataBase.ref('/servers/' + msg.guild.id + '/prefix').set(message.args[0]);
                msg.reply("Prefix Changed Successfully to : " + message.args[0]);
                break;

            //Return Random Yes or No
            case "quickpoll":
                msg.reply(`${Math.random() >= 0.5? " Yes" : " No" }`);
                break;

            //Return Random number between range given
            case "random":
                msg.reply(`${(Math.floor(Math.random() * parseInt(message.args[1])) + parseInt(message.args[0]))}`);
                break;

            //Delete [delNum] Messages in channel
            case 'purge':
                const delNum = parseInt(message.args[0],10);
                if ( !delNum || delNum < 2 || delNum > 100 )
                    return msg.reply("Please provide a number between 2 and 100");
                //return messages to delete 
                const fetchedMessages = await msg.channel.fetchMessages({limit: delNum});
                msg.channel.bulkDelete(fetchedMessages).catch(e => msg.reply('Failed To Delete Messages Check Premissions'));
                break;

            //Show Bot Information like Uptime/MemUsage/Servers/channels/users
            case 'botinfo':
                msg.reply(`UpTime: ${moment.duration(client.uptime).format('d[d ]h[h ]m[m ]s[s]')} | Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB | Servers: ${client.guilds.size} | Channels: ${client.channels.size} | Clients: ${client.users.size}`);
                break;

            //Shows info all about the server   
            case 'serverinfo':
                msg.reply(`Server Name: ${msg.guild.name} 
                Server ID: ${msg.guild.id} 
                Server Verification Level: ${HUMAN_LEVELS[msg.guild.verificationLevel]}
                Server Owner: ${msg.guild.owner}
                Server Owner ID: ${msg.guild.ownerID}
                Server Region: ${msg.guild.region}
                Server Verification: ${msg.guild.verified}
                Server Prefix: '${server_prefix}[command]' 
                Server Members Count: ${msg.guild.members.size}
                Server Text Channels Count: ${msg.guild.channels.filter(ch => ch.type === 'text').size}
                Server Voice Channels Count: ${msg.guild.channels.filter(ch => ch.type === 'voice').size}
                Server Creation Date: ${msg.guild.joinedAt}`)
                break;

            default:
                msg.reply("Not A Registered Command");
                break;
        }
        console.log(message);
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
            prefix: '$'
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