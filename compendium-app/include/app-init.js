const express = require("express");
const bodyParser = require('body-parser');

// This function creates the subroutes and wires up the callbacks
/* config should be an object containing the following:
    {
        "server_key": "<pre-shared key for Compendium Bot Server>",
        "identify": function(userid) {  returns identify result object  },
        "connect": function(identityToken, guildId) {  returns connection object  },
        "setTech": function(userToken, tech, level) { stores the tech info },
        "setLoadout": function(userToken, ... TBD) { },
    }
 */

function init(config) {
    const router = express.Router();

    // Parse all requests bodies as json
    router.use(bodyParser.json());

    if (!config.server_key || !config.identify || !config.refresh || !config.connect || !config.setTech) {
        console.log('Compendium API incorrectly initialized.');
    } else {
        router.use('/applink', require('../app-link')(config));
        router.use('/cmd', require('../app-cmd')(config));
    }
    return router;
}


module.exports = init;

