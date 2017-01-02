require('rootpath')();
module.exports = function (app) {
  	app.use('/api', require('controller/api'));
};
