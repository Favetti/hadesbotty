// simple Point system, from the Idiots Guide

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const scorePoints = message.userDB[message.guild.id].points;
  !scorePoints ? message.reply('you have no points yet.') : message.reply(`you have ${scorePoints} messages and ${message.userDB[message.guild.id].commands} commands!`);
 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "points",
  category: "Miscelaneous",
  description: "How much have you been talking here?",
  usage: "points"
};
