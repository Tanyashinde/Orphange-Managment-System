var express = require('express');
var router = express.Router();
/*var mysql=require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"orphanage"
  });
  var donar;
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
  });

  con.query(
      'SELECT * FROM donor',
      function(err,rows){
          if (err) throw err;
         
          if(rows.length > 0)
          {
            donor=rows;
          }
          else
          {
              donor=null;
          }
          console.log(donor);
      }
  );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('don_list', { title: 'Hello There!!',donor: donor });
});

module.exports = router;