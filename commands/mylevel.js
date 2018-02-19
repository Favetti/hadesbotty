exports.run = async (client, message, args, level) => {
  const friendly = client.config.permLevels.find(l => l.level === level).name;
  const scoreLevel = message.userDB[message.guild.id].level;
  var msg = `Your permission level is: ${level} - ${friendly}`;
  !scoreLevel ? msg += '\nYou have no chatting levels yet.' : msg += `\nYour chatting level is ${scoreLevel}!`;
  message.reply(msg);
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
  description: "Tells you your permission level for the current Guild and your chatting level.",
  usage: "mylevel"
};
