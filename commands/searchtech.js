// Hades star Technology Level
// This command will search for all the users that have an specific technology

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    
  const techID = args[0];
  if (client.config.techList.indexOf(` ${techID},`) < 0) return message.reply(`Invalid Tech: ${techID}`);
    
  var msg = `Searching for: ${client.config.techArray[techID]}`;

  client.hsTech.forEach(function (allTech, userID, mapObj) {  
    const techLevel = allTech[techID];
    if (techLevel >0) msg += (`\n<@${userID}>: ${techLevel}`);  
});  
  
  return message.reply(msg);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [""],
  permLevel: "user"
};

exports.help = {
  name: "searchtech",
  category: "Hades Star",
  description: "Search for a Technology from all users",
  usage: "searchtech [techID] \n\nValid Tech: transp, miner, bs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, offload, beam, entrust, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, battery, laser, mass, dual, barrage, alpha, delta, passive, omega, mirror, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, leap"
};
