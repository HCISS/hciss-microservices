const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const User = require("../models/User");

const AccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 1 create account requests per `window` (here, per hour)
  message: {
    status: false,
    message:"Too many conections by same IP, please follow-up x-limits and try again after an hour later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @api {post} /auth Auth user
 * @apiName Auth users
 * @apiPermission JWT / 7200 seconds / Active Session - no paralel use
 * @apiGroup User
 *
 * @apiParam  {String} [userName] username
 * @apiParam  {String} [email] password
 * 
 * @rateLimit 1 Hour Window (IP) / Request limit:100 JWT 12 minutes
 * 
 * @apiSuccess (200) {Object} mixed `JWT token` object
 * @apiError (401) {Object} {status: false, message: message}
 **/

router.post("/auth", AccountLimiter, (req, res, next) => {
    const { username, password } = req.body;

    !username || !password ? res.json({ status: false, error: "username and password are required!"}) : User.findOne({ username }, (err, user) => {
        if (err) throw err;

        !user ? res.json({ status: false, error: "Auth failed" }) : bcrypt.compare(password, user.password).then((result) => {
          if (!result) res.status(401).json({ status: false, error: "Auth failed" });
          else {
            //loginSuccess
            const role = user.role;
            const payload = { username, role }; //user-role not secure in jwt but this for demo-purpose and quick development.
            const access_token = jwt.sign(payload, req.app.get("api_secret_key"), {
            expiresIn: 36000,
            });
            res.json({ status: true, access_token, token_type:'default', expires: 7200 }); //120minutes
          }
        });
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
  res.json({ status: true, server: "Up and Running", data: "Welcome to the HCISS Rest Api @admin" });
});

module.exports = router;
