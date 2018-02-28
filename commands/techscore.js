// Hades star Technology Level
// This command will calculate the tech level for all users

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  args = args.map(function(x){ return x.toLowerCase() });
  const table = require('easy-table');
  var hasData=false,
      scoreTable = new table,
      searchObj = message.guild;
    
  // ************************************* return members of a specified ROLE
  if (args[0] === "role") {
    const roleID = args[1].replace("<@&","").replace(">","");
    if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
    searchObj = message.guild.roles.get(roleID);
  }
  searchObj.members.forEach(function (target, targetID, mapObj){
    if (client.hsTech.has(targetID)) {
      var allTech = client.hsTech.get(targetID);
      var targetDB = client.userDB.get(targetID) || {username: `<@${targetID}>`}
      var techLevel = 0;
      Object.keys(allTech).map(function(techID, index) {
        if (client.config.hadesTech[techID]) 
          techLevel += client.config.hadesTech[techID].levels[Number(allTech[techID]-1)] || 0;
        });
      hasData=true;
      scoreTable.cell('Level', techLevel);
      scoreTable.cell('User', targetDB.username);
      scoreTable.newRow();
    }
  });  
  if (!hasData) return message.reply("No data found");
  else return message.reply(`Score recorded for everyone of ${args[0] || ""} ${searchObj.name}:\n` + "```" + scoreTable.sort('Level|des').toString()+"```"); 
    
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["ts"],
  permLevel: "User"
};

exports.help = {
  name: "techscore",
  category: "Hades Star",
  description: "Calculate Tech Score for all users",
  usage: "techscore [role @role]"
};
