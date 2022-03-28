const express = require("express");
const router = express.Router();
const axios = require("axios");
const rateLimit = require("express-rate-limit");

const CPLimiter = rateLimit({
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

router.all("*", CPLimiter, (req, res, next) => {
  let params = req.params.params;
 
  let url = req.originalUrl.replace('/api/','');

  axios({
    url: "https://rest.coinapi.io/" + url,
    method: "GET",
    params: {
      apikey: "F01A3C34-19E3-4764-92DD-1FC5889BA3F0",
    },
  })
    .then((response, error) => {
      if (response.status === 200) {
        return res.json(response.data);
      } else {
        return res
          .status(response.status)
          .json({ status: false, error: error });
      }
    })
    .catch(function (error) {
      if (error.response) {
        console.log(error.response);
        console.log(error.response.status);
        return res
          .status(error.response.status)
          .json({ status: false, error: error });
      }
    });
});
 
module.exports = router;
