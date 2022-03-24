const axios = require("axios");

module.exports = (req, res, next) => {
  let token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.headers.authorization;

  if (req.headers.authorization) {
    token = req.headers.authorization.split("Bearer ")[1];
  }

  if (token) {
    axios({
      url: "http://localhost:5001/api/user", //default api-gateway port. will change all these to env.policies
      method: "GET",
      params: { token: token },
      //headers: {},
    })
      .then((response, err) => {
        if (response.status === 200) {
          next();
        }
      })
      .catch(function (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          //console.log(error.response.headers);
          return res
            .status(400)
            .json({ status: false, error: error.response.data });
        }
      });
  } else {
    res.status(401).json({ status: false, error: "No token provided!" });
  }
};
