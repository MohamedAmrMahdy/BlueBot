module.exports = {
    checkDiscordInvite (client, msg){
        if(!client.serversDB[msg.guild.id]) return;
        //get antiads settings for the server from the database
        const antiadsServerDB = client.serversDB[msg.guild.id].systems.antiads;

        //check if the system is active
        if(!antiadsServerDB.active) return false;

        // Detect dicord links
        if (/(discord+.+gg)|(.gg)/.exec(msg.content)){
            msg.delete();
            msg.reply("You Are not allowed to advertise");
            return true
        }
        return false;
    }
}