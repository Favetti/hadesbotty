const express = require("express");
const asyncHandler = require('express-async-handler');


let compConfig = {};


function sendError(res, code, message) {
    res.status(code).send(JSON.stringify({
        code: code,
        error: message
    }));
    return null;
}

async function identify(req, res) {
    try {

        let token = req.get('Authorization');
        // Validate the token
        if (!token || token.trim() !== compConfig.server_key) {
            return sendError(res, 401, 'Not Authorized');
        }
        const userId = req.params.userid;
        if (!userId) {
            return sendError(res, 400, 'No UserId');
        }

        const rval = await compConfig.identify(userId);
        if (!rval) {
            // No users found
            return res.sendStatus(201);
        } else {
            res.json(rval);
        }
    } catch (e) {
        console.log(e);
        return sendError(res, 500, 'Server Error');
    }
}

async function connect(req, res) {
    try {

        let token = req.get('Authorization');
        // Validate the token
        if (!token || token.trim() === '') {
            return sendError(res, 401, 'Not Authorized');
        }
        let payload = req.body;
        console.log('Payload', payload);
        if (!payload.guild_id || payload.guild_id.trim() === '') {
            console.log("Payload Invalid. No Server Id");
            return sendError(res, 400, "Server ID not provided");
        }

        const rval = await compConfig.connect(token, payload.guild_id.trim());
        if (!rval) {
            // No users found
            return res.sendStatus(403);
        } else {
            res.json(rval);
        }
    } catch (e) {
        console.log(e);
        return sendError(res, 500, 'Server Error');
    }
}

async function refresh(req, res) {
    try {
        // Requires command token
        const token = req.get('Authorization');
        if (!token || token.trim() === '') {
            return sendError(res, 401, 'Not Authorized');
        }

        const rval = await compConfig.refresh(token);
        if (!rval) {
            // Unable to refresh token
            return res.sendStatus(403);
        } else {
            res.json(rval);
        }
    } catch (e) {
        console.log(e);
        return sendError(res, 500, 'Server Error');
    }

}

function init(config) {
    compConfig = config || {};
    const router = express.Router();
    router.get('/identify/:userid', asyncHandler(identify));
    router.post('/connect', asyncHandler(connect));
    router.get('/refresh', asyncHandler(refresh));

    return router;
}

module.exports = init;
