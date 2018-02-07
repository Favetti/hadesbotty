// *AF*
// Hades star Technology Level

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  //const user = `<@${message.author.id}>`;  
  if (args[0] == null)
    return message.reply("Invalid command, missing user tag for target.");

  var targetID = args[0].replace("<@","").replace(">","");;
    
  if (!client.hsTech.has(targetID))
    return message.reply(`<@${targetID}> doesn't have any data`);
  
  client.logger.log(`Removing data for <@${targetID}> `);
  
  client.hsTech.delete(targetID);

  return message.reply(`Removed all data for <@${targetID}>`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "support"
};

exports.help = {
  name: "removetech",
  category: "Hades Star",
  description: "Remove ALL tech data for tagged user",
  usage: "removetech {user tag}"
};
