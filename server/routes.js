var helpers = require('./routeHelpers');

module.exports.router = function(app) {

  app.get('/api/userdata', helpers.sendUserData);

  app.get('/api/leveldata', helpers.sendLevelData);

  app.post('/api/advancelevel', helpers.advanceLevel);

  // app.get('/api/nextleveldata', helpers.sendNextLevelData);

  app.post('/api/updateUserLevel', helpers.updateUserLevel);
};
