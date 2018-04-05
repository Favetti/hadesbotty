// Dump the main data Maps on the LOGGER ONLY

exports.run = async (client, message, args, level) => { 

  const moment = require("moment"),
        table = require('easy-table');
    
  var hasData=false,
      dataTable = new table,
      i=0;

  switch(args[0]) {
    case "clean":
      if (args[1]) {
        client.logger.log("blah blah blah");
      }
       break;
    case "rs":
    case "redstar":
    case "redstarque":
      client.redstarQue.forEach(function (value, key, mapObj) {  
        var keyObj = client.redstarQue.get(key);
        hasData=true;
        dataTable.cell('#', ++i);
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    case "ws":
    case "roster":
    case "rosterdb":
      client.rosterDB.forEach(function (value, key, mapObj) {  
        var keyObj = client.rosterDB.get(key);
        hasData=true;
        dataTable.cell('#', ++i);
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
        if (args[1] === "RESET" && level >= 9)
          client.rosterDB.delete(key);

      }); 
      break;
    case "user":
    case "userdb":
      client.userDB.forEach(function (value, key, mapObj) {  
        var keyObj = client.userDB.get(key);
        hasData=true;
        dataTable.cell('#', ++i);
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    case "settings":
      client.settings.forEach(function (value, key, mapObj) {  
        var keyObj = client.settings.get(key);
        hasData=true;
        dataTable.cell('#', ++i);
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    case "tech":
    case "hstech":
      client.hsTech.forEach(function (value, key, mapObj) {  
        var keyObj = client.hsTech.get(key);
        hasData=true;
        dataTable.cell('#', ++i);
        dataTable.cell('Key', key);
        dataTable.cell('Data', JSON.stringify(keyObj));
        dataTable.newRow();
      }); 
      break;
    default:
      client.logger.debug("Please specify the DB to audit: "+args.join());
      return;
  }
  
  if (!hasData)
    client.logger.debug("No data found on: "+args.join());
  else
    //return message.reply(`Audit for ${args[0]}:\n` + dataTable.toString());
    client.logger.debug(`Audit for ${args[0]}:\n` + dataTable.toString());
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Admin"
};

exports.help = {
  name: "audit",
  category: "System",
  description: "Audit the Database",
  usage: "audit <database>."
};
