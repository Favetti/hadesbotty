// simple Point system, from the Idiots Guide

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const scoreLevel = client.points.get(message.author.id).level;
  !scoreLevel ? message.reply('You have no levels yet.') : message.reply(`You are currently level ${scoreLevel}!`);
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "level",
  category: "Miscelaneous",
  description: "How much have you been talking here?",
  usage: "level"
};
