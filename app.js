var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require("express-handlebars");
var flash=require("connect-flash");


var indexRouter = require('./routes/index');
var about = require('./routes/about');
var app_list = require('./routes/app_list');
var donor = require('./routes/donor');
var thanks = require('./routes/thanks');
var appointment = require('./routes/appointment');
var admin_login = require('./routes/admin_login');
var admin_dashboard = require('./routes/admin_dashboard');
var login = require('./routes/login');
var profile = require('./routes/profile');
var signup = require('./routes/signup');
var shop=require('./routes/shop');
var cart=require('./routes/cart');


var mysql = require('mysql');
var bodyParser = require('body-parser');
var alert = require('alert-node');
var don_list=require('./routes/don_list');
var MySQLEvents = require('mysql-events');

//create Connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "orphan"
});
var currentuser = null;
var check_admin=null;
var cart_items=null;
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

});

var b = 11;
// hello world 2

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', '.hbs');
app.use(flash());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/about', about);
app.use("/app_list", app_list);
app.use('/donor', donor);
app.use('/thanks', thanks);
app.use('/appointment', appointment);
app.use('/admin_login', admin_login);
app.use('/admin_dashboard', admin_dashboard);
app.use('/login', login);
app.use('/signup', signup);
app.use('/don_list',don_list);
app.use('/shop',shop);
app.use('/cart',cart);



app.post('/myaction', function (req, res, next) {
  console.log(req.body.name);
  console.log(req.body.phone);
  console.log(req.body.email);
  console.log(req.body.address);
  console.log(req.body.amount);
  console.log("connected");
  var sql = "INSERT INTO `donor`(`name`,`phone`, `email`,`address`,`amount`) VALUES ('" + req.body.name + "','" + req.body.phone + "','" + req.body.email + "','" + req.body.address + "','" + req.body.amount + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    //console.log(currentuser);
  });
  res.render('thanks', { title: 'Express' });
});

app.post('/user_signup', function (req, res, next) {
  console.log(req.body.name);
  console.log(req.body.psw);
  console.log(req.body.cpsw);
  var name=req.body.name;
  if(req.body.psw==req.body.cpsw)
  {
    var sql = "INSERT INTO `users`(`name`,`password`,`address`) VALUES ('" + req.body.name + "','" + req.body.psw + "','" +req.body.address+"')";
    con.query(sql, function (err, results, fields) {
      if (err) throw err;
      console.log("successful signup");
    });
    res.render('profile', { title: 'Express', currentuser: name });
    currentuser = name;
  }
  else{
    //req.flash("error","password does not match");
    res.render('index',{title: express});
  }
 
});



app.post('/user_login', function (req, res, next) {
  console.log(req.body.name);
  console.log(req.body.psw);
  var name = req.body.name;
  var psw = req.body.psw;

  con.query('SELECT * FROM users WHERE name = ?', [name], function (error, results, fields) {
    if (error) {
      alert('error')
    }
    else {
      if (results.length > 0) {
        if (psw == results[0].password) {
          currentuser = name;
          res.render('profile', { title: 'Express', currentuser: name });

        } else {
          res.render('index', { title: 'Express' });
        }

      }
      else {
        res.render('index', { title: 'Express' });
      }
    }
  });
  //res.render('app_list', { title: 'Express' });

});

app.get('/restart', function (req, res, next) {
  process.exit(1);
});

app.post('/appointment', function (req, res, next) {
  if (currentuser == null) {
    res.render('login', { title: 'Express', message: 'please log in first' });
  }
  else {
    res.render('appointment', { title: 'Express', message: 'please log in first', currentuser: currentuser });
  }
});


app.post('/shop', function (req, res, next) {
  console.log(req.body.shop);
  if (currentuser == null) {
    res.render('login', { title: 'Express', message: 'please log in first' });
  }
  else {
    con.query('select * from shop_item where id = ?',[req.body.shop], function(err,results,fields) {
      if(err) throw err;
      //console.log(results[0].image);
      //var array=results;
      var sql = "INSERT INTO `cart_items`(`name`,`image`,`price`) VALUES ('"+ currentuser + "','" +results[0].image+"','"+results[0].price+"')";
      con.query(sql, function(err,result,fields){
          if(err) throw err;
      });
      });
      res.render('index',{title: express});
  }
});

app.post('/cart',function(req,res,next) {
  if(currentuser == null)
  {
    res.render('index',{title: express});
  }
  else
  {
    con.query('select * from cart_items where name= ?',[currentuser], function(err,results,fields) {
        if(err) throw err;
        var total=0;
        for(var i=0;i<results.length;i++)
        {
            total=total+ results[i].price;
        }
        console.log(total);
          res.render('cart',{title: express, items: results, total: total});
    });
  }
})
app.post('/approve',function(req,res,next) {
    console.log(req.body.name);
    var array= req.body.name;
    for(var i=0;i<array.length;i++)
    {
      console.log(array[i]);
      con.query('update appointment set approval="yes" WHERE name = ?', [array[i]], function (err, results, fields) {
      if(err) throw err;
        console.log("updated");
      //res.render('app_list', { title: 'Express'});
    });
  }
});

app.post('/profile', function (req, res, next) {
  if (currentuser == null) {
    res.render('login', { title: 'Express', message: 'please log in first' });
  }
  else {
    res.render('profile', { title: 'Express', currentuser: currentuser });
  }


});
app.post('/place_order',function(req,res,next) {
    total_price= req.body.price;
    con.query('select id from cart_items where name= ?',[currentuser],function(err,results,fields){
        if(err) throw err;
        var arr= [];
        for(var i=0;i< results.length;i++)
        {
          arr=arr+ results[i];
        }
        var sql = "INSERT INTO `orders`(`name`,`orders`,`total_price`) VALUES ('"+ currentuser + "','" +arr+"','"+total_price+"')";
          con.query(sql,function(err,result,feilds){
            if(err) throw err;
              con.query('delete from cart_items where name=?',[currentuser],function(err,res,feilds){
                if(err) throw err;
                  console.log("order placed..")
              });
          });
    });
    res.render('index',{title: express});
});
app.post('/delete_item',function(req,res,next){
  id=req.body.shop;
  con.query('delete from cart_items where id=?',[id],function(err,res,feilds){
    if(err) throw err;
      console.log("item deleted..")
  });
  res.render('index',{title: express});
});


app.post('/admin',function(req,res,next) {
  if(check_admin==null)
  {
    res.render('admin_login',{title: express});
  }
  else
  {
    res.render('admin_dashboard',{title: express});
  }
});

app.post('/admin_logout',function(req,res,next) {
  check_admin=null;
  res.render('index',{title: express});
});

app.post('/user_logout',function(req,res,next) {
  currentuser=null;
  res.render('index',{title: express});
});

app.post('/admin_login',function(req, res, next) {
  var admin = req.body.name;
  var password = req.body.psw;
  console.log(admin);
  console.log(password);
  if (admin == 'tanuja' && password=="tanuja") {
    res.render('admin_dashboard', { title: 'Express' });
    check_admin="tanuja";
  }
  else {
    res.render('index', { title: 'Express' });
  }

});
app.post('/don_list',function(req,res,next){
  con.query('select * from donor',function(err,results,feilds){
    if(err) throw err;
      res.render('don_list',{title: express ,donor: results});
  });
});

app.post('/app_list',function(req,res,next){
  con.query('select * from appointment',function(err,results,feilds){
    if(err) throw err;
      res.render('app_list',{title: express ,app_list: results});
  });
});

app.post('/visit', function (req, res, next) {
  console.log(req.body.name);
  console.log(req.body.phone);
  console.log(req.body.reason);
  console.log(req.body.date);
  console.log(req.body.time);
  console.log("connected");
  //var sql1="SELECT name from users as u INNER JOIN appointment as c on u.name=c.name";
  var sql = "INSERT INTO `appointment`(`name`,`phone`,`reason`,`date`) VALUES ('" + req.body.name + "','" + req.body.phone + "','" + req.body.reason + "','" + req.body.date + "')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("table");
  });
  res.render('index', { title: 'Express' });
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000, function(){
  console.log("started");
});
module.exports = app;
