// Hades star Technology Level
// This command will remove all technology records for the specified user tag

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  args = args.map(function(x){ return x.toLowerCase() });
  if (!args[0])
    return message.reply("Invalid command, missing user tag for target.");
  
  var targetID = args[0].replace("<@","").replace(">","");;
  if (!client.hsTech.has(targetID))
    return message.reply(`<@${targetID}> doesn't have any data`);
  
  // Throw the 'are you sure?' text at them.
  const response = await client.awaitReply(message, `Are you sure you want to permanently remove tech for <@${targetID}>? This **CANNOT** be undone.`).toLowerCase();
  if (["y", "yes"].includes(response)) {
    client.logger.log(`Removing  data for <@${targetID}> `);
    client.hsTech.delete(targetID);
    return message.reply(`Removed data for <@${targetID}>`);
  }
  else return message.reply(`Aborting remove.`);

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Bot Support"
};

exports.help = {
  name: "removetech",
  category: "Hades Star",
  description: "Remove ALL tech data for tagged user",
  usage: "removetech {user tag}"
};
