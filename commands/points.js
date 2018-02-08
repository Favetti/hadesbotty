// simple Point system, from the Idiots Guide

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const scorePoints = client.points.get(message.author.id).points;
  !scorePoints ? message.reply('You have no points yet.') : message.reply(`You have ${scorePoints} messages and ${client.points.get(message.author.id).commands} commands!`);
 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "points",
  category: "Miscelaneous",
  description: "How much have you been talking here?",
  usage: "points"
};
