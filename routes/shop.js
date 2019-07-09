var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:"orphan"
  });
  var shop_list;
  var product_chunks= [];
  var chunksize=3;
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    
  });

  con.query(
      'SELECT * FROM shop_item',
      function(err,rows){
          if (err) throw err;
         
          if(rows.length > 0)
          {
            shop_list=rows;
            for(var i=0;i< shop_list.length; i+= chunksize)
            {
              product_chunks.push(shop_list.slice(i, i+chunksize))
            }

            
          }
          else
          {
              shop_list=null;
          }
          console.log(shop_list);
      }
  );
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('shop', { title: 'donor', shop_list: product_chunks});
});

module.exports = router;