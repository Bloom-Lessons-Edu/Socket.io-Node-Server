const router = require('express').Router();

router.get('/', (req, res) => {
    res.send("<h1>Welcome to ABC Realtime app, Server is online!</h1>");
});

module.exports = router;
