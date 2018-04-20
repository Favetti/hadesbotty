// fetch reddit wiki pages

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (!args)
    return message.reply ("Please, specify the tech to query.");
      
  args = args.map(function(x){ return x.toLowerCase() });
  const techID = client.normalizeTechName(args[0]),  
        easyTable = require('easy-table');

  if (!client.config.hadesTech[techID]) return message.reply(`Invalid Tech: ${techID}`);

  var columns = [],
      dataTable = new easyTable;

  for (let i = 1; i < client.config.hadesTech[techID].levels.length ; i++){
    columns[i] = i;
  }
  
  if (args[1]) {
    columns = args[1];
    // Incase the list of columns has spaces in it we should look at the extra args
    for (let i = 2; i < args.length; i++) {
      if (columns.slice(-1) !== ',') //if last character is not a comma
        columns += ',';
      columns += args[i];
    }
  }
  
  const snoowrap = require('snoowrap'),
        subreddit = "HadesStar",
        wikiPage = client.config.hadesTech[techID].redditURL,
        r = new snoowrap({
    userAgent: 'hadesbotty.glitch.me',
    clientId: process.env.REDDIT_BOT_ID,
    clientSecret: process.env.REDDIT_BOT_SECRET,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN
  });
    
  let page = await r.getSubreddit(subreddit).getWikiPage(wikiPage).content_md;
  
  let result = page.split(/\r?\n/),
      desc = "",
      table = "";

  result.forEach(function(line) {
    if (line != "" && line != "[Main Page](/r/HadesStar/wiki)") {
      line = line.replace(/[^a-zA-Z0-9\|\s\#\>]/g, "");
      if ( line.indexOf("|") >= 0 ) {
        line = line.replace(/\s+/g, "");
        if ( line.replace(/[^a-zA-Z0-9]/g, "") != "") {
          table+=line+"\n";
          let tableLine = line.split("|");
          if (tableLine[0] == "Level")
             return true;
          for (let i = 0 ; i <= 10 ; i++) {
            if (i === 0 || columns.includes(i))
              dataTable.cell(i, tableLine[i]);
          }
          dataTable.newRow();
        }
      }
      else
        desc+=line+"\n" ;
    }
  });
 
  return message.reply(" here is the Wiki: https://reddit.com/r/"+subreddit+"/wiki/"+wikiPage+"\n"+ desc +"\n```" + dataTable.toString() + "```");
    
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["wiki"],
  permLevel: "User"
};

exports.help = {
  name: "reddit",
  category: "Hades Star",
  description: "Fetch a Wiki page from Reddit about Techs",
  usage: "reddit [tech] [levels]\n If levels are specied, only show those specific columns."
};
