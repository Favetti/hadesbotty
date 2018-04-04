exports.run = async (client, message, args, level) => { 
  
  if (!args[0])
    return message.reply("Please specify the desired action: SET or REMOVE");

  if (args[0] === "set") {
      const response = await client.awaitReply(message, "Are you sure you want to set your privacy to this server: "+message.guild.name+"\nThis will prevent your tech from being displayed in any other channel");
      if (["y", "yes"].includes(response.toLowerCase())) {
        client.logger.log("Setting privacy for "+message.userDB.username+" to "+message.guild.name);
        message.userDB.privacy = message.guild.id;
        client.userDB.set(message.author.id, message.userDB)
        return message.reply("setting your privacy to "+message.guild.name);
      }
      else return message.reply("Aborting privacy set.");
  }
  
  if (args[0] === "remove") {
    client.logger.log("Removing privacy for "+message.userDB.username);
    message.userDB.privacy = false;
    client.userDB.set(message.author.id, message.userDB)
    return message.reply("removing your privacy setting");
  }
  
  if (args[0] === "test") {
    client.logger.log("TESTING privacy for "+message.userDB.username);
    message.userDB.privacy = "GARBAGE";
    client.userDB.set(message.author.id, message.userDB)
    return message.reply("Using garbage as your privacy setting");
  }

  
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "privacy",
  category: "Miscelaneous",
  description: "Makes your tech levels private to the server where you issue the command",
  usage: "privacy [set|remove]"
};
