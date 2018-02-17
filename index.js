if (process.version.slice(1).split(".")[0] < 8) throw new Error("Node 8.0.0 or higher is required. Update Node on your system.");

const Discord = require("discord.js");
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const client = new Discord.Client();
client.config = require("./config.js");
client.logger = require("./util/Logger");
require("./modules/functions.js")(client);

client.commands = new Enmap();
client.aliases = new Enmap();

client.settings = new Enmap({provider: new EnmapLevel({name: "bottySettings", dataDir: ".data"})});
client.points = new Enmap({provider: new EnmapLevel({name: "points", dataDir: ".data"})});
client.hsTech = new Enmap({provider: new EnmapLevel({name: "hsTech", dataDir: ".data"})});
client.usersData = new Enmap({provider: new EnmapLevel({name: "usersData", dataDir: ".data"})});
client.userDB = new Enmap({provider: new EnmapLevel({name: "userDB", dataDir: ".data"})});

// We're doing real fancy node 8 async/await stuff here, and to do that
// we need to wrap stuff in an anonymous function. It's annoying but it works.
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
  
  // Here we login the client.
  client.login(client.config.token);
  
// End top-level async/await function.

  // Express Keepalive for Glitch
  const http = require('http');
  var path = require('path');
  const express = require('express');
  const moment = require("moment");

  const app = express();
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get("/", (request, response) => {
    //client.logger.log(" HTTPS Ping Received from " + request.headers['x-forwarded-for'].split(",",1));
    //response.sendStatus(200);
    response.sendFile(__dirname + '/web/index.html')
  });
  app.listen(process.env.PORT);
  client.logger.log(` HTTPS STARTED on ${process.env.PROJECT_DOMAIN} port ${process.env.PORT}`);
  if(process.env.BOTTY_ENVIRONMENT === "PRD") {
    setInterval(() => {
      http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
    }, 250000);
  }
};

init();


