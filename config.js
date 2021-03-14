require('dotenv').config()

const express = require('express');


const { Pool } = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});


function listSku(callback) {    
        pool.query("SELECT * FROM firstaid",
            function (err, results) {
                //here we return the results of the query
                callback(err, results.rows); 
            }
        );    
}

function get120(callback){
	pool.query("select * from products where sku =120",
          function (err, results) {
                //here we return the results of the query
                callback(err, results.rows); 
            }
        );    
}


function get170(callback){
	pool.query("select * from products where sku =170",
          function (err, results) {
                //here we return the results of the query
			
                callback(err, results.rows); 
            }
        );    
}

function addcart(num,qty, sid, callback) {
    const put_query = {
  // give the query a unique name
    name: 'insert-cart',
    text: 'insert into cart1 (sku, quantity,sid) values ($1, $2, $3)',
    values: [num, qty, sid]
}
	pool.query(put_query,
          function (err, results) {
                //here we return the results of the query
			console.log(sid); 
            console.log( results.rows);				
            }
        );    
}

function getcart(sid, sku, callback ) {
	
    const get_query = {
    // give the query a unique name
    name: 'get-cart',
    text: 'select * from cart1 where sid =$1',
    values: [sid]
}

	pool.query(get_query,
          function (err, results) {
                //here we return the results of the query
			console.log(sid); 
            console.log( results.rows);
            }
        );    
}



module.exports = {
	listSku,
	get120,
	get170,
	getcart, 
	addcart, 
}
