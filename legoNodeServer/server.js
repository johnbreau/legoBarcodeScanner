var express  = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var sets = require('./routes/sets');
var app = express();
var port = 9000;

//View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//Set Static Folder
app.use(express.static(path.join(__dirname, 'client')));


//body parser MW
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use('/', index);
app.use('/api', sets);

app.listen(port, function(){
    console.log('server listening on port ' +port);
});


// var mongoose = require('mongoose');
// const bodyParser= require('body-parser')
// var Schema = mongoose.Schema;
 
// mongoose.connect('mongodb://johnbreau:monlab71X@ds151508.mlab.com:51508/lego-barcode-scanner');
// var Schema = mongoose.Schema;
// var connection = mongoose.connection;

// var setSchema = new Schema({
//     setName: String,
//     setNumber: String,
//     setPieces: Number,
//     setYear: String,
//     setTheme: String,
//     setLocation: String,
// });

// var Set = mongoose.model('Set', setSchema);

// connection.on('error', console.error.bind(console, 'connection error:'));
// connection.once('open', function () {
//     connection.db.collection("sets", function(err, collection){
//         collection.find({}).toArray(function(err, data){
//             console.log(data); // it will print your collection data
//         })
//     });
// });

// app.use(bodyParser.urlencoded({extended: true}))

// app.get('/get-collection', function(req, res) {
//     connection.db.collection("sets", function(err, collection){
//         collection.find({}).toArray(function(err, data){
//             console.log(data);
//         })
//     });
// }); 

// app.post('/add-set', (req, res) => {
//     console.log(req.body);
// });

// app.listen(9000);
// console.log("App listening on port 9000");