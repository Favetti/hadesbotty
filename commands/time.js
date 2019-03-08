// This command will set/reply with the current time for specified user

exports.run = async (client, message, args, level) => { 

  args = args.map(function(x){ return x.toLowerCase() });
  const moment = require("moment"),
        table = require('easy-table');
 
  var targetID = message.author.id,
      targetDB = message.userDB,
      searchObj = message.guild,
      dataTable = new table,
      hasData = false,
      isSet = false,
      offset = false,
      singleTarget = false;

  args.forEach(function(arg) {
    if (arg.indexOf("<@&") >= 0) { //target is a ROLE
      //const roleID = arg.replace("<@&","").replace(">","");
      const roleID = arg.replace(/[^0-9]/g,"");
      if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe I can't mention it...");
      searchObj = message.guild.roles.get(roleID);
    }
    else if (arg.indexOf("<@") >= 0 ) { //target is a USER
      singleTarget = true;
      //targetID = arg.replace("<@","").replace(">","");
      targetID = arg.replace(/[^0-9]/g,"");
      targetDB = client.userDB.get(targetID) || {username: arg, [message.guild.id]: {nickname: arg}}
    }
    else if (arg === "set") {
      isSet = true;
      singleTarget = true;
    }
    else if (arg.indexOf("gmt") >= 0 )
      offset = Number(arg.replace("gmt",""));
    else if (Number(arg)<= 14 && Number(arg) >= -12)
      offset = Number(arg);
  });

  // SET
  if (isSet) {
    if (offset <= 14 && offset >= -12) {
      targetDB.timeOffset = offset;
      client.userDB.set(targetID, targetDB);
      return message.reply("Timezone set to "+offset);
    } 
    else return message.reply("Sorry, I couldn't understand that timezone");
  } 

  // GET for Guild or Role
  if (!singleTarget) {
    searchObj.members.forEach(function (target, targetID, mapObj){
      if (client.userDB.has(targetID)) {
        var targetDB = client.userDB.get(targetID);
        if (targetDB.timeOffset <= 14 && targetDB.timeOffset >= -12) {
          hasData=true;
          dataTable.cell('Time', moment(Date.now() + (targetDB.timeOffset * 3600000)).format("MMM-DD, HH:mm"));
          dataTable.cell('User', client.getDisplayName(targetID, message.guild));
          dataTable.newRow();
        }
      }
      });
    
      if (!hasData) 
        return message.reply("No data found");
      else 
        return message.reply(`Time recorded for everyone on ${searchObj.name || "guild"}:\n` +"```"+ dataTable.sort(['Time']).toString()+"```"); 
  }
  // GET for single target
  else {
    if (targetDB.timeOffset <= 14 && targetDB.timeOffset >= -12) {
      var targetTime = Date.now() + (targetDB.timeOffset * 3600000);
      return message.reply(`${client.getDisplayName(targetID, message.guild)} local time is: `+moment(targetTime).format("MMM-DD, HH:mm"));
    }
    else return message.reply(`${client.getDisplayName(targetID, message.guild)} doesn't have a timezone set.`);
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
  usage: "time [@user|@role] [set timezone]\nPlease use timezone in GMT reference format only."
};
