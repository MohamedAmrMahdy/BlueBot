const Discord = require("discord.js");

//translates varification code to text
const HUMAN_LEVELS = {
  0: "No Verification",
  1: "[Low] Must Have Verified Email",
  2: "[Medium] Must Have Verified Email & Registered on Discord for longer than 5 minutes",
  3: "[(╯°□°）╯︵ ┻━┻] Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes",
  4: "[┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻] Must Have Verified Email & Registered on Discord for longer than 5 minutes & Member on this server for more than 10 minutes & verified phone",
};

module.exports = {
  name: "serverinfo",
  description:
    "Show Server Information like Name/owner and other stats about the server",
  args: false,
  argsFailMsg: "",
  execute(client, msg, server_prefix, args) {
    msg.channel.send(
      new Discord.RichEmbed()
        .setColor("#2962ff")
        .setDescription(`${msg.author},`)
        .setThumbnail(
          msg.guild.iconURL ? msg.guild.iconURL : msg.author.avatarURL
        )
        .addField(
          "✇ About Server:",
          `
            ➽ Name: ${msg.guild.name}
            ➽ ID: ${msg.guild.id} 
            ➽ Server Verification Level: ${
              HUMAN_LEVELS[msg.guild.verificationLevel]
            }
            ➽ Server Region: ${msg.guild.region}
            ➽ Server Verification: ${msg.guild.verified}
            ➽ Server Prefix: '${server_prefix}[command]'
            `
        )
        .addField(
          "✇ About Owner:",
          `
            ➽ Server Owner: ${msg.guild.owner}
            ➽ Server Owner ID: ${msg.guild.ownerID}
            `
        )
        .addField(
          "✇ Server Stats:",
          `
            ➽ Server Members Count: ${msg.guild.members.size}
            ➽ Server Text Channels Count: ${
              msg.guild.channels.filter((ch) => ch.type === "text").size
            }
            ➽ Server Voice Channels Count: ${
              msg.guild.channels.filter((ch) => ch.type === "voice").size
            }
            ➽ Server Creation Date: ${msg.guild.createdAt}
            `
        )
    );
  },
};
