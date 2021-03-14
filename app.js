require('dotenv').config()

const express = require('express');
const bodyparser = require('body-parser');
var nunjucks = require('nunjucks');

const router = express.router();
const cookieparser = require('cookie-parser');
const csrf = require('csurf');
const csrfprotection = csrf();


const session = require('express-session');
const port = 3000;
const app = express();

//const passport = require('passport')
//const flash = require('connect-flash')

const config = require('./config');
//var localstrategy = require('passport').strategy;

var pg = require('pg')
  , sessions = require('express-session')
  , pgsession = require('connect-pg-simple')(session)
  
const { pool } = require('pg')
const isproduction = process.env.node_env === 'production'

const connectionstring = `postgresql://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}:${process.env.db_port}/${process.env.db_database}`

const pool = new pool({
  connectionstring: isproduction ? process.env.database_url : connectionstring,
  ssl: isproduction,
})

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))
app.use(cookieparser());

app.use(session({
	store:new pgsession({
		pg: pg,
		constring :`postgresql://${process.env.db_user}:${process.env.db_password}@${process.env.db_host}:${process.env.db_port}/${process.env.db_database}`,
		tablename: 'session'
	}),
  secret: 'mysupersecret', 
  resave: false, 
  saveuninitialized: false,

  cookie: { maxage: 180 * 60 * 1000 }

}));



nunjucks.configure( 'views', {
    autoescape: true,
    cache: false,
    express: app
});

app.set('view engine', 'html');

//app.use(flash());
//use passport for facebook, google login etc 
//app.use(passport.initialize());
//app.use(passport.session());

app.use(csrfprotection);

app.use(express.static('public'));

//passport
//views 


app.get('/basic-first-aid', function (req,res) {
		config.get120(function( err, result) {
				  res.render('product', { csrftoken: req.csrftoken(),'rows': result});
				 
		});
});


app.get('/first-aid-4sec', function (req,res) {
		config.get170(function( err, result) {
				  res.render('product', { csrftoken: req.csrftoken(),'rows': result});
		});
}); 

app.post('/basic-first-aid', function(req,res,next) {

	var num = req.body.sku;
	var qty = req.body.quantity;
	var sid = req.sessionid;
	
	//console.log(num, qty, sid)
	config.addcart(num, qty, sid)
	res.redirect('/cart');
});


app.get('/cart', function(req, res, next) {
	var sid = req.sessionid;
	
	config.getcart(sid)
	  res.render('cart', { title:'test title'});
});

app.post('/first-aid-4sec', function(req,res,next) {
	var num = req.body.sku;
	var qty = req.body.quantity;
	var sid = req.sessionid;
	//console.log(num, qty, sid)
	config.addcart(num, qty, sid)
	res.redirect('/cart');
});


app.get('/', function(req, res){
	
  config.listsku(function (err, driverresult){ 
       //you might want to do something is err is not null... 

	   var results2 = driverresult.filter(test => test.sku > 140);
	   var results1 = driverresult.filter(test => test.sku <= 140);	   
	   
       res.render('index', { 'products1': results1, 'products2':results2, });
//test to check for results 	  
	 console.log( results1, results2);
    });
});

// OATH to be implemented later 
// app.post('/', function(req,res,next) {
// 	res.redirect('/signup');
// });


// test to make sure product page works 

app.get('/product', function (req, res, next) {
    res.render('product.html', {csrfToken: req.csrfToken()});
});


app.post('/add-to-cart', function(req, res, next) {

    var cart = new Cart(req.session.cart ? req.session.cart : {});
	
	var num = req.params.id;
	var qty = req.params.qty;
	var sid = req.sessionID;
	
	console.log(num,sid)
	cart.add(num, sid)
});


app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
