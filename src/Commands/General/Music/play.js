const Discord = require("discord.js");
const yt = require("ytdl-core");
const {
  SearchYoutubePlaylist,
  SearchYoutube,
  SearchSoundCloud
} = require("../../../Axios/Search");

const regex = {
  YOUTUBE_VIDEO: /(?:https?:\/\/)?(?:www\.)?(youtube.com|youtu.be)/,
  YOUTUBE_PLAYLIST: /^.*(youtu.be\/|list=)([^#\&\?]*).*/,
  SOUNDCLOUD_LINK: /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/
};

const emojiNumbers = [
  "0⃣",
  "1⃣",
  "2⃣",
  "3⃣",
  "4⃣",
  "5⃣",
  "6⃣",
  "7⃣",
  "8⃣",
  "9⃣",
  "🔟"
];
const DEFAULT_VOLUME = 0.4;
//Show Bot Information like Uptime/MemUsage/Servers/channels/users
module.exports = {
  name: "play",
  description: "Initiate Music Player and play Track",
  args: true,
  argsFailMsg:
    "Please Enter Youtube Video URL / Youtube Playlist URL / SoundCloud URL / Search keyword",
  async execute(client, msg, server_prefix, args) {
    inputArg = args.join(" ");
    const musicPlayerMessage = await msg.channel.send(
      new Discord.RichEmbed()
        .setTitle(
          "🤖 Checking for Youtube Video URL / Youtube Playlist URL / SoundCloud URL / Search keyword"
        )
        .setColor("#2962ff")
    );

    //[1]// Searching Phase
    const Search = SeachPhase(msg, inputArg, musicPlayerMessage);
    Search.then(results => {
      if (!client.musicPlayerData.hasOwnProperty(msg.guild.id)) {
        InitialaiseMusicPlayer(client, msg);
      }
      AddResultsToQueue(results, client, msg);
    })
      .catch(err => console.log(err))
      .then(() => {
        if (!client.musicPlayerData[msg.guild.id].playing) {
          StartPlaying(client, msg, musicPlayerMessage);
        } else {
          SendMessageAsAddedToQueue(msg, musicPlayerMessage);
        }
      });
  }
};

function SendMessageAsAddedToQueue(msg, oldmessage) {
  msg.channel.fetchMessage(oldmessage.id).then(msg => {
    const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
      "🔂 Music Has Been Added To The Queue"
    );
    NewEmbed.fields = [];
    msg.clearReactions();
    return msg.edit(NewEmbed);
  });
}

function AddResultsToQueue(results, client, msg) {
  for (track of results) client.musicPlayerData[msg.guild.id].queue.push(track);
}

function InitialaiseMusicPlayer(client, msg) {
  client.musicPlayerData[msg.guild.id] = {};
  client.musicPlayerData[msg.guild.id].status = "Idle";
  client.musicPlayerData[msg.guild.id].playing = false;
  client.musicPlayerData[msg.guild.id].volume = DEFAULT_VOLUME;
  client.musicPlayerData[msg.guild.id].muted = false;
  client.musicPlayerData[msg.guild.id].currentTrackID = "";
  client.musicPlayerData[msg.guild.id].queue = [];
}

function timeFormat(time) {
  let timeForm = "";
  var hrs = Math.floor(time / 3600);
  var mins = Math.floor((time % 3600) / 60);
  var secs = Math.floor(time % 60);

  if (hrs > 0) timeForm += "" + hrs + ":" + (mins < 10 ? "0" : "");
  timeForm += "" + mins + ":" + (secs < 10 ? "0" : "");
  timeForm += "" + secs;
  return timeForm;
}

function musicBar(playing, muted, totalDuration, currentDuration, scale) {
  const pastTimeRep = Math.round(
    ((currentDuration / 1000 / totalDuration) * 100) / scale
  );
  const futureTimeRep = Math.round(
    (((totalDuration - currentDuration / 1000) / totalDuration) * 100) / scale
  );
  const progressBar = `${"▬".repeat(pastTimeRep)}🔘${"▬".repeat(
    futureTimeRep
  )}`;
  const musicState = playing ? "▶️" : "⏸️";
  const muteState = muted ? "🔇" : "🔊";
  const timeState = `${timeFormat(currentDuration / 1000)}/${timeFormat(
    totalDuration
  )}`;
  return `${muteState}${musicState}﹝${progressBar}﹞ - 〘${timeState}〙 `;
}
function StartPlaying(client, msg, oldmessage) {
  if (!msg.guild.voiceConnection)
    return joinChannel(msg, oldmessage).then(() =>
      StartPlaying(client, msg, oldmessage)
    );
  if (client.musicPlayerData[msg.guild.id].queue === undefined) return;

  (function loopQueue(track) {
    if (!track) {
      QueueEndReached(msg, oldmessage, client);
    }
    ShowBufferingState(msg, oldmessage);
    StartStream(client, msg, track);
    ShowCurrentTrackDetails(msg, oldmessage, track, client);
    let progressBar = ShowProgressBar(msg, oldmessage, client, track);
    TrackEndReached(client, msg, oldmessage, progressBar, loopQueue);
    TrackGotError(client, msg, loopQueue);
  })(client.musicPlayerData[msg.guild.id].queue.shift());
}
function TrackGotError(client, msg, loopQueue) {
  client.musicPlayerData[msg.guild.id].dispatcher.on("error", err => {
    return msg.channel.send(` 📛 ` + err).then(() => {
      loopQueue(musicPlayerData[msg.guild.id].queue.shift());
    });
  });
}

function TrackEndReached(client, msg, oldmessage, progressBar, loopQueue) {
  client.musicPlayerData[msg.guild.id].dispatcher.on("end", () => {
    return msg.channel.fetchMessage(oldmessage.id).then(msg => {
      const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
        "🚧 Track End Reached, Buffering Next Track.. "
      );
      msg.edit(NewEmbed);
      client.musicPlayerData[msg.guild.id].playing = false;
      clearInterval(progressBar);
      loopQueue(client.musicPlayerData[msg.guild.id].queue.shift());
    });
  });
}

function ShowProgressBar(msg, oldmessage, client, track) {
  return setInterval(function() {
    msg.channel.fetchMessage(oldmessage.id).then(msg => {
      const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setFooter(
        musicBar(
          client.musicPlayerData[msg.guild.id].playing,
          client.musicPlayerData[msg.guild.id].muted,
          track.trackDuration,
          client.musicPlayerData[msg.guild.id].dispatcher.time,
          4
        )
      );
      msg.edit(NewEmbed);
    });
  }, 5000);
}

function ShowCurrentTrackDetails(msg, oldmessage, track, client) {
  msg.channel.fetchMessage(oldmessage.id).then(msg => {
    const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]);
    NewEmbed.fields = [];
    NewEmbed.setTitle("🎶 Playing Music")
      .setThumbnail(track.trackThumbnail)
      .addField("Track Name :", `${track.title}`)
      .addField("Track Author :", `${track.trackAuthor}`)
      .addField("Track Requester :", `${track.requester}`, true)
      .addField(
        "Track URL :",
        `http://www.youtube.com/watch?v=${track.trackID}`
      )
      .setFooter(
        musicBar(
          client.musicPlayerData[msg.guild.id].playing,
          client.musicPlayerData[msg.guild.id].muted,
          track.trackDuration,
          client.musicPlayerData[msg.guild.id].dispatcher.time,
          4
        )
      );
    msg.edit(NewEmbed);
  });
}

function StartStream(client, msg, track) {
  client.musicPlayerData[
    msg.guild.id
  ].dispatcher = msg.guild.voiceConnection.playStream(
    yt(`http://www.youtube.com/watch?v=${track.trackID}`, {
      audioonly: true,
      highWaterMark: 1 << 25
    }),
    { passes: 3, volume: DEFAULT_VOLUME }
  );
  client.musicPlayerData[msg.guild.id].currentTrackID = track.trackID;
  client.musicPlayerData[msg.guild.id].playing = true;
}

function ShowBufferingState(msg, oldmessage) {
  msg.channel.fetchMessage(oldmessage.id).then(msg => {
    const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
      "🔄 Buffering.."
    );
    msg.edit(NewEmbed);
  });
}

function QueueEndReached(msg, oldmessage, client) {
  msg.channel.fetchMessage(oldmessage.id).then(msg => {
    if (
      client.voiceConnections.find(val => val.channel.guild.id == msg.guild.id)
    ) {
      msg.guild.voiceConnection.disconnect();
    }
    client.musicPlayerData[msg.guild.id].playing = false;
    const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0])
      .setTitle("🏁 Queue End Reached..")
      .setFooter(" ");
    NewEmbed.fields = [];
    msg.edit(NewEmbed);
  });
}

function joinChannel(msg, oldmessage) {
  return new Promise((resolve, reject) => {
    msg.channel.fetchMessage(oldmessage.id).then(msg => {
      const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
        "🚶 Joining Room"
      );
      msg.edit(NewEmbed);
      return;
    });
    try {
      voiceChannel = msg.member.voiceChannel;
    } catch (e) {
      voiceChannel = client.channels.get(VOICE_CHANNEL);
    }
    if (!voiceChannel || voiceChannel.type !== "voice") {
      msg.channel.fetchMessage(oldmessage.id).then(msg => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          "❗ You need to join a voice channel first! Please Try Again"
        );
        msg.edit(NewEmbed);
        return;
      });
    }
    voiceChannel
      .join()
      .then(connection => resolve(connection))
      .catch(err => reject(err));
  });
}

function getDurationYoutube(videoId) {
  return new Promise(async function(resolve, reject) {
    yt.getInfo(`http://www.youtube.com/watch?v=${videoId}`, (err, info) => {
      if (err) throw err;
      resolve(info.length_seconds);
    });
  });
}

function SeachPhase(msg, inputArg, oldmessage) {
  return new Promise(async function(resolve, reject) {
    let searchResults = [];

    if (inputArg.match(regex.YOUTUBE_PLAYLIST)) {
      msg.channel.fetchMessage(oldmessage.id).then(msg => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          "🗃️ Collecting data from tracks in playlist"
        );
        msg.edit(NewEmbed);
      });

      let playlistID = inputArg.match(regex.YOUTUBE_PLAYLIST)[2];
      let results = await SearchYoutubePlaylist(playlistID).catch(err => {
        console.log(err);
      });

      for (const video of results) {
        getDurationYoutube(video.snippet.resourceId.videoId).then(dur => {
          searchResults.push({
            title: video.snippet.title,
            description: video.snippet.description,
            trackAuthor: video.snippet.channelTitle,
            trackThumbnail: video.snippet.thumbnails.high.url,
            trackID: video.snippet.resourceId.videoId,
            trackDuration: dur,
            requester: msg.member
          });
          resolve(searchResults);
        });
      }
    } else if (inputArg.match(regex.YOUTUBE_VIDEO)) {
      msg.channel.fetchMessage(oldmessage.id).then(msg => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          "🗃️ Collecting data from Youtube Video"
        );
        msg.edit(NewEmbed);
      });

      let results = await SearchYoutube(inputArg).catch(err => {
        console.log(err);
      });
      getDurationYoutube(results[0].id.videoId).then(dur => {
        searchResults.push({
          title: results[0].snippet.title,
          description: results[0].snippet.description,
          trackAuthor: results[0].snippet.channelTitle,
          trackThumbnail: results[0].snippet.thumbnails.high.url,
          trackID: results[0].id.videoId,
          trackDuration: dur,
          requester: msg.member
        });
        resolve(searchResults);
      });
    } else if (inputArg.match(regex.SOUNDCLOUD_LINK)) {
      msg.channel.fetchMessage(oldmessage.id).then(msg => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          "🗃️ Collecting data from Video"
        );
        msg.edit(NewEmbed);
      });
    } else {
      msg.channel.fetchMessage(oldmessage.id).then(msg => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          `🔍 Searching for " ${inputArg} " in youtube`
        );
        msg.edit(NewEmbed);
      });

      let results = await SearchYoutube(inputArg).catch(err => {
        console.log(err);
      });
      for (let i = 0; i < results.length; i++) {
        msg.channel.fetchMessage(oldmessage.id).then(msg => {
          const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).addField(
            `[${i + 1}] - ${results[i].snippet.channelTitle}`,
            `${results[i].snippet.title}`
          );
          msg.edit(NewEmbed);
        });
      }

      msg.channel.fetchMessage(oldmessage.id).then(message => {
        const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]).setTitle(
          `🔢 Choose a Result Number to play`
        );
        message.edit(NewEmbed).then(newerMessage => {
          for (let i = 0; i < results.length; i++)
            newerMessage.react(emojiNumbers[i + 1]);
          const filter = (reaction, user) => {
            return (
              emojiNumbers.includes(reaction.emoji.name) &&
              user.id === msg.author.id
            );
          };

          newerMessage
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then(collected => {
              const reaction = collected.first();
              const number_collected = emojiNumbers.findIndex(element => {
                return element === reaction.emoji.name;
              });
              newerMessage.clearReactions();

              msg.channel.fetchMessage(oldmessage.id).then(msg => {
                const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]);
                NewEmbed.fields = [];
                msg.edit(NewEmbed);
              });

              getDurationYoutube(results[number_collected - 1].id.videoId).then(
                dur => {
                  searchResults.push({
                    title: results[number_collected - 1].snippet.title,
                    description:
                      results[number_collected - 1].snippet.description,
                    trackAuthor:
                      results[number_collected - 1].snippet.channelTitle,
                    trackThumbnail:
                      results[number_collected - 1].snippet.thumbnails.high.url,
                    trackID: results[number_collected - 1].id.videoId,
                    trackDuration: dur,
                    requester: msg.member
                  });
                  resolve(searchResults);
                }
              );
            })
            .catch(collected => {
              msg.channel.fetchMessage(oldmessage.id).then(msg => {
                const NewEmbed = new Discord.RichEmbed(oldmessage.embeds[0]);
                NewEmbed.fields = [];
                NewEmbed.setTitle(`🤷 No Reply Recieved from Requester`);
                msg.clearReactions();
                msg.edit(NewEmbed);
              });
              reject();
            });
        });
      });
    }
  });
}
