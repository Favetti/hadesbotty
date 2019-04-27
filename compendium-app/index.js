/*
    Main module entry point for compendium app integration.
    Thie defines the callbacks and initializes the compendium endpoints.

    Note that the environment must contain the following:

        COMPENDIUM_APP_SERVER_KEY="<Key Shared with McGoldric>"
        COMPENDIUM_APP_JWT_SECRET="<A secret key used to prepare tokens>"

 */

const appInit = require('./include/app-init');
const jwt = require("jsonwebtoken");
const NodeCache = require('node-cache');

// Discord Client
let client = null;
// Local cache for user tokens. Tokens can disappear if server restarts, so they should just retry
const cache = new NodeCache({stdTTL: 300, checkperiod: 60, useClones: false});

module.exports = function (discordClient) {
    client = discordClient;

    return appInit({
        // The following 5 items are required. There may be others but they will be enabled via features.
        server_key: process.env.COMPENDIUM_APP_SERVER_KEY,
        identify: identify,
        connect: connect,
        refresh: refresh,
        setTech: setTech
    });
};

/*
    Return a structure describing the servers (guilds) the user can interact with.
    Also return a short-lived token (otp) the app can use to connect.
    The token should allow this bot to identify the user. Here we use a local cache.
    The structure of the returns JSON is:
    {
       "token": "<some token>",
       "guilds": [
          {
             "id": "<guild snowflake>",
             "name": "<guild name>",
             "icon": "<guild icon identifier>"
          },
          ...
       ]
    }
 */
async function identify(userid) {
    // This requires us to identify the connected user in our bot
    // we need to list the attached guilds with this user
    let user = client.userDB.get(userid);
    // For hades-botty, guilds are snowflake-like keys in the user object
    const guilds = Object.keys(user).filter((k) => /^[0-9]+$/.test(k));
    // guilds can be further filter based on whatever custom rules - guild settings, etc

    if (guilds && guilds.length) {
        let guildInfo = guilds.map((g) => {
            let guild = client.guilds.get(g);
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon
            };

        });
        // Save the data temporarily
        cache.set(userid, {
            id: userid,
            user: user,
            guilds: guildInfo
        });
        const userToken = jwt.sign({userId: userid}, process.env.COMPENDIUM_APP_JWT_SECRET, {
            subject: 'identify',
            expiresIn: "3m",
        });

        return {
            "token": userToken,
            "guilds": guildInfo
        }
    } else {
        return false; // there are no guilds for this user with the interface enabled.
    }
}



/*
    Convenience function, given a user and member record, construct the user record
    expected by the client.
 */
function partialUser(user, member) {
    return {
        id: user.id,
        username: member && member.displayName && member.displayName.trim() !== '' ? member.displayName : user.username,
        avatar: user.avatar
    };
}

class UserVerifyException {
    constructor(code, message) {
        this.code = code;
        this.message = message;
    }
}


/*
    Given a userid and guildid, this returns the object that must be returned by both connect and refresh.
    Both methods expect the following structure
    {
        "user": {
           "id": "<User Snowflake>",
           "username": "<user name or nickname>",
           "avatar": "<user avatar identifier>"
        },
        "guild": {
           "id": "<guild snowflake>",
           "name": "<guild name>",
           "icon": "<guild icon identifier>" // Optional
        },
        "token": "<long-lived token>",
        "features": {   // Features are optional for connect calls, as they are ignored.
           // Future features can be enabled here.
           "wsRosters": [       // WS rosters are enabled by providing a non-empty array as shown.
            { "id": "<roster1Id>",
              "name": "<roster Name>"
            }, ...
           ]
        }
     }
     The token returned should allow the bot to identify the user and guild in subsequent api calls.

 */
async function getConnectResponse(userId, guildId) {
    // Check the guild for this users membership
    let guild = client.guilds.get(guildId);
    if (!guild || !guild.available) {
        throw new UserVerifyException(400, 'Guild not available');
    }
    let member = null, user = null;
    try {
        user = await client.fetchUser(userId, true);
        member = await guild.fetchMember(userId, true);
        if (user == null || member == null) {
            throw 'Not a member';
        }
    } catch (e) {
        throw new UserVerifyException(403, 'User no longer a member.');
    }
    // At this point, we have a member in the guild which we are connected to.
    let userToken = jwt.sign({ userId: userId, guildId: guildId }, process.env.COMPENDIUM_APP_JWT_SECRET, {
        subject: 'command',
        expiresIn: "365d",
    });
    return {
        user: partialUser(user, member),
        guild: {
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
        },
        token: userToken,
        features: {

        }
    };
}

/*
    Verify the user can connect and return the token and data from getConnectResponse()
 */
async function connect(identityToken, guildId) {
    try {
        // Validate the token
        let tokenPayload = jwt.verify(identityToken, process.env.COMPENDIUM_APP_JWT_SECRET, {
            subject: 'identify',
        });

        // We should have the user info cached
        let userData = cache.get(tokenPayload.userId);
        if (!userData) {
            console.log("User data from identify not found.");
            return false;
        }
        console.log(userData, guildId);
        let guild = userData.guilds.find((g) => g.id === guildId);
        if (!guild) {
            console.log("Payload Invalid. Invalid Server Id");
            return false;
        }

        return await getConnectResponse(tokenPayload.userId, guildId);
    } catch (e) {
        console.log(e);
        return false;
    }


}

/*
    Verify the user can connect and return the token and data from getConnectResponse()
 */

async function refresh(token) {
    let tokenPayload = null;
    try {
        tokenPayload = jwt.verify(token, process.env.COMPENDIUM_APP_JWT_SECRET, {
            subject: 'command',
        });
    } catch (e) {
        console.log("Invalid token");
        return false;
    }
    try {
        return await getConnectResponse(tokenPayload.userId, tokenPayload.guildId);
    } catch (e) {
        console.log("Exception: ", e);
        return false;
    }

}

/*
    Set the users tech.  Received the tech as { tech: level, ...} and setsall tech for the user
 */
async function setTech(identityToken, tech) {
    try {
        // Validate the token
        let tokenPayload = jwt.verify(identityToken, process.env.COMPENDIUM_APP_JWT_SECRET, {
            subject: 'command',
        });

        // This replaces all values - so start with zeros
        let allTech = {
            rs: 0,
            cargocap: 0,
            transp: 0,
            miner: 0,
            bs: 0,
            cargobay: 0,
            computer: 0,
            tradeboost: 0,
            rush: 0,
            tradeburst: 0,
            shipdrone: 0,
            offload: 0,
            beam: 0,
            entrust: 0,
            dispatch: 0,
            recall: 0,
            miningboost: 0,
            hydrobay: 0,
            enrich: 0,
            remote: 0,
            hydroupload: 0,
            miningunity: 0,
            crunch: 0,
            genesis: 0,
            minedrone: 0,
            battery: 0,
            laser: 0,
            mass: 0,
            dual: 0,
            barrage: 0,
            dart: 0,
            alpha: 0,
            delta: 0,
            passive: 0,
            omega: 0,
            mirror: 0,
            blast: 0,
            area: 0,
            emp: 0,
            teleport: 0,
            rsextender: 0,
            repair: 0,
            warp: 0,
            unity: 0,
            sanctuary: 0,
            stealth: 0,
            fortify: 0,
            impulse: 0,
            rocket: 0,
            salvage: 0,
            suppress: 0,
            destiny: 0,
            barrier: 0,
            vengeance: 0,
            deltarocket: 0,
            leap: 0,
            bond: 0,
            drone: 0,
            omegarocket: 0
        };
        // Iterate as the tech command does to check valid values. Maybe here we just clamp them
        Object.keys(tech).forEach((t) => {
                if (client.config.hadesTech[t]) {
                    const v = Math.max(0, Math.min(client.config.hadesTech[t].levels.length, tech[t]));
                    allTech[t] = v;
                }
            }
        );
        client.hsTech.set(tokenPayload.userId, allTech);
        return true;
    } catch (e) {
        console.log(e);
        return false;
    }

}
