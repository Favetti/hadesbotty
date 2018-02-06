// *AF*
// Point system

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const scorePoints = client.points.get(message.author.id).points;
  !scorePoints ? message.reply('You have no points yet.') : message.reply(`You have ${scorePoints} messages and ${client.points.get(message.author.id).commands} commands!`);
  
  /* OLD SQLITE
  const user = `<@${message.author.id}>`;
  const msg = await message.channel.send("Points? What for?");
  
  client.sqlScore.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return msg.edit(`you do not have any points yet ${user}... are you OK?`);
    msg.edit(`${user} you currently have ${row.points} points, so what?`);
  });
  */

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
