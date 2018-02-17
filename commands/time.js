//

exports.run = async (client, message, args, level) => { 

  const moment = require("moment");
  const table = require('easy-table');
    
  if (args[0] === "all") {
    var hasData=false;
    var allTimes = new table;
    
    message.guild.members.forEach(function (target, targetID, mapObj){
      //client.logger.debug("trying: "+userID);
      if (client.userDB.has(targetID)) {
        var targetDB = client.userDB.get(targetID);
        if (!isNaN(targetDB.timeOffset)) {
          hasData=true;
          allTimes.cell('Time', moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm"));
          allTimes.cell('User', targetDB.username);
          allTimes.newRow();
        }
        //else client.logger.debug("Not timezone for "+userID);
      }
      //else client.logger.debug("No userData for "+userID);
        
    });
    
    if (!hasData)
      return message.reply("No data found");
    else {
      allTimes.sort('Time');
      return message.reply(`Time recorded for everyone on ${message.guild.name}:\n` + allTimes.toString());
    }
  }

  var targetID = message.author.id;
  var isSet = false;
  var offset = false;
  var targetDB = message.userDB;

  args.forEach(function(arg) {
    if (arg.indexOf("<@") >= 0 ) {
      targetID = arg.replace("<@","").replace(">","");
      if (client.userDB.get(targetID))
        targetDB = client.userDB.get(targetID);
      else
        targetDB = {username: arg};

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
    else
      return message.reply("Sorry, couldn't understand the timezone");
  }  
  else {
   
    if (!targetDB.timeOffset)
      return message.reply(`${targetDB.username} doesn't have a timezone set.`);

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
  usage: "time [user] [set timezone]\nPlease use timezone in GMT reference format only."
};
