const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const dialogflow = require("dialogflow");
const GOOGLE = require("../credentials/dialogflow");

const ChatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1000, // Limit each IP to 1 create account requests per `window` (here, per hour)
  message: {
    status: false,
    message:
      "Too many conections by same IP, please follow-up x-limits and try again after an hour later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @api {post} /api/chat  Dialogflow Chat connection
 * @apiName Create new users
 * @apiPermission Registration
 * @apiGroup User
 *
 * @apiParam  {String} [userName] username unique
 * @apiParam  {String} [email] password
 * @apiParam  {String} [role] enum [seller, buyer] from Schema
 *
 * @rateLimit 1 Hour Window (IP) / Request limit:100 JWT 12 minutes
 *
 * @apiSuccess (200) {Object} mixed `User` object -> @apiHiddenParam {String} password
 * @apiError (200) {Object} {status: false, message: message}
 **/

router.post("/", ChatLimiter, async (req, res, next) => {
  const { userId, message } = req.body;

  if (!userId || !message)
    return res
      .status(400)
      .json({ status: false, error: "userId and message fields are required" });

  const sessionId = userId + "hciss";
  const languageCode = "en-US";
  const sessionClient = new dialogflow.SessionsClient(GOOGLE);
  const sessionPath = sessionClient.sessionPath(
    GOOGLE.credentials.project_id,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  await sessionClient
    .detectIntent(request)
    .then((responses) => {
      const result = responses[0].queryResult;
      
      return res.json({
        status:true,
        message: message,
        messageResponse: result.fulfillmentText,
        //full: result,
      });
    })
    .catch((err) => {
      console.log({ error: err });
      return res.status(500).json({ status: false, error: err });
    });
});

/**
 * @api {all} / Default Welcome
 * @apiName Welcome
 * @apiPermission Guests
 * @apiGroup User
 *
 * @rateLimit 1 Windwos (IP) / Request limit:100 - Default Limit app.js
 *
 * @apiSuccess (200) {Object} mixed object
 * @apiError (404) {Object} {status: true, message: message}
 **/

router.all("/", (req, res, next) => {
  res.json({
    status: true,
    server: "Up and Running",
    data: "Welcome to the HCISS Chat Rest Api v1",
  });
});

module.exports = router;
