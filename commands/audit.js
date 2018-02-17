//

exports.run = async (client, message, args, level) => { 

  const moment = require("moment");
  const table = require('easy-table');
    
  var hasData=false;
  var dataTable = new table;
  
  switch(args[0]) {
    case "userdb":
      client.userDB.forEach(function (value, key, mapObj) {  
        var keyObj = client.userDB.get(key);
        hasData=true;
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
    case "usersdata":
      client.usersData.forEach(function (value, key, mapObj) {  
        var keyObj = client.usersData.get(key);
        hasData=true;
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    case "points":
      client.points.forEach(function (value, key, mapObj) {  
        var keyObj = client.points.get(key);
        hasData=true;
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    case "hstech":
      client.hsTech.forEach(function (value, key, mapObj) {  
        var keyObj = client.hsTech.get(key);
        hasData=true;
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    default:
      return message.reply("Please specify the DB to audit");
  }
  
  if (!hasData)
    return message.reply("No data found");
  else
    //return message.reply(`Audit for ${args[0]}:\n` + dataTable.toString());
    client.logger.log(`Audit for ${args[0]}:\n` + dataTable.toString());
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "audit",
  category: "Miscelaneous",
  description: "Audit the Database",
  usage: "audit <database>."
};
