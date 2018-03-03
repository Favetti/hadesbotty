// Hades star Technology Level
// This command will search for all the users that have an specific technology

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  const techID = HadesTechModule.normalizeTechName(args[0]);
  if (!client.config.hadesTech[techID]) return message.reply(`Invalid Tech: ${techID}`);

  const table = require('easy-table');
  var hasData=false;
  var techTable = new table;
  var searchObj = message.guild;
    
  // ************************************* return members of a specified ROLE
  if (args[1] === "role") {
    const roleID = args[2].replace("<@&","").replace(">","");
    if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
    searchObj = message.guild.roles.get(roleID);
  }
  searchObj.members.forEach(function (target, targetID, mapObj){
    if (client.hsTech.has(targetID)) {
      var allTech = client.hsTech.get(targetID);
      var targetDB = client.userDB.get(targetID) || {username: `<@${targetID}>`}
      const techLevel = allTech[techID] || 0;
      if (techLevel >0) {
        hasData=true;
        techTable.cell('Level', techLevel);
        techTable.cell('User', targetDB.username);
        techTable.newRow();
      }
    }
  });  
  if (!hasData) return message.reply("No data found");
  else return message.reply(`Tech level recorded for everyone of ${args[0]} ${searchObj.name}:\n` + "```" + techTable.sort('Level|des').toString()+"```"); 

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
  usage: "searchtech [techID] [role @role]\n\nValid Tech: transp, miner, bs, cargobay, computer, tradeboost, rush, tradeburst, autopilot, offload, beam, entrust, recall, hydrobay, miningboost, enrich, remote, hydroupload, miningunity, crunch, genesis, battery, laser, mass, dual, barrage, alpha, delta, passive, omega, mirror, emp, teleport, rsextender, repair, warp, unity, sanctuary, stealth, fortify, impulse, rocket, salvage, suppress, destiny, barrier, vengeance, leap"
};
