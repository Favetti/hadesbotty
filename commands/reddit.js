// test to fetch reddit wiki... turns out hard to read on discord.
// need more work

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  if (!args) return message.reply("What should i query on the Reddit Wiki?");
  const techID = client.normalizeTechName(args[0]);
    
  if (!client.config.hadesTech[techID]) return message.reply(`Invalid Tech: ${techID}`);
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
      table = "",
      title = "",
      tableObj = {name: techID, maxLevels: 0};

  result.forEach(function(line) {
    if (line != "" && line != "[Main Page](/r/HadesStar/wiki)") {
      if ( line.indexOf("#") === 0)
        title = line.replace(/[^a-zA-Z0-9 ]/g, "");
      else if ( line.indexOf("|") >= 0 ) {
        if ( line.replace(/[^a-zA-Z0-9 ]/g, "") !== "") {
          table+=line+"\n" 
          if (line.indexOf("Level">=0))
            tableObj.maxLevels = line.split("|").lenght-1;
          else {
            let x = line.split("|");
            tableObj[line[0].trim()]
          }            
        }
      }
      else
        desc+=line+"\n" ;
    }
    });
 
  //return message.reply(" here is the page from Wiki: https://reddit.com/r/"+subreddit+"/wiki/"+wikiPage+"\n```" + page + "```");
  
  const Discord = require("discord.js"),
        embed = new Discord.RichEmbed()
  .setTitle("Here is the page from Wiki: https://reddit.com/r/"+subreddit+"/wiki/"+wikiPage)
  .setURL("https://reddit.com/r/"+subreddit+"/wiki/"+wikiPage)
  .setColor(0x00AE86)
  //.setDescription(desc)
  //.setFooter(table)
  .addField(title, desc+"```"+table+"```")

  message.channel.send({embed});
  
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Bot Owner"
};

exports.help = {
  name: "reddit",
  category: "Hades Star",
  description: "",
  usage: "reddit [topic]"
};
