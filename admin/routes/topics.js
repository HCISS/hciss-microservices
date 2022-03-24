const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { Kafka } = require("kafkajs");

const TopicsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 1 create account requests per `window` (here, per hour)
  message: {
    status: false,
    message:
      "Too many conections by same IP, please follow-up x-limits and try again after an hour later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @api {post} /api/topics
 * @apiName Kafka Topics;
 * @apiPermission JWT Token
 * @apiGroup User
 *
 * @apiParam  {String} [token] token
 * @apiParam  {String} topic
 * @apiParam  {String} numPartitions  -> Default:1 /sub-pub
 *
 * @rateLimit 1 Hour Window (IP) / Request limit:10 / JWT 12 minutes
 *
 * @apiNote POST Benchmark is much better right now.
 * @apiSuccess (200) {Object} mixed Topics
 * @apiError (400) {Object} {status: false, message: message} //code:0 for I/O signals for demo purpose
 **/

router.post("/", TopicsLimiter, (req, res, next) => {
  if (req.body !== "") {
    let userid = req.decoded.username; //default parameters from JWT token. partial-stateless for demo purpose.
    let userRole = req.decoded.role;
    if (userRole !== "admin")
      return res.status(401).json({
        status: false,
        error: "You are not permitted to access this resource.",
      });

    const { client, broker, topic } = req.body;

    if (!topic) {
      next({
        status: false,
        error: "Invalid data. Please specify the topic name.",
      });
    }

    const numPartitions = 1; //fixed for pub-sub. Other stream might be paralel

    try {
      // Admin Stuff..
      const kafka = new Kafka({
        clientId: client,
        brokers: [broker], //one for now.
      });

      const admin = kafka.admin();
      console.log("Connection to Kafka Broker"); //close logs after dev.
      admin.connect();
      console.log("Kafka connected on port 9092");
      const create = admin.createTopics({
        topics: [
          {
            topic: topic,
            numPartitions: numPartitions,
          },
        ],
      });
      create.then((result) => {
        return res.json({ result });
      });
      //const end = admin.disconnect();
    } catch (error) {
      //console.log("Topic created error: ", error);
    }
  } else res.json({ status: false, message: "invalid or empty data" });
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
    data: "Welcome to the HCISS Rest Api @admin",
  });
});

module.exports = router;
