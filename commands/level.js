// *AF*
// Point system

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  const scoreLevel = client.points.get(message.author.id).level;
  !scoreLevel ? message.reply('You have no levels yet.') : message.reply(`You are currently level ${scoreLevel}!`);
  
  /*
  const msg = await message.channel.send("Level ? You gotta be kidding...");
  
  client.sqlScore.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return msg.edit("You dont have any level yet... You are a ZERO!!!");
    msg.edit(`Your current level is ${row.level}`);
  });
  
  client.sqlScore.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
    if (!row) return message.reply("You dont have any level yet... You are a ZERO!!!");
    message.reply(`Your current level is ${row.level}`);
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
  name: "level",
  category: "Miscelaneous",
  description: "How much have you been talking here?",
  usage: "level"
};
