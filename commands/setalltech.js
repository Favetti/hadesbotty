// Hades star Technology Level
// This command will set the level of all technology in a group for the user

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const cmd = client.commands.get("tech");
  args.push("set");
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
  aliases: ["sat"],
  permLevel: "User"
};

exports.help = {
  name: "setalltech",
  category: "x Deprecated - HS x",
  description: "DEPRECATED! Use: !tech set",
  usage: "This command was replaced by the TECH command, this remais as an ALIAS.\nsetalltech [group] [n,n...,n]\n Where each group need all it's techs:\n >>Ships	3\n >>Trade	10\n >>Mining	8\n >>Weapons	5\n >>Shields	6\n >>Support	18\n\nExample:\n : setalltech ships 4,4,4"
};
