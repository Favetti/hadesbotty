// Hades star Technology Level
// This command will calculate the tech level for all users

exports.run = async (client, message, args, level) => { 

  const cmd = client.commands.get("tech");
  args.push("score");
  try { cmd.run(client, message, args, level); }
  catch (e) {
    message.reply("An error occured and was caught by the message event: " + e);
    throw e;
  }
  return;
   
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ts"],
  permLevel: "User"
};

exports.help = {
  name: "techscore",
  category: "Deprecated - HS",
  description: "DEPRECATED! Calculate Tech Score for all users",
  usage: "This command was replaced by the TECH command, this remais as an ALIAS.\ntechscore [role @role]"
};
