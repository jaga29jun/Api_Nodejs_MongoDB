var express = require('express');
var app = express();
const bodyParser = require('body-parser');
var moment = require('moment-timezone');


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database connected!");
  db.close();
});

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/',function(req,res){
	
});

app.get('/trades/users/:userID',function(req,res){
	
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  
		dbo.collection("trades").find({'user':{ $elemMatch :{'id':req.body.userID}}}).toArray(function(err, result) {
		if(err){ res.status(404).send('User Id doesnt exist'); return;}
			res.status(200).send(result);
			db.close();
		  });
	});
 res.status(200).send(JSON.stringify(req.params.userID));
});

app.get('/trades',function(req,res){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
		dbo.collection("trades").find({}).sort( { _id: 1 } ).toArray(function(err, result) {
		if (err) throw err;
		 res.status(200).send(result);
			db.close();
		  });
	});
});
app.get('/stocks/:stockSymbol/trades?queryString',function(req,res){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  
	  console.log(req.params.stockSymbol);
	  console.log(req.query.trades); return;
	  var dbo = db.db("mydb");
		dbo.collection("trades").find({}).sort( { _id: 1 } ).toArray(function(err, result) {
		if (err) throw err;
		
		
		 res.status(200).send(result);
			db.close();
		  });
	});
});
app.post('/trades', function(req,res){
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  var date = new Date(1458619200000);
	var myDatetimeString = moment(date).tz("America/Toronto").format("YYYY-MM-DD hh:mm:ss");
	  var record = {'_id':req.body.id,'type':req.body.type,'user':{'id':req.body.userid,'name':req.body.name},'symbol':req.body.symbol,'shares':req.body.shares,'price':req.body.price,'timestamp':myDatetimeString};
	  
		dbo.collection("trades").insertOne(record, function(err,data){
			if(err){ res.status(404).send('Same Id already exists'); return;}
		
			res.status(200).send('Record inserted successfully');
		});	
		db.close();
	});
});
app.delete('/erase', function(req,res){
	
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
		dbo.collection("trades").deleteMany({},function(err, result) {
		if (err) throw err;
			res.status(200).send('All Records deleted successfully');
			db.close();
		  });
	});
	
});

app.listen(3000, function(){
	console.log('Listening to 3000');
});
