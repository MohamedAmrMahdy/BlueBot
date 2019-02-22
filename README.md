# Welcome to BlueBot
[![Dependencies Status](https://david-dm.org/MohamedAmrMahdy/BlueBot.svg)](https://david-dm.org/MohamedAmrMahdy/BlueBot) 
A Multi-functional Disocrd Bot With Configurable Settings For Each Server, Made With 💖 and lots of ☕ 
> **Note:** The Bot Still under development.
## General Commands

| Command Type 	| Command	| Description | Example |
| ------------- | --------- | ------ | ------ |
|Fun 			|help		| Used to get all commands menu with description and example| *help |
|Fun 			|Ping		| Used to Test for Bot Response Time and check it's availablity | *ping |
|Fun 			|Quickpoll [Question]| Ask a question and get reply from our bot with yes or no| *Quickpoll Are you feeling cold ? |
|Fun 			|Random [lower limit] [higher limit] | Get a random number between lower limit and higher limit | *random 1 100 |
|Verify System 	|Verify | Add Verified role to you | *verify |
|Color  System 	|Color [color_Name] | Assign color to you from server added colors | *color red|
|Color  System 	|Unassigncolor [color_Name] | Unassign color from you | *unassigncolor red|
|Moderation 	|Purge [X] | Delete X number of messages in the channel | *purge 20 |
|Information 	|Botinfo | Show Bot Information like Uptime/MemUsage/Servers/channels/users | *botinfo |
|Information 	|Serverinfo | Show Server Information like Name/owner and other stats about the server | *serverinfo |
|Search 		|YTsearch | Search YouTube videos | *YTsearch alan walker |
|Search 		|SCsearch | Search SoundCloud Tracks | *SCsearch Daya Hide Away|

##  Config Commands
| Command Type | Command | Description | Example |
| ------| ------ | ------ | ------ |
|Prefix System |Prefix [New Prefix] | Change Bot Prefix for your server (default prefix : " * " ) | *prefix ! |
|Prefix System |ResetPrefix | Change Bot Prefix for your server (default prefix : " * " ) | *resetprefix |
|Verify System |EnableVerify [channel_ID] [Role_Name] | Enable Verify system to server | *enableverify 409847462826852372 Verify |
|Verify System |DisableVerify | Disable Verify system to server | *disableverify |
|Color System |addcolor [color_Name] [Role_Name] | Add Color to colors system | *addcolor red redish |
|Color  System |removecolor [color_Name] | Removes Color from colors system | *removecolor red |
|Anti-Ads System |enableantiads | Enable AntiAds system to server | *enableantiads |
|Anti-Ads System |disableantiads | Disable AntiAds system from server | *disableantiads |
|Logs System |enablelogs [channel_ID] | Enable logs system to server | *enablelogss 409847462826852372 |
|Logs System |disablelogs | Disable logs system from server | *disablelogs |

## TODO List:
- [x] Setup Project
- [x] Setup Bot
- [x] Connect to Database
- [x] Make Configurable Prefix
- [X] Add Ping Command
- [x] Add Quickpoll command 
- [x] Add Random command 
- [X] Add Purge command 
- [X] Show Number of servers the bot existed in with the number of clients served and channels
- [X] Add Show Bot Information Command
- [X] Add Server info command ( return all needed stats about the server )
- [X] Re-Style Messages
- [X] Add Help Command ( Shows all info about bot and commands )
- [X] Move Commands into modules folders
- [X] Add Verify System ( gives a specific role to sender or auto give role to new members )
- [X] Add Colors System ( change name's color by giving a specific role to sender )
- [X] Add AntiAds System ( detect discord invites and delete them )
- [X] Add Logs System ( Sends a message to a channel when someone join or leave the server / got banned)
- [X] Add Youtube Search Command ( return top results from a search query )
- [X] Add SoundCloud Search Command ( return top results from a search query )
- [ ] Add lyrics Command
- [ ] Add Music Player System ( Queue of songs to play on voice channels )
>*play [search string / URL] ( Use Youtube Search System to choose from and then play the song )
*playlist [search string / URL] ( Use Youtube Search System to choose from and then play the song )
*soundcloud [search string / URL] ( Use SoundCloud Search System to choose from and then play the song )
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

**License**: MIT
