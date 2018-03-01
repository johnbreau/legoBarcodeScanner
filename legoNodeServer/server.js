// Set up
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var Schema = mongoose.Schema;
 
mongoose.connect('mongodb://johnbreau:monlab71X@ds151508.mlab.com:51508/lego-barcode-scanner');
var Schema = mongoose.Schema;
var connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', function () {
//     connection.db.collection("sets", function(err, collection){
//         collection.find({}).toArray(function(err, data){
//             console.log(data); // it will print your collection data
//         })
//     });
// });

var Set = mongoose.model("Set", new Schema({}), "sets"); 

app.get('/api/collection', function(req, res) {
    connection.db.collection("sets", function(err, collection){
        collection.find({}).toArray(function(err, data){
            console.log(data);
        })
    });
}); 

app.listen(9000);
console.log("App listening on port 9000");


// mongoose.connect(mongoDb);
// app.use(morgan('dev'));                                         // log every request to the console
// app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
// app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
// app.use(cors());

// var setSchema = mongoose.model('Set',
//     new Schema({
//             setName: String,
//             setNumber: String,
//             setPieces: Number,
//             setYear: String,
//             setTheme: String,
//             setLocation: String,
//             barcodeValue: Number,
//         }),
//     'sets');

// // Get reviews
// app.get('/api/collection', function(req, res) {

//     console.log("fetching sets");

//     // use mongoose to get all reviews in the database
//     Set.find(function(err, reviews) {

//         // if there is an error retrieving, send the error. nothing after res.send(err) will execute
//         if (err)
//             res.send(err)

//         res.json(reviews); // return all reviews in JSON format
//     });
// });
 