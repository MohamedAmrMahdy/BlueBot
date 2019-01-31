const Discord = require('discord.js');
const moment = require('moment');
const mDF = require('moment-duration-format');
const client = new Discord.Client();
let dataBase = require('./database');

const DEFAULT_PREFIX = '*'
const HUMAN_LEVELS = ({
	0: 'No Verification',
	1: '[Low] Must Have Verified Email',
	2: '[Medium] Must Have Verified Email & Registered on Discord for longer than 5 minutes',
	3: '[(╯°□°）╯︵ ┻━┻] Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes',
	4: '[┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻] Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes & verified phone'
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
    let server_prefix = DEFAULT_PREFIX
    dataBase.ref('/servers/' + msg.guild.id + '/prefix').once('value').then( async (snapshot) => {
        server_prefix = snapshot.val()

        //Check if Self Talking & Using Prefix
        if (msg.author.bot || message.prefix != server_prefix) return;

        //switch between commands
        switch (message.command) {
            //Help Command
            case 'help':
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .addField(`✇ [ Fun ]`,`
                        ➽ Ping: 
                        Used to Test for Bot Response Time and check it's availablity
                        EXAMPLE: ${server_prefix}ping

                        ➽ Prefix [New Prefix]: 
                        Change Bot Prefix for your server (default prefix : " * " )
                        EXAMPLE: ${server_prefix}prefix ${(server_prefix=='!')?'*':'!'}

                        ➽ Quickpoll [Question]: 
                        Ask a question and get reply from our bot with yes or no
                        EXAMPLE: ${server_prefix}quickpoll Are you feeling cold ?

                        ➽ Random [X] [Y]: 
                        Get a random number between X and Y
                        EXAMPLE: ${server_prefix}random 1 100
                    `)
                    .addField(`✇ [ Moderation ]`,`
                    ➽ Purge [X]: 
                    Delete X number of messages in the channel
                    EXAMPLE: ${server_prefix}purge 20
                    `)
                    .addField(`✇ [ Information ]`,`
                    ➽ Botinfo: 
                    Show Bot Information like Uptime/MemUsage/Servers/channels/users
                    EXAMPLE: ${server_prefix}botinfo
                    
                    ➽ Serverinfo: 
                    Show Server Information like Name/owner and other stats about the server
                    EXAMPLE: ${server_prefix}serverinfo
                    `)
                );
                break;

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
                    prefix: DEFAULT_PREFIX
                });
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .addField(`✇ Server Resetted Successfully`,`
                        ➽ Name: ${msg.guild.name}
                        ➽ Prefix: ${DEFAULT_PREFIX}
                    `)
                );
                break;

            //Change Server Prefix on the database
            case "prefix":
                dataBase.ref('/servers/' + msg.guild.id + '/prefix').set(message.args[0]);
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .addField(`✇ Prefix Changed`,`
                        ➽ The new server prefix now is ${message.args[0]}
                    `)
                );
                break;

            //Return Random Yes or No
            case "quickpoll":
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .addField(`✇ ${message.args.join(' ').toUpperCase()}`,`
                        ➽ ${Math.random() >= 0.5? " Yes" : " No" }
                    `)
                );
                break;

            //Return Random number between range given
            case "random":
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .addField(`✇ Random Generated Number Between ${message.args[0]} and ${message.args[1]}:`,`
                        ➽ ${(Math.floor(Math.random() * parseInt(message.args[1])) + parseInt(message.args[0]))}
                    `)
                );
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
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .setThumbnail(client.avatarURL?client.avatarURL:msg.author.avatarURL)
                    .addField('✇ Bot Informations:',`
                        ➽ UpTime: ${moment.duration(client.uptime).format('d[d ]h[h ]m[m ]s[s]')}
                        ➽ Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB
                        ➽ Servers: ${client.guilds.size}
                        ➽ Channels: ${client.channels.size}
                        ➽ Clients: ${client.users.size}
                        ➽ Joined This Server In: ${msg.guild.joinedAt}
                    `)
                );
                break;
    
            //Shows info all about the server   
            case 'serverinfo':
                msg.channel.sendEmbed(new Discord.RichEmbed()
                    .setColor('#2962ff')
                    .setDescription(`${msg.author},`)
                    .setThumbnail(msg.guild.iconURL?msg.guild.iconURL:msg.author.avatarURL)
                    .addField('✇ About Server:',`
                    ➽ Name: ${msg.guild.name}
                    ➽ ID: ${msg.guild.id} 
                    ➽ Server Verification Level: ${HUMAN_LEVELS[msg.guild.verificationLevel]}
                    ➽ Server Region: ${msg.guild.region}
                    ➽ Server Verification: ${msg.guild.verified}
                    ➽ Server Prefix: '${server_prefix}[command]'
                    `)
                    .addField('✇ About Owner:',`
                    ➽ Server Owner: ${msg.guild.owner}
                    ➽ Server Owner ID: ${msg.guild.ownerID}
                    `)
                    .addField('✇ Server Stats:',`
                    ➽ Server Members Count: ${msg.guild.members.size}
                    ➽ Server Text Channels Count: ${msg.guild.channels.filter(ch => ch.type === 'text').size}
                    ➽ Server Voice Channels Count: ${msg.guild.channels.filter(ch => ch.type === 'voice').size}
                    ➽ Server Creation Date: ${msg.guild.createdAt}
                    `)
                );
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