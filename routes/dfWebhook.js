const express = require('express');
const ga = require('actions-on-google');
const axios = require('axios');
const encodePhrase = require('../helpers/');

const router = express.Router();

const gaApp = ga.dialogflow({
    debug: false,
    clientId: process.env.CLIENT_ID,
});

router.post('/webhook', gaApp);

gaApp.fallback((conv) => {
    const {intent} = conv;
    switch (intent) {
        default: {
            const phraseInMorse = encodePhrase(conv.query);
            axios
                .post(process.env.ESP32IP, {
                morseScript: phraseInMorse.morseSignalLengths
            })
            .then(() => {
                console.log('Request processed');
            })
            .catch((error) => {
                console.log(error);
            })
            return conv.ask(phraseInMorse.morseGraphicalRepresentation.join(' '));
        }
    }
})

module.exports = router;