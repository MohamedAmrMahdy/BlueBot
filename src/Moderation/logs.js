module.exports.joinedServer = (client, member) =>{
    const logsServerDB = client.serversDB[member.guild.id].systems.logs;
    if(!logsServerDB.active) return;
    const ch = member.guild.channels.find(c => c.id === logsServerDB.channelID);
    ch.send(`🚀 ${member}, Joined Server`);
}
module.exports.leftServer = (client, member) =>{
    const logsServerDB = client.serversDB[member.guild.id].systems.logs;
    if(!logsServerDB.active) return;
    const ch = member.guild.channels.find(c => c.id === logsServerDB.channelID);
    ch.send(`🚧 ${member}, Left Server`);
}
module.exports.banAdded = (client, guild, user) =>{
    const logsServerDB = client.serversDB[guild.id].systems.logs;
    if(!logsServerDB.active) return;
    const ch = guild.channels.find(c => c.id === logsServerDB.channelID);
    ch.send(`🔒 ${user}, Added to Ban list`);
}
module.exports.banRemoved = (client, guild, user) =>{
    const logsServerDB = client.serversDB[guild.id].systems.logs;
    if(!logsServerDB.active) return;
    const ch = guild.channels.find(c => c.id === logsServerDB.channelID);
    ch.send(`🔓 ${user}, Removed from Ban list`);
}