// This command will reply with the last seen time for specified user

exports.run = async (client, message, args, level) => { 

  const moment = require("moment"),
        table = require('easy-table');
  var hasData=false,
      scoreTable = new table,
      searchObj = message.guild,
      targetID = message.author.id;

  if (args[0] === "role") {
    const roleID = args[1].replace("<@&","").replace(">","");
    if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
    searchObj = message.guild.roles.get(roleID);
  }
  if (args[0] === "all" || args[0] === "role") {
    searchObj.members.forEach(function (target, targetID, mapObj){
      if (targetID != process.env.DISCORD_BOT_ID) {
        var targetDB = targetDB = client.userDB.get(targetID) || {username: `<@${targetID}>`}
        if (targetDB.lastSeen) {
          hasData=true;
          var timeDiff = Math.round((Date.now() - targetDB.lastSeen) / 3600000);
          scoreTable.cell('User', targetDB.username);
          var lastSeen = timeDiff ? `${timeDiff} hours ago` : "just now...";
          //if(targetDB.timeOffset) lastSeen += " at "+moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm");
          scoreTable.cell('LastSeen', lastSeen);
          scoreTable.newRow();
        }
      }
    });  
    if (!hasData) return message.reply("No data found");
    else return message.reply(`Last seen time for everyone of ${args[0] || ""} ${searchObj.name}:\n` + "```" + scoreTable.sort('User|des').toString()+"```"); 
  }

  var targetDB = message.userDB
  args.forEach(function(arg) {
    if (arg.indexOf("<@") >= 0 ) {
      targetID = arg.replace("<@","").replace(">","");
      targetDB = client.userDB.get(targetID) || {username: arg}
    }
  });
  
  if (message.author.id === targetID)
    return message.reply("Do you need a mirror ???");
  
  if (!targetDB.lastSeen) return message.reply(`I have never seen ${targetDB.username}.`);
  var timeDiff = Math.round((Date.now() - targetDB.lastSeen) / 3600000);
  message.reply(`${targetDB.username} was last seen ${timeDiff} hours ago, at: `+moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm")+" , his local time.");


};
               
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["seen"],
  permLevel: "User"
};

exports.help = {
  name: "lastseen",
  category: "Miscelaneous",
  description: "What is the last time a corp member was seen?",
  usage: "lastseen [@user|role @role|all]."
};
