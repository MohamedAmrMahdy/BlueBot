# BlueBot
[![Dependencies Status](https://david-dm.org/MohamedAmrMahdy/BlueBot.svg)](https://david-dm.org/MohamedAmrMahdy/BlueBot) 
## A Multi-functional Disocrd Bot With Configurable Settings For Each Server 
### Made With 💖 and lots of ☕ 

### General Commands

**// - Fun Commands - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|help| Used to get all commands menu with description and example| *help |
|Ping| Used to Test for Bot Response Time and check it's availablity | *ping |
|Quickpoll [Question]| Ask a question and get reply from our bot with yes or no| *Quickpoll Are you feeling cold ? |
|Random [lower limit] [higher limit] | Get a random number between lower limit and higher limit | *random 1 100 |

**// - Systems Commands - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|Verify | Add Verified role to you | *verify |
|Color [color_Name] | Assign color to you from server added colors | *color red|
|Unassigncolor [color_Name] | Unassign color from you | *unassigncolor red|

**// - Moderation Commands - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|Purge [X] | Delete X number of messages in the channel | *purge 20 |

**// - Information Commands - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|Botinfo | Show Bot Information like Uptime/MemUsage/Servers/channels/users | *botinfo |
|Serverinfo | Show Server Information like Name/owner and other stats about the server | *serverinfo |

### Config Commands

**// - Prefix System - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|Prefix [New Prefix]| Change Bot Prefix for your server (default prefix : " * " ) | *prefix ! |
|ResetPrefix | Change Bot Prefix for your server (default prefix : " * " ) | *resetprefix |

**// - Verify System - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|EnableVerify [channel_ID] [Role_Name]| Enable Verify system to server | *enableverify 409847462826852372 Verify |
|DisableVerify | Disable Verify system to server | *disableverify |

**// - Colors System - //**

| Command | Description | Example |
| ------ | ------ | ------ |
|addcolor [color_Name] [Role_Name]| Add Color to colors system | *addcolor red redish |
|removecolor [color_Name] | Removes Color from colors system | *removecolor red |

# TODO List:
- [x] Setup Project
- [x] Setup Bot
- [x] Connect to Database
- [x] Make Configurable Prefix
- [X] Add Ping Command
- [x] Add Quickpoll command 
*quickpoll [Question] ( return yes or no randomly on any question written)
- [x] Add Random command 
*random [lower limit] [higher limit] ( return random number between lower limit and higher limit)
- [X] Add Purge command 
*purge [N] ( delete N messages in the channel )
- [X] Show Number of servers the bot existed in with the number of clients served and channels
- [X] Add Show Bot Information Command
- [X] Add Server info command ( return all needed stats about the server )
- [X] Re-Style Messages
- [X] Add Help Command ( Shows all info about bot and commands )
- [X] Move Commands into modules folders
- [X] Add Verify System ( gives a specific role to sender or auto give role to new members )
- [X] Add Colors System ( change name's color by giving a specific role to sender )
- [ ] Add Privacy System ( can disable sending links or sending other server invite)
- [ ] Add Join/Leave System ( Sends a message to a channel when someone join or leave the server)
- [ ] Add Youtube Search System ( return N top results from a search query )
- [ ] Add SoundCloud Search System ( return N top results from a search query )
- [ ] Add Spotify Search System ( return N top results from a search query )
- [ ] Add lyrics Command
- [ ] Add Music Player System ( Queue of songs to play on voice channels )
*play [search string / URL] ( Use Youtube Search System to choose from and then play the song )
*playlist [search string / URL] ( Use Youtube Search System to choose from and then play the song )
*soundcloud [search string / URL] ( Use SoundCloud Search System to choose from and then play the song )
*spotify [search string / URL] ( Use Spotify Search System to choose from and then play the song )
*pause ( pause the music player )
*resume ( resume the music player )
*volume [N] ( adjust bot volume to N )
*queue ( shows all the songs in the queue) 
*stop ( clear queue and end music player)
*skip ( move to the next song in queue)
*remove [N] ( remove the N'th song in queue )
*move [l] [z] ( moves the song in position l to position z in queue)
*shuffle ( randomly shuffle the queue )
*nowplaying ( send song's title to text channel )
*repeat ( repeat queue without removing any song)
*time ( return the time in current song)
*seekto [l] ( moves to the l time in current song)
- [ ] Add RP System ( Collect info about member and show stats about him / give rewards)
- [ ] Add Calculate command ( evaluates input )
*calc [Equation] ( return result )

License
----

MIT
