// ....  trying to unify all tech commands in one easier to understand

exports.run = async (client, message, args, level) => { 

  args = args.map(function(x){ return x.toLowerCase() });
  const moment = require("moment"),
        table = require('easy-table'),
        techSize = {"ships":3,"trade":10,"mining":8,"weapons":5,"shields":5,"support":17};
 
  var targetID = message.author.id,
      targetDB = message.userDB,
      searchObj = message.guild,
      hasData = false,
      isSet = false,
      action = "",
      singleTarget = true;

  args.forEach(function(arg) {
    if (arg.indexOf("<@&") >= 0) { //target is a ROLE
      singleTarget = false;
      const roleID = arg.replace("<@&","").replace(">","");
      if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
      searchObj = message.guild.roles.get(roleID);
    }
    else if (arg === "all") { //target is the guild
      singleTarget = false;
    }
    else if (arg.indexOf("<@") >= 0 ) { //target is a USER
      targetID = arg.replace("<@","").replace(">","");
      targetDB = client.userDB.get(targetID) || {username: arg}
    }
    else if (arg === "set") 
      action = "set";
    else if (client.config.hadesTechSize[arg])
      action = "setAll";
    else if (arg === "get") 
      action = "get";
    else if (arg === "score") 
      action = "score";
    else if (arg === "search") 
      action = "search";    
  });

  if (action.indexOf("set") === 0 && !singleTarget)
    return message.reply("Cant set parameters for a group.");
    
  
  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "tech",
  category: "Hades Star",
  description: "new tech methods",
  usage: "..."
};
