// Export data from a selected Guild (or Role) into a file for web access 
//

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
 
  const fs = require('fs'),
        dir = '/app/public/',
        url = `https://${process.env.PROJECT_DOMAIN}.glitch.me/`;
  
  var hasData=false,
      searchObj = message.guild,
      dataObj = {},
      html = "";
    
  // ************************************* return members of a specified ROLE
  args.forEach(function(arg) {
    if (arg.indexOf("<@&") >= 0) { //target is a ROLE
      const roleID = arg.replace("<@&","").replace(">","");
      if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
      searchObj = message.guild.roles.get(roleID);
    }
  });
  
  var targetMembers = [];
  searchObj.members.forEach(function (target, targetID, mapObj){
    targetMembers.push(targetID);
  }); 
  
  // Make Header
  html = "<HTML><BODY><TABLE><TR><TH>User</TH>";
  Object.keys(client.config.hadesTech).forEach(techID => {html += "<TH>"+techID+"</TH>";});
  html += "<TH>techScore</TH></TR>";  

  client.hsTech.forEach(function (target, targetID, mapObj){
    if (targetMembers.includes(targetID)) {
      hasData=true;
      let targetDB = client.userDB.get(targetID) || {username: targetID}
      
      html += "<TR><TD>"+targetDB.username+"</TD>";
      let techScore = 0;
      Object.keys(client.config.hadesTech).forEach(techID => { 
        let techLevel = client.hsTech.get(targetID)[techID] || 0;
        techScore += client.config.hadesTech[techID].levels[Number(techLevel)-1] || 0;
        html += "<TD>"+techLevel+"</TD>";
      });
      html += "<TD>"+techScore+"</TD></TR>";   
    }
  });

  // close the html
  html += "</TABLE></BODY></HTML>";
  
  if (!hasData) return message.reply("No data found");
  
  var filename = searchObj.id+".html";
  
  fs.writeFile(dir+filename, html, function(err) {
    if(err) {
      return message.reply(`Erro salvando arquivo...`+dir+filename);
      client.logger.error(err);
    }
    client.logger.log("The file was saved: "+dir+filename);
  }); 
  var webData = client.settings.get(message.guild.id).webSheet || url+filename;
  
  return message.reply(`Data exported for ${args[0]||"guild"} ${searchObj.name}:\n Check it on: `+webData); 
 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "export",
  category: "Hades Star",
  description: "Export Guild's Tech data to a webpage.\nFor an example of import Sheet, visit: https://goo.gl/zfPDoz",
  usage: "export  [role @role]\nYou can set another URL to be replied with !set add webSheet <URL> (case sensitive)"
};
