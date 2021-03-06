require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
let dataBase = require("./src/database/database");
let dataBasef = require("./src/database/databasefunc");
let antiAdsSys = require("./src/Moderation/antiads");
let logs = require("./src/Moderation/logs");
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.musicPlayerData = [];

//Scan commands in the commands folder recrusively, require them and add them to collection
function recrusiveCommandsRequire(folder) {
  fs.readdirSync(`${folder}`).forEach((file) => {
    //check if a javascript file
    if (file.endsWith(".js")) {
      const command = require(`${folder}/${file}`);
      client.commands.set(command.name, command);
      //check if a directory
    } else if (fs.lstatSync(folder + "/" + file).isDirectory()) {
      //send the directory to the function to scan
      recrusiveCommandsRequire(folder + "/" + file);
    }
  });
}

//initialise the bot after getting offline data
dataBasef.refreshServersDB(client).then(() => {
  // reading commands in the commands folder recrusively, require them and add them to collection
  recrusiveCommandsRequire("./src/Commands");

  // Login Identity
  client.login(process.env.BOT_IDENTITY);
});

// Trigger New Message Sent
client.on("message", (msg) => {
  //Anti-Ads system
  if (antiAdsSys.checkDiscordInvite(client, msg)) return;

  //Restructure the message
  const message = {
    prefix: msg.content[0],
    command: msg.content
      .toLowerCase()
      .slice(client.serversDB[msg.guild.id].prefix.length)
      .split(/ +/)[0],
    args: msg.content
      .split(/ +/)
      .slice(client.serversDB[msg.guild.id].prefix.length),
  };

  //Check if Self Talking & Using Prefix
  if (msg.author.bot || message.prefix != client.serversDB[msg.guild.id].prefix)
    return;

  //Track commands used
  console.log(message);

  //Check if command exist
  if (!client.commands.has(message.command)) return;

  //return command from commands stored
  const command = client.commands.get(message.command);

  //Check for arguments
  if (command.args && !message.args.length)
    return msg.channel.send(`${command.argsFailMsg}, ${msg.author}!`);

  //excute the command
  try {
    command.execute(
      client,
      msg,
      client.serversDB[msg.guild.id].prefix,
      message.args
    );
  } catch (error) {
    console.error(error);
    msg.reply(`command execution faild! \n Contact Bot Developers`);
  }
});

client
  .on("guildCreate", (guild) => {
    //When Bot joined a server
    console.log("Bot Joined a new Server: " + guild.name);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );

    //Add the server to the databse with default settings
    dataBase
      .ref("/servers/" + guild.id)
      .set({
        name: guild.name,
        prefix: "*",
        systems: {
          verify: {
            active: false,
            channelID: "-1",
            roleName: "-1",
          },
          logs: {
            active: false,
            channelID: "-1",
          },
          colors: {
            active: false,
          },
          antiads: {
            active: false,
          },
        },
      })
      .then(() => {
        //Refresh Offline Data
        dataBasef.refreshServersDB(client);
      });
  })
  .on("guildDelete", (guild) => {
    //When Bot get removed from a server
    console.log("Bot Left a Server: " + guild.name);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );

    //Remove the server to the databse with default settings
    dataBase
      .ref("/servers/" + guild.id)
      .remove()
      .then(() => {
        //Refresh Offline Data
        dataBasef.refreshServersDB(client);
      });
  })
  .on("guildMemberAdd", (m) => {
    //When someone join a server
    logs.joinedServer(client, m);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );
  })
  .on("guildMemberRemove", (m) => {
    //When someone leave a server
    logs.leftServer(client, m);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );
  })
  .on("guildBanAdd", (g, u) => {
    //When someone leave a server
    logs.leftServer(client, g, u);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );
  })
  .on("guildBanRemove", (g, u) => {
    //When someone leave a server
    logs.leftServer(client, g, u);
    client.user.setActivity(
      `with ${client.users.size} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`
    );
  })
  .on("ready", () => {
    console.log(`Bot Logged in as ${client.user.tag}!`);
    setInterval(async () => {
      let guilds = client.guilds.array();
      let users = [];

      for (var i = 0; i < guilds.length; i++) {
        let members = guilds[i].members.array();

        for (var i = 0; i < members.length; i++) {
          if (
            members[i].user.id !== client.user.id &&
            users.indexOf(members[i].user.id) === -1
          )
            users.push(members[i].user.id);
        }
      }
      await client.user
        .setActivity(
          `with ${users.length} Users | ${client.guilds.size} Servers | ${client.channels.size} Channels`,
          { type: "WATCHING" }
        )
        .catch((err) => console.error(err));
    }, 1000);
  })
  .on("disconnect", () => console.warn("Bot is disconnecting..."))
  .on("reconnecting", () => console.log("Bot reconnecting..."))
  .on("rateLimit", (rateLimitInfo) => console.info(rateLimitInfo))
  .on("error", (e) => console.error(e))
  .on("warn", (e) => console.warn(e))
  .on("debug", (e) => console.info(e));
