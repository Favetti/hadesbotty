//

exports.run = async (client, message, args, level) => { 

  const moment = require("moment");
  const table = require('easy-table');
    
  if (args[0] === "all") {
    var hasData=false;
    var allTimes = new table;
    
    message.guild.members.forEach(function (user, userID, mapObj){
      //client.logger.debug("trying: "+userID);
      if (client.usersData.has(userID)) {
        var userData = client.usersData.get(userID);
        if (userData["timeOffset"]) {
          hasData=true;
          allTimes.cell('Time', moment(Date.now() + (userData.timeOffset * 3600000)).format("MMM-DD, HH:mm"));
          //if (userData.userName)
           allTimes.cell('User', userData.userName);
          //else{
            //var unknownUser = client.fetchUser(userID).username;
            //var unknownUser = message.guild.fetchMember(userID).nickname;
            //client.logger.debug(`found username for ${userID} ` + unknownUser);
            //allTimes.cell('User', unknownUser);
         // }
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
      return message.reply(`Time recorded for everyone on ${message.guild.name}:\n` + allTimes.print());
    }
  }

  var targetID = message.author.id;
  var isSet = false;
  var offset = 0;

  args.forEach(function(arg) {
    if (arg.indexOf("<@") >= 0 )
      targetID = arg.replace("<@","").replace(">","");
    else if (arg === "set")
      isSet = true;
    else if (arg.indexOf("gmt") >= 0 )
      offset = Number(arg.replace("gmt",""))
});

  var userData = client.usersData.get(targetID) || [];

  //client.logger.debug(`target: ${targetID} :: user: ${message.author.id}  ::::  ${isSet} :: ${offset} ::: ${userData["timeOffset"]}`)

  if (isSet) {
    if (offset){
      userData["timeOffset"] = offset;
      client.usersData.set(targetID, userData);
    }
    else
      return message.reply("Sorry, couldn't undertand the timezone");
  }  
  else {
    if (!client.usersData.has(targetID))
      return message.reply(`<@${targetID}> doesn't have any data.`);
    
    if (!userData["timeOffset"])
      return message.reply(`<@${targetID}> doesn't have a timezone set.`);

    var targetTime = Date.now() + (userData["timeOffset"] * 3600000);
    message.reply(`<@${targetID}> local time is: `+moment(targetTime).format("MMM-DD, HH:mm"));
    
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
