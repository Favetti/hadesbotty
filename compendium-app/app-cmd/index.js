const express = require("express");
const asyncHandler = require('express-async-handler');
const moduleTypes = require("../include/module_types");


let compConfig = {};

/*
    Convenience method to send an error response
 */
function sendError(res, code, message) {
    res.status(code).send(JSON.stringify({
        code: code,
        error: message
    }));
    return null;
}


/*
    setTech handler. Maps tech from internal ids to local bot ids and calles the
    setTech callback
 */
async function setTech(req, res) {
    try {
        let token = req.get('Authorization');
        // Validate the token
        if (!token || token.trim() === '') {
            return sendError(res, 401, 'Not Authorized');
        }

        // Body should have a map of techid:level
        let payload = req.body;
        if (!payload.tech) {
            console.log("Payload Invalid. No tech");
            return sendError(res, 400, "Tech not provided");
        }
        let tech = {};
        Object.keys(payload.tech).forEach((k) => {
            const name = moduleTypes.getTechFromIndex(k);
            if (name !== '') {
                tech[name] = payload.tech[k];
            }
        });
        const rval = await compConfig.setTech(token, tech);
        return res.sendStatus(rval ? 201 : 400);
    } catch (e) {
        console.log(e);
        sendError(res, 500, 'Error');
    }
}


function  init(config)  {
    compConfig = config || {};
    const router = express.Router();
    router.post('/setTech', asyncHandler(setTech));

    return router;
}

module.exports = init;
