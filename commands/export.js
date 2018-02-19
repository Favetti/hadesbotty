// Export data from a selected Guild (or Role) into a file for web access 
//

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
 
  const table = require('easy-table'),
        tableify = require('tableify'),
        fs = require('fs'),
        dir = '/app/public/',
        url = `https://${process.env.PROJECT_DOMAIN}.glitch.me/`;
  
  var hasData=false,
      dataTable = new table,
      searchObj = message.guild,
      dataObj = {},
      html = "";
    
  // ************************************* return members of a specified ROLE
  if (args[0] === "role") {
    const roleID = args[1].replace("<@&","").replace(">","");
    if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
    searchObj = message.guild.roles.get(roleID);
  }
  
  var targetMembers = [];
  //var targetMembers = {};
  searchObj.members.forEach(function (target, targetID, mapObj){
    targetMembers.push(targetID);
    //targetMembers[targetID] = mapObj.username;
    //client.logger.debug("::"+targetID+":::"+mapObj.username);
  }); 
  
  // Make Header
  html = "<HTML><BODY><TABLE><TR><TH>User</TH>";
  Object.keys(client.config.hadesTech).forEach(techID => {html += "<TH>"+techID+"</TH>";});
  html += "</TR>";  

  client.hsTech.forEach(function (target, targetID, mapObj){
    if (targetMembers.includes(targetID)) {
    //if (targetMembers.hasOwnProperty(targetID)) {
      hasData=true;
      //var targetDB = client.userDB.get(targetID) || {username: targetMembers[targetID]}
      var targetDB = client.userDB.get(targetID) || {username: targetID}
      
      html += "<TR><TD>"+targetDB.username+"</TD>";
      Object.keys(client.config.hadesTech).forEach(techID => { 
        var techLevel = client.hsTech.get(targetID)[techID] || 0;
        html += "<TD>"+techLevel+"</TD>";
      });
      html += "</TR>";   
    }
  });

  // close the html
  html += "</TABLE></BODY></HTML>";
  
/*  
  //sort thru all users in a guild or role and export only the ones that have data on client.hsTech 
  searchObj.members.forEach(function (target, targetID, mapObj){
    if (client.hsTech.has(targetID)) {
      hasData=true;
      var allTech = client.hsTech.get(targetID);
      var targetDB = client.userDB.get(targetID) || {username: target}
      
      Object.keys(allTech).map(function(techID, index) {
        //client.logger.log("x");
      });

      //attempt with TABLEIFY
      //all wrong... https://hadesbotty.glitch.me/TABLEIFY_exaple_output.html
      dataObj[targetDB.username] = client.hsTech.get(message.author.id);
                  
      //attempt with EASY_TABLE
      //correct values, pure txt format... works great for bot replies, but not web: https://hadesbotty.glitch.me/EASY_TABLE_example_output.html
      dataTable.cell('User', targetDB.username);
      Object.keys(allTech).map(function(techID, index) {
        dataTable.cell(techID, allTech[techID]);
      });
      dataTable.newRow();   
   }
  }); 
*/     
    
  if (!hasData) return message.reply("No data found");
  
  var filename = searchObj.id+".html";
  
  //fs.writeFile(dir+filename, dataTable.sort('User').toString(), function(err) {  //attempt with EASY-TABLE
  //fs.writeFile(dir+filename, tableify(dataTable), function(err) {              //attempt with TABLEIFY
  fs.writeFile(dir+filename, html, function(err) {
    if(err) {
      return message.reply(`Erro salvando arquivo...`+dir+filename);
      client.logger.error(err);
    }
    client.logger.log("The file was saved: "+dir+filename);
  }); 
  return message.reply(`Data exported for ${args[0]||"guild"} ${searchObj.name}:\n Check it on: `+url+filename); 
 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Administrator"
};

exports.help = {
  name: "export",
  category: "Hades Star",
  description: "Export Guild's Tech data to a webpage.",
  usage: "export"
};
