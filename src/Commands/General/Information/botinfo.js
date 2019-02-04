const Discord = require('discord.js');
const moment = require('moment');
const mDF = require('moment-duration-format');

//Show Bot Information like Uptime/MemUsage/Servers/channels/users
module.exports = {
	name: 'botinfo',
    description: 'Show Bot Information like Uptime/MemUsage/Servers/channels/users',
    args: false,
    argsFailMsg: '',
	execute(client, msg, server_prefix, args) {
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
    },
};