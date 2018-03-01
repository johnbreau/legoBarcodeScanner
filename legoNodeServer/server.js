var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
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