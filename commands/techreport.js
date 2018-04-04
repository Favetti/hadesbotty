// Hades star Technology Level
// This command will calculate the tech level for all users
/* global Map */ // clear error: Map is not defined. 

exports.run = async (client, message, args, level) => { 

  args = args.map(x => x.toLowerCase());
  const table = require('easy-table');
  try {
  var hasData=false,
      errors = '',
      members = new Map(),
      reports = new Array(),
      techLists = new Array(),
      argSection = 'users',
      filteredUsers = "";
    
  args.forEach(function(arg) {
    if ('|' == arg.trim()) {
      argSection = 'techIDs';
      techLists[techLists.length] = new Map(); //Initialize a new tech list
    } else if ('techIDs' == argSection) {
      //TODO refactor this to use a common tech parsing script
      //errors += client.ParseTechArg(arg, techLists[techLists.length], client.config.hadesTech); 
      let techID = client.normalizeTechName(arg);
      if (client.config.hadesTech[techID]) {
        techLists[techLists.length - 1].set(techID, arg); // add a tech plus the arg as a label for our table
      } else if (client.config.hadesTechSize[techID]) {
        Object.keys(client.config.hadesTech).forEach(techKey => {
          if (client.config.hadesTech[techKey].group == techID) {
            techLists[techLists.length - 1].set(techKey, techKey); // add all techs from group
          }
        });
      } else {
        errors += `Cannot find tech or techgroup to match ${arg}\n`;
      }
    } else if ('users' == argSection) {
      //TODO refactor this to use a common member parsing script
      //errors += client.ParseMembersArg(arg, members, message.guild);//members is passed by refernce-by-value so it can be updated
      //errors += `arg ${argNum}: ${arg}\n`; // Debug
      if (arg.indexOf("<@&") >= 0) { //target is a ROLE
        const roleID = arg.replace("<@&","").replace(">","");
        if (!message.guild.roles.has(roleID)) {
          errors += "Role not found! Maybe i can't mention it...\n";
          return true; //Skip to next member of args
        }
        message.guild.roles.get(roleID).members.forEach(function(targetDB, targetID){
          targetDB = client.userDB.get(targetID);
          if (client.checkPrivacy(targetID, message.guild.id)) {
            members.set(targetID, targetDB);
          }
          else
            filteredUsers += targetDB.username+", ";
        });
      }
      else if (arg.indexOf("<@") >= 0 ) { //target is a USER
        var targetID = arg.replace("<@","").replace(">","").replace("!","");
        var targetDB = client.userDB.get(targetID);// || {username: targetID, lastSeen: false}
//         if (!targetDB.lastSeen) {
//           errors += `I have no records for ${targetDB.username}.\n`;
//           return true; //Skip to next member of args
//         }
        if (message.author.id === targetID) {
          //errors += "Do you need a mirror ???\n"; //Debug
        } else {
          //errors += `Showing member: ${arg}\n`; //Debug
        }
        if (client.checkPrivacy(targetID, message.guild.id)) 
          members.set(targetID, targetDB);
        else
          return message.reply("this user chose not to allow his tech to be viewed in this channel. You can ask him to WhiteList this channel or clear his WhiteList.");
      } else if (arg.trim() == 'all') {
        //errors += `Showing all: ${arg}\n`; //Debug
        message.guild.members.forEach(function(targetDB, targetID){
          targetDB = client.userDB.get(targetID);
          if (client.checkPrivacy(targetID, message.guild.id)) {
            members.set(targetID, targetDB);
          }
          else
            filteredUsers += targetDB.username+", ";
        });
      } else {
        errors += `I do not recognize the User argument: ${arg}\n`;
      }
    } else {
      errors += `Invalid argument section: ${argSection}\n`;
    }
  });
    
    if (filteredUsers !== "") message.reply("your query had users that choose not to allow tech to be viewed in this channel: `"+filteredUsers+"`. You can ask them to WhiteList this channel or clear their WhiteList.")
    
  if (members.size < 1) {
    errors += `Unable to find any matching users\n`;
  }
    
  if (techLists.length < 1 || techLists[0].size < 1) {
    errors += `Unable to find any matching technologies\n`;
  }
  
  techLists.forEach( (techMap, techMapIndex) => {
    
    //errors += `Processing techlist number ${techMapIndex}\n`; // Debug
    var headerWidth = 0;
    var reportTables = new Map();
    techMap.forEach( (techLabel, techID) => {
      //if (!techLabel) errors += "breakpoint 1";
      let colWidth = techLabel.length + (headerWidth > 0 ? 2 : 0);
      if (headerWidth + colWidth > 40) { // 2 is the spacing between cols and 50 is max width 60 minus score column (7) and name column (13)
        reportTables.set(techID, new table); // Add a map entry with the first techID that doesn't fit in this report
        headerWidth = techLabel.length; // Set headerwidth for next report table to the label for the first tech
      } else {
        headerWidth += colWidth;
      }
    })
    reportTables.set('', new table);// Add the last table, it has not techID that won't fit
    
    members.forEach( (targetDB, targetID) => {
      
      let allTech = client.hsTech.get(targetID) || client.hsTech.get('!'+targetID);
//       if (!allTech)   return errors += client.hsTech.map( (val, key) => {
//         return `Id ${targetID} doesn't match ${key}\n`; // Debug
//       }).join('');
      if (!allTech)   return;// errors += `No tech found for user ${targetID}\n`; // Debug
      if (!targetDB)  return errors += `No record found for user ${targetID}\n`; // Debug
      //errors += `Processing memberID ${targetID}\n`; // Debug
      let techScore = 0;
      
      // Start iterating through this report's tables for this user
      let reportTableIterator = reportTables.values();
      var currentTable = false;
      
      techMap.forEach( (techLabel, techID) => {
        if (!currentTable || reportTables.has(techID)) { //need to switch to a new table for this report
          let nextVal = reportTableIterator.next();
          if (nextVal.done) {
            return errors += "Expected end to reportTables iteration\n";
          }
          currentTable = nextVal.value;
          currentTable.cell('name',targetDB.username, val => String(val).substr(0,13));//Math.min(13,String(val).length);
        }
        //errors += `Processing ${techID} for memberID ${targetID}\n`; // Debug
        let techLevel = Number( allTech[techID] ) || 0;
        if (client.config.hadesTech[techID]) {
          techScore += client.config.hadesTech[techID].levels[techLevel - 1] || 0;
        } else {
          errors += `Invalid techID ${techID}\n`;
        }
        currentTable.cell(techLabel, techLevel);
      });// End techMap.forEach
      reportTables.forEach( (currentTable) => { 
        currentTable.cell('score', techScore); 
        currentTable.newRow();
      });// End reportTables.forEach
    });// End members.forEach
    if ( 0 == Array.from(reportTables.values()).reduce((total, value) => { 
        //if (!value.rows) errors += "breakpoint 2";
        return total + value.rows.length;
    }, 0) ) {
      errors += `Empty report, skipping\n`; // Debug
    } else {
      //if (!reports) errors += "breakpoint 3";
      reports[reports.length] = reportTables;
      //errors += `Added report  number ${reports.length} with  ${reports[reports.length - 1].size} tables\n`; // Debug
    }
  });//end techLists.forEach

  if (reports.length < 1) {
    return message.reply(`${errors}No data found.`);
  } else { 
    var discordCharLimit = 1500;
    message.reply(`Tech Reports:\n${errors}`);
    let reportsContent = reports
      .map( reportTables  =>  //get the report texts
         Array.from(reportTables.values())  //print all tables for report
           .map( table => table.rows.length ? table.sort(['score|des']).toString() : '' )
      );
    reportsContent.forEach((reportTables, reportIndex) => {
      let reportContent = "**Report "+reportIndex+"**\n```" 
        + reportTables.join("\n") 
        + "```";
      if (reportContent.length < discordCharLimit) {
        message.reply(reportContent);
      } else {
        var currentMessageContent = '';
        var currentReportPart = 0;
        var currentReportPartHeader = '';
        reportTables.forEach((reportTable, reportTableIndex) => {
          let tableContent =  "```" + reportTable + "```";
          
          if (!currentMessageContent || currentMessageContent.length + 1 + tableContent.length >= discordCharLimit) {
            if (currentMessageContent) {
              if (currentMessageContent.length >= discordCharLimit) {
                currentMessageContent = currentMessageContent.substr(0,discordCharLimit - 20) + "...(too long, trucated)";
              }
              message.reply(currentMessageContent);
            }
            currentReportPart++;
            currentMessageContent = "**Report: "+reportIndex
              + " Part: "+currentReportPart+ "**\n"
              + tableContent;
          } else {
            currentMessageContent += "\n" + tableContent;
          }
        });
        message.reply(currentMessageContent);
      }
    });
  }
  } catch (error) { return message.reply(`There was an error: ${error}\n${errors}`); } 
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["tr"],
  permLevel: "User"
};

exports.help = {
  name: "techreport",
  category: "Hades Star",
  description: "Shows a report on users/roles and techs",
  usage: `techreport (all or @role or @user)... | (techID or techGroup)... [| (techId or techGroup)...]...
Run multiple reports on the same users by adding another '|'
Examples:
  • !techreport all | ships
  • !techreport @nickname @roleName | miner genesis crunch | bs batt passive emp salv`
};
