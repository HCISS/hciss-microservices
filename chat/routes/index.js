const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit");

const ChatLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 1 create account requests per `window` (here, per hour)
  message: {
    status: false,
    message:
      "Too many conections by same IP, please follow-up x-limits and try again after an hour later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
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

router.all("/", ChatLimiter, (req, res, next) => {
  res.json({
    status: true,
    server: "Up and Running",
    data: "Welcome to the HCISS Chat Rest Api",
  });
});

module.exports = router;
