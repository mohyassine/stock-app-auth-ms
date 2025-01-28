const { SUCCESS } = require('../utils/server-codes');

function index(router) {
  router.get('/', (req, res) => {
    res.statusCode = SUCCESS;
    res.send('index');
    res.end();
  });

  return router;
}

module.exports = index;
