exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  const scoreLevel = message.userDB[message.guild.id].level;
  message.reply("Your permission level is: "+level+" - "+friendly+" (chat lvl: "+scoreLevel+")");
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["level"],
  permLevel: "User"
};

exports.help = {
  name: "mylevel",
  category: "Miscelaneous",
  description: "Tells your current permission level",
  usage: "mylevel"
};
