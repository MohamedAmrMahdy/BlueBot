const Discord = require("discord.js");

module.exports = {
  name: "help",
  description: "Used to get all commands menu with description and example",
  args: false,
  argsFailMsg: "",
  execute(client, msg, server_prefix, args) {
    msg.channel.send(
      new Discord.RichEmbed()
        .setColor("#2962ff")
        .setDescription(`${msg.author},`)
        .addField(
          `✇ [ Fun ]`,
          `
                ➽ Help:
                Get all info about bot usage
                EXAMPLE: ${server_prefix}help

                ➽ Ping:
                Used to Test for Bot Response Time and check it's availablity
                EXAMPLE: ${server_prefix}ping

                ➽ Quickpoll [Question]:
                Ask a question and get reply from our bot with yes or no
                EXAMPLE: ${server_prefix}quickpoll Are you feeling cold ?

                ➽ Random [X] [Y]:
                Get a random number between X and Y
                EXAMPLE: ${server_prefix}random 1 100
            `
        )
        .addField(
          `✇ [ Moderation ]`,
          `
                ➽ Purge [X]:
                Delete X number of messages in the channel
                EXAMPLE: ${server_prefix}purge 20

            `
        )
        .addField(
          `✇ [ Information ]`,
          `
                ➽ Botinfo:
                Show Bot Information like Uptime/MemUsage/Servers/channels/users
                EXAMPLE: ${server_prefix}botinfo

                ➽ Serverinfo:
                Show Server Information like Name/owner and other stats about the server
                EXAMPLE: ${server_prefix}serverinfo
            `
        )
        .addField(
          `✇ [ Prefix System ]`,
          `
                ➽ Prefix [New Prefix]: | REQUIRES ADMINSTRATOR
                Change Bot Prefix for your server to [New Prefix]
                EXAMPLE: ${server_prefix}prefix ${
            server_prefix == "!" ? "*" : "!"
          }

                ➽ ResetPrefix: | REQUIRES ADMINSTRATOR
                Change Bot Prefix for your server to default prefix : " * "
                EXAMPLE: ${server_prefix}resetprefix
            `
        )
    );
  },
};
