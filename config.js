'use strict';

const express = require('express');

const router = express.Router();

router.get('/', (_req, res) => {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
    res.json({
        googleClientId,
        googleEnabled: Boolean(googleClientId),
        apiVersion: 1
    });
});

module.exports = router;
