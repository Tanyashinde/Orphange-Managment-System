var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('app_list', { 
      title: 'donor',
      app_list: app_list,
      hello: 'hello'
 });
});

module.exports = router;