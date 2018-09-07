'use strict';
/**
 * Module dependencies
 */
//=============================================================================
const
  express = require('express'),
  router = express.Router(),
  path = require('path'),
  talkToBot = require('../utils/ChatBot');
//=============================================================================
/**
 * Module variables
 */
//=============================================================================
//=============================================================================
/**
 * Routes
 */
//=============================================================================
router.get('/welcome', async (req, res) => {
  try {
    let responseFromBot = await talkToBot(null)
    res.status(200).json({ responseFromBot })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})
router.post('/send_message', async (req, res) => {
  try {
    let responseFromBot = await talkToBot(req.body.input)
    res.status(200).json({ responseFromBot })
  } catch (error) {
    res.status(500).json({ message: error })
  }
})
//=============================================================================
/**
 * Export Module
 */
//=============================================================================
module.exports = router;
//=============================================================================
