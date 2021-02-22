const express = require("express");
const tryCatch = require("../middlewares/tryCatchMiddleware");

module.exports = ({ users }) => {
  const router = express.Router(); // eslint-disable-line new-cap

  router.post(
    "/login",
    tryCatch(async (req, res) => {
      const { username, password } = req.body;
      const user = await users.authenticate(username, password);

      if (!user) res.sendStatus("404");

      const payload = users.structureUser(user);

      req.logIn(payload, () => res.json(payload));
    })
  );

  router.get(
    "/logout",
    tryCatch((req, res) => {
      req.logOut();
      req.session.destroy();
      return res.json({ loggedOut: true });
    })
  );

  router.get(
    "/current-session",
    tryCatch((req, res) => {
      if (req.user) {
        let { user } = req.session.passport;
        return res.json(user);
      }
      return res.end();
    })
  );

  return router;
};
