//throw new Error("DISABLED");

if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const util = require('util');
const promisify = util.promisify;
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const DBL = require("dblapi.js");

const client = new Discord.Client();
client.config = require("./config.js");
client.logger = require("./util/Logger");
require("./modules/functions.js")(client);
require("./modules/tech.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

client.settings = new Enmap({provider: new EnmapLevel({name: "bottySettings", dataDir: ".data"})});
client.hsTech = new Enmap({provider: new EnmapLevel({name: "hsTech", dataDir: ".data"})}); //this should be techDB
client.userDB = new Enmap({provider: new EnmapLevel({name: "userDB", dataDir: ".data"})});
client.rosterDB = new Enmap({provider: new EnmapLevel({name: "rosterDB", dataDir: ".data"})});
client.redstarQue = new Enmap({provider: new EnmapLevel({name: "redstarQue", dataDir: ".data"})});
client.wikiTech = new Enmap({provider: new EnmapLevel({name: "wikiTech", dataDir: ".data"})});

const init = async () => {
  
  const cmdFiles = await readdir("./commands/");
  client.logger.log(`Loading a total of ${cmdFiles.length} commands.`);
  cmdFiles.forEach(f => {
    if (!f.endsWith(".js")) return;
    const response = client.loadCommand(f);
    if (response) console.log(response);
  });

  const evtFiles = await readdir("./events/");
  client.logger.log(`Loading a total of ${evtFiles.length} events.`);
  evtFiles.forEach(file => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });

  client.levelCache = {};
  for (let i = 0; i < client.config.permLevels.length; i++) {
    const thisLevel = client.config.permLevels[i];
    client.levelCache[thisLevel.name] = thisLevel.level;
  }
  
  client.login(client.config.token);
  
  // *** HTTP SERVER ***
  var http = require('http'),
      path = require('path'),
      express = require('express'),
      moment = require("moment"),
      app = express(),
      html = '<HTML><BODY><a href="https://discordbots.org/bot/410562547092160522" ><img src="https://discordbots.org/api/widget/410562547092160522.svg" alt="Discord Bot" /></a></BODY></HTML>';
  
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get("/", (request, response) => {
    //client.logger.log(" HTTPS Ping Received from " + request.headers['x-forwarded-for'].split(",",1));
    //response.sendStatus(200);
    response.send(html);
  });

  app.listen(process.env.PORT);
  
  // Express Keepalive for Glitch and post DBL stats  
  const dbl = new DBL(process.env.DISCORDBOTS_TOKEN);
  setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    if(process.env.BOTTY_ENVIRONMENT === "PRD") 
      dbl.postStats(client.guilds.size);
  }, 250000);
  
};

init();