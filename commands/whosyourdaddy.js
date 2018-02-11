exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  message.reply("I'm son to many, i belong to The Corp!\n\nThe QUANTUM Corp\n\n!");
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "whosyourdaddy",
  category: "Miscelaneous",
  description: "cant be described...",
  usage: "whosyourdaddy"
};
