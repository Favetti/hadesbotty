// TO-DO:  accept SPACE instead of ',' for set multiple tech levels


exports.run = async (client, message, args, level) => { 

  const moment = require("moment"),
        table = require('easy-table');
 
  var targetID = message.author.id,
      searchObj = message.guild,
      dataTable = new table,
      singleTarget = true,
      hasData = false,
      missedArg = "",
      techLevels,
      techLevel,
      techGroup,
      techID,
      action;
  
  // *** PARSE and SORT OUT arguments
  args.forEach(function(arg) {
    arg = client.normalizeTechName(arg);
    
    // *** Find ACTION
    if (["set", "get", "score", "search"].includes(arg))
        action = arg;

   
    // *** Find TARGET
    else if (arg === "all") { //target is the guild
      singleTarget = false;
    }
    else if (arg.indexOf("<@&") >= 0) { //target is a ROLE
      singleTarget = false;
      //const roleID = arg.replace("<@&","").replace(">","");
      const roleID = arg.replace(/[^0-9]/g,"");
      if (!message.guild.roles.has(roleID)) return message.reply("Role not found! Maybe i can't mention it...");
      searchObj = message.guild.roles.get(roleID);
    }
    else if (arg.indexOf("<@") >= 0 ) //target is a USER
      //targetID = arg.replace("<@","").replace(">","");
      targetID = arg.replace(/[^0-9]/g,"");
    else if (client.config.hadesTechSize[arg]) // target is Tech Group
      techGroup = arg;
    
    // Other ARGS
    else if (client.config.hadesTech[arg]) // found techID
      techID = arg;
    else if (arg >= 0 && arg <=10)
      techLevel = arg;
    else if (arg.indexOf(",") >0)
      techLevels = arg.split(",");
    else 
      missedArg += arg+" ";
      //client.logger.log("<!> Unidentified ARG: "+arg);
  });
  
  if (missedArg)
    message.reply("I did not understand all you said... gonna try to reply ignoring: "+missedArg);
  
  // *** VALIDATE ARGUMENTs COMPOSITION
  if (!action)
    return message.reply("I could not understand what you want... \n ... GET ? SET ? SCORE ? SEARCH ?\n ... Go to the Beach ?");

  if (action === "set") {
    if (!singleTarget) 
      return message.reply("Cannot SET parameters for a GROUP.");
    if (level <= 1 && targetID != message.author.id)
      return message.reply("Only Moderators or higher can SET other people's tech... safety stuff, you know...");
  }
    
  if (action === "get") {
    if (!singleTarget) 
      return message.reply("GET can only return a single user.");
    
    if (!client.hsTech.has(targetID))
      return message.reply(`<@${targetID}> doesn't have any data`);
    
    if (!client.checkPrivacy(targetID, message.guild.id))
      return message.reply("this user chose not to allow his tech to be viewed in this channel. You can ask him to WhiteList this channel or clear his WhiteList.")
      
  }

  if (action === "search") {
    if (techGroup)
      return message.reply("SEARCH only works with a single tech. Use TechReport for broader options.");
    else if (!techID)
      return message.reply("SEARCH needs a valid tech.");
  }

  // *** EXECUTE THE COMMAND
  if (action === "get"){

    let allTech = client.hsTech.get(targetID);
    let msg = (targetID == message.author.id ? "here are your Tech levels: " : `here are Tech levels for <@${targetID}>`);
    let lineBreaker = "Base";

    Object.keys(client.config.hadesTech).forEach(techID => {
      let techLevel = allTech[techID];
      if (techLevel >0) {
        //msg += (`\n${client.config.hadesTech[techID].desc}: ${techLevel}`);
        hasData=true;
        let splitTech = client.config.hadesTech[techID].desc.split(" - ");
        if ( lineBreaker != splitTech[0] ) {
          //dataTable.cell('Group', "-------");
          dataTable.cell('Tech', "--------------"+splitTech[0]+"-");
          dataTable.cell('Level', "-----");
          dataTable.cell('Score', "-----");
          dataTable.newRow();
          lineBreaker = splitTech[0];
        }
        //dataTable.cell('Group', splitTech[0]);
        dataTable.cell('Tech', splitTech[1]);
        dataTable.cell('Level', "  "+techLevel);
        dataTable.cell('Score', client.config.hadesTech[techID].levels[Number(techLevel-1)], table.number(0));
        dataTable.newRow();
      }
    });  
    if (!hasData) return message.reply("No data found");
    else return message.reply(msg + "```" + dataTable.toString()+"```"); 
    //return message.reply(msg);    
  }
  else if (action === "score"){
    searchObj.members.forEach(function (value, index){
      if (client.hsTech.has(index)) {
        let allTech = client.hsTech.get(index);
        let tDB = client.userDB.get(index) || {username: `<@${index}>`}
        let techLevel = 0;
        Object.keys(allTech).map(function(techID, index) {
          if (client.config.hadesTech[techID]) 
            techLevel += client.config.hadesTech[techID].levels[Number(allTech[techID]-1)] || 0;
        });
        hasData=true;
        dataTable.cell('Level', techLevel);
        dataTable.cell('User', tDB.username);
        dataTable.newRow();
      }
    });  
    if (!hasData) return message.reply("No data found");
    else return message.reply(`Score recorded for everyone of ${args[0] || ""} ${searchObj.name}:\n` + "```" + dataTable.sort(['Level|des']).toString()+"```"); 
  }  
  else if (action === "search"){
    let filteredUsers = "";
    
    searchObj.members.forEach(function (value, index){
      if (client.hsTech.has(index)) {
        let allTech = client.hsTech.get(index);
        let tDB = client.userDB.get(index) || {username: `<@${index}>`}
        if (client.checkPrivacy(index, message.guild.id)) {
          let techLevel = allTech[techID] || 0;
          if (techLevel >0) {
            hasData=true;
            dataTable.cell('Level', techLevel);
            dataTable.cell('User', tDB.username);
            dataTable.newRow();
          }
        }
        else
          filteredUsers +=  tDB.username+", ";       
      }
    });
    if (filteredUsers !== "") message.reply("your query had users that choose not to allow tech to be viewed in this channel: `"+filteredUsers+"`. You can ask them to WhiteList this channel or clear their WhiteList.")
    if (!hasData) return message.reply("No data found.");
    else return message.reply(`Tech level recorded for everyone of ${args[0]} ${searchObj.name}:\n` + "```" + dataTable.sort(['Level|des']).toString()+"```");
  }  
  else if (action === "set"){

    //client.logger.debug(message.author.id+"|SET:"+targetID+"|tGroup:"+techGroup+"|tLvls:"+techLevels+":|tID:"+techID+"|tLvl:"+techLevel);
    
    let allTech = client.hsTech.get(targetID) || {rs: 0, transp: 0,	miner: 0,	bs: 0,	cargobay: 0,	computer: 0,	tradeboost: 0,	rush: 0,	tradeburst: 0,	autopilot: 0,	offload: 0,	beam: 0,	entrust: 0,	recall: 0,	hydrobay: 0,	miningboost: 0,	enrich: 0,	remote: 0,	hydroupload: 0,	miningunity: 0,	crunch: 0,	genesis: 0,	battery: 0,	laser: 0,	mass: 0,	dual: 0,	barrage: 0,	alpha: 0,	delta: 0,	pas: 0,	omega: 0,	mirror: 0,	area: 0, emp: 0,	teleport: 0,	rsextender: 0,	repair: 0,	warp: 0,	unity: 0,	sanctuary: 0,	stealth: 0,	fortify: 0,	impulse: 0,	rocket: 0,	salvage: 0,	suppress: 0,	destiny: 0,	barrier: 0,	vengeance: 0,	leap: 0 };
    let msg = "Setting tech for <@"+targetID+">";
    let invalid = "Invalid Levels:";

    if (!techGroup) { // single Tech
      if (!techID || !techLevel)
        return message.reply("Did you forget something ?? Missing the tech levels...");
      if (!client.config.hadesTech[techID].levels[techLevel-1] && techLevel != 0)
        return message.reply("Invalid Level ("+techLevel+") for "+client.config.hadesTech[techID].desc);
      msg += `\n${client.config.hadesTech[techID].desc} : set to ${techLevel} (was ${allTech[techID]})`
      allTech[techID] = techLevel;
    }  
    else { // group
      if (!techLevels) 
        return message.reply("Did you forget something ?? Missing the tech levels...");
      if (client.config.hadesTechSize[techGroup] != techLevels.length)
        return message.reply(`Invalid number of techs: ${techLevels.length} instead of ${client.config.hadesTechSize[techGroup]}`);

      let i = 0;
      Object.keys(client.config.hadesTech).forEach(techID => {
        if (client.config.hadesTech[techID].group == techGroup) {
          techLevel = techLevels[i++];
          if (!client.config.hadesTech[techID].levels[techLevel-1] && techLevel != 0) 
            invalid += "\n"+techLevel+" -> "+client.config.hadesTech[techID].desc;
            //msg += "\nInvalid Level ("+techLevel+") for "+client.config.hadesTech[techID].desc;
          else {          
            //msg += `\n${client.config.hadesTech[techID].desc} : set to ${techLevel} (was ${allTech[techID]})`;
            dataTable.cell('Tech', client.config.hadesTech[techID].desc);
            dataTable.cell('New Lvl', techLevel);
            dataTable.cell('Old Lvl', allTech[techID]);
            dataTable.newRow();
            allTech[techID] = techLevel;     
          }
        }
      });
      msg += "```" + dataTable.toString()+"```";
    }  
    client.hsTech.set(targetID, allTech);
    //client.logger.debug("setting "+targetID+" to: "+JSON.stringify(allTech));
    if (invalid != "Invalid Levels:") msg += invalid;
    return message.reply(msg);    
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["t"],
  permLevel: "User"
};

exports.help = {
  name: "tech",
  category: "Hades Star",
  description: "Input and retrieve tech info",
  usage: `tech [set|get|score|search] [all|@role|@user] [...args...]
- - - - - - - - - - - - - - - - - - - - - - - - - - - -
GET/SET - only work for @user (or self, if omitted)
SCORE   - works with @user, @role or all
SEARCH  - is for any tech
- - - - - - - - - - - - - - - - - - - - - - - - - - - -
Examples::
• !t set emp 5
• !t set @fato ships 4,4,4
• !t get @fato
• !t score @ws_squad_1
• !t search destiny
- - - - - - - - - - - - - - - - - - - - - - - - - - - -
TechGroups:: 
 . . . ships   (x3), trade  (x10), mining   (x8), 
 . . . weapons (x5), shields (x6), support (x18)`
};
