//

exports.run = async (client, message, args, level) => { 

  const moment = require("moment");

  var i=0; // used to parse optional arguments 
  
  // Choose target!
  var targetID = message.author.id;
  if (args[i])
    if (args[i].indexOf("<@") >= 0 && args[i].indexOf(">") > 0 )
      targetID = args[i++].replace("<@","").replace(">","");
  
  var userData = client.usersData.get(targetID) || [];

  //SET
  if (args[i] == "set" ) {
    userData["timeOffset"] = Number(args[++i].replace("gmt",""));
    client.usersData.set(targetID, userData);
  }
  
  //GET
  else {
    if (!client.usersData.has(targetID))
      return message.reply(`<@${targetID}> doesn't have any data.`);
    
    if (!userData["timeOffset"])
      return message.reply(`<@${targetID}> doesn't have a timezone set.`);

    var targetTime = Date.now() + (userData["timeOffset"] * 3600000);
    message.reply(`<@${targetID}> local time is: `+moment(targetTime).format("YYYY-MMM-DD HH:mm:ss"));
    
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
