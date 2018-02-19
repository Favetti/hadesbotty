// This command will set/reply with the current time for specified user

exports.run = async (client, message, args, level) => { 

  const moment = require("moment");
  const table = require('easy-table');
    
  // ************************************* return ALL members of the guild
  if (args[0] === "all") {
    var hasData = false,
        allTimes = new table;

    message.guild.members.forEach(function (target, targetID, mapObj){
      if (client.userDB.has(targetID)) {
        var targetDB = client.userDB.get(targetID);
        if (!isNaN(targetDB.timeOffset)) {
          hasData=true;
          allTimes.cell('Time', moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm"));
          allTimes.cell('User', targetDB.username);
          allTimes.newRow();
        }
      }
    });
    if (!hasData) return message.reply("No data found");
    else return message.reply(`Time recorded for everyone on ${message.guild.name}:\n` + allTimes.sort('Time').toString()); 
  }

  // ************************************* return all members of a specified ROLE
  else if (args[0] === "role") {
    var hasData=false;
    var allTimes = new table;
    
    const roleID = args[1].replace("<@&","").replace(">","");
    if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
    const roleObj = message.guild.roles.get(roleID);
    
    roleObj.members.forEach(function (target, targetID, mapObj){
      if (client.userDB.has(targetID)) {
        var targetDB = client.userDB.get(targetID);
        if (!isNaN(targetDB.timeOffset)) {
          hasData=true;
          allTimes.cell('Time', moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm"));
          allTimes.cell('User', targetDB.username);
          allTimes.newRow();
        }
      }
    });  
    if (!hasData) return message.reply("No data found");
    else return message.reply(`Time recorded for everyone on role ${args[1]}:\n` + allTimes.sort('Time').toString()); 
  }

  // ************************************* individual members GET and SET
  var targetID = message.author.id,
      isSet = false,
      offset = false,
      targetDB = message.userDB;

  args.forEach(function(arg) {
    if (arg.indexOf("<@") >= 0 ) {
      targetID = arg.replace("<@","").replace(">","");
      targetDB = client.userDB.get(targetID) || {username: arg}
    }
    else if (arg === "set")
      isSet = true;
    else if (arg.indexOf("gmt") >= 0 )
      offset = Number(arg.replace("gmt",""))
  });

   if (isSet) {
    if (!isNaN(offset)) {
      targetDB.timeOffset = offset;
      client.userDB.set(targetID, targetDB);
    } 
    else return message.reply("Sorry, couldn't understand the timezone");
  } 
  else {
    if (!targetDB.timeOffset) return message.reply(`${targetDB.username} doesn't have a timezone set.`);
    var targetTime = Date.now() + (targetDB.timeOffset * 3600000);
    message.reply(`${targetDB.username} local time is: `+moment(targetTime).format("MMM-DD, HH:mm"));
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "time",
  category: "Miscelaneous",
  description: "What time is it for any corp member?",
  usage: "time [user|role @role] [set timezone]\nPlease use timezone in GMT reference format only."
};
