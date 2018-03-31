// Hades star Technology Level
// This command will list all technology developed by the user, or by someone else especified by tag

exports.run = async (client, message, args, level) => {

  const cmd = client.commands.get("tech");
  args.push("get");
  try { cmd.run(client, message, args, level); }
  catch (e) {
    message.reply("An error occured and was caught by the message event: " + e);
    throw e;
  }
  return;
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["gt"],
  permLevel: "User"
};

exports.help = {
  name: "gettech",
  category: "x Deprecated - HS x",
  description: "DEPRECATED! Use: !tech get",
  usage: "This command was replaced by the TECH command, this remais as an ALIAS.\ngettech [user tag]"
};
