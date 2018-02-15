// Hades star Technology Level
// This command will search for all the users that have an specific technology

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    
  const techID = args[0];
  if (!client.config.hadesTech[techID]) return message.reply(`Invalid Tech: ${techID}`);
    
  const table = require('easy-table');
  var hasData=false;
  var techTable = new table;
  
  message.guild.members.forEach(function (user, userID, mapObj){
    if (client.hsTech.has(userID)) {
      const allTech = client.hsTech.get(userID);
      const techLevel = allTech[techID] || 0;
      if (techLevel >0) {
        var targetName = client.usersData.get(userID).userName || `<@${userID}>`;
        hasData=true;
        techTable.cell('Level', techLevel);
        techTable.cell('User', );
        techTable.newRow();
      }
      //else client.logger.debug("Not tech for "+userID);
    }
    //else client.logger.debug("No data for "+userID);

  });

  if (!hasData)
    return message.reply("No data found");
  else {
    techTable.sort('Level');
    return message.reply(`Searching for: ${client.config.hadesTech[techID].desc}\n` + techTable.toString());
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "User"
};

exports.help = {
  name: "searchtech",
  category: "Hades Star",
  description: "Search for a Technology from all users",
  usage: "searchtech [techID] \n\nValid Tech: transp, miner, bs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, offload, beam, entrust, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, battery, laser, mass, dual, barrage, alpha, delta, passive, omega, mirror, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, leap"
};
