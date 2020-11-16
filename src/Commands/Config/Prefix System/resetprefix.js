let dataBase = require("../../../database/database");
let dataBasef = require("../../../database/databasefunc");
const Discord = require("discord.js");

module.exports = {
  name: "resetprefix",
  description: "Reset The Server Prefix on the database",
  args: false,
  argsFailMsg: "",
  execute(client, msg, server_prefix, args) {
    //Change Server Prefix on the database to default
    dataBase
      .ref("/servers/" + msg.guild.id)
      .set({
        name: msg.guild.name,
        prefix: "*",
      })
      .then(() => {
        //Refresh Offline Data
        dataBasef.refreshServersDB(client).then(() => {
          msg.channel.send(
            new Discord.RichEmbed()
              .setColor("#2962ff")
              .setDescription(`${msg.author},`)
              .addField(
                `✇ Server Resetted Successfully`,
                `
                        ➽ Name: ${msg.guild.name}
                        ➽ Prefix: ${"*"}
                    `
              )
          );
        });
      });
  },
};
