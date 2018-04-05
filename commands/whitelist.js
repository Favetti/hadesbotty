exports.run = async (client, message, args, level) => { 

  if (!args[0])
    return message.reply("Please specify the desired action: ADD, REMOVE, LIST or CLEAR");
  
  args = args.map(function(x){ return x.toLowerCase() });

  //client.logger.debug(":"+args[0]+"::"+typeof message.userDB.whitelist+":::"+JSON.stringify(message.userDB.whitelist))

  if (!Array.isArray(message.userDB.whitelist) || !message.userDB.whitelist.length) {
      message.userDB.whitelist = new Array()
      client.userDB.set(message.author.id, message.userDB)
  }
  
  if (args[0] === "add") {
    if (!message.userDB.whitelist.includes(message.guild.id)) {
      message.userDB.whitelist.push(message.guild.id);
      client.userDB.set(message.author.id, message.userDB)
      return message.reply("adding channel to your WhiteList: `"+message.guild.name+"`");
    }
    else
      return message.reply("channel is already on your WhiteList: "+message.guild.name);
  }

  if (args[0] === "remove") {
    let index = message.userDB.whitelist.indexOf(message.guild.id);
    let name = message.guild.name;
    if (message.userDB.whitelist.indexOf(args[1]) >= 0) {
      index = message.userDB.whitelist.indexOf(args[1]);
      if (message.userDB[args[1]])
        name = message.userDB[args[1]].name;
      else
        name = args[1];
    }
    if (index >= 0) {
      message.userDB.whitelist.splice(index, 1);
      client.userDB.set(message.author.id, message.userDB)
      return message.reply("removing server from your WhiteList: `"+name+"`");
    }
    else 
      return message.reply("server not found on your WhiteList: "+name);
  }
  
  if (args[0] === "list") {
    if (message.userDB.whitelist.length > 0) {
      let msg = "";
      message.userDB.whitelist.forEach(function(guildID, index) {
        if (!message.userDB[guildID])
          msg += "• "+guildID+"\n";
        else
          msg += "• "+message.userDB[guildID].name+"\n";
      });
      return message.reply("here are the channels on your WhiteList:```"+msg+"```");
    }
    else
      return message.reply("you don't have any channels on your WhiteList.");
  }  
  
  if (args[0] === "clear") {
    message.userDB.whitelist = new Array();
    client.userDB.set(message.author.id, message.userDB)
    return message.reply("your WhiteList is now empty and your tech can be viewed anywhere.");
  } 
  
  if (args[0] === "test") {
    message.userDB.whitelist.push("test");
    client.userDB.set(message.author.id, message.userDB)
    return message.reply("your WhiteList is now just a TEST!");
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["wl"],
  permLevel: "Users"
};

exports.help = {
  name: "whitelist",
  category: "Miscelaneous",
  description: "Makes your tech levels private to the WhiteListed servers - they will not show on any other channel.\nIf your WhiteList is empty, your tech will be open to view anywhere.",
  usage: "whitelist [add|remove|list|clear]"
};
