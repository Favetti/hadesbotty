// simple Point system, from the Idiots Guide

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  // Choose target!
  var targetID = message.author.id;
  if (args[0].indexOf("<@") >= 0 && args[0].indexOf(">") > 0 )
    targetID = args[0].replace("<@","").replace(">","");
  
  const scorePoints = client.points.get(message.guild.id+"::"+targetID).points;
  !scorePoints ? message.reply('You have no points yet.') : message.reply(`::: ${scorePoints} messages and ${client.points.get(targetID).commands} commands!`);
 
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
