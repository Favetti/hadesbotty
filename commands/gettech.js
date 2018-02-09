// Hades star Technology Level
// This command will list all technology developed by the user, or by someone else especified by tag

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  
  var targetID = message.author.id;

  if (args[0] != null)
    targetID = args[0].replace("<@","").replace(">","");
  
  if (!client.hsTech.has(targetID))
    return message.reply(`<@${targetID}> doesn't have any data`);
  
  var allTech = client.hsTech.get(targetID);
  var msg = (targetID == message.author.id ? "here are your Tech levels: " : `here are Tech levels for <@${targetID}>`);
       
  
  Object.keys(client.config.hadesTech).forEach(techID => {
    var techLevel = allTech[techID];
    if (techLevel >0) msg += (`\n${client.config.hadesTech[techID].desc}: ${techLevel}`);    
  });  

  return message.reply(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["gt"],
  permLevel: "User"
};

exports.help = {
  name: "gettech",
  category: "Hades Star",
  description: "Shows Technology Level for you or tagged user",
  usage: "gettech [user tag]"
};
