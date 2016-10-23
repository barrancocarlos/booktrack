// set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
   

    // configuration =================

    mongoose.connect('mongodb://localhost/booktrack');     // connect to mongoDB database 
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'db not connected...'));
    db.once('open', function callback() {
        console.log('(booktrack) db opened');
    });


    app.use(express.static(__dirname + '/public'));                 // set the static files location 
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());


    // define model =================
    var bookSchema = mongoose.Schema({
        title: String,
        author: String,
        
        updated: {
            type: Date
        },
        created: {
            type: Date,
            default: Date.now
        }
    });

    var Book = mongoose.model('Book', bookSchema);

    // routes ======================================================================

    // api ---------------------------------------------------------------------
    // get all books
    app.get('/api', function(req, res, next) {
       Book.find().exec(function(err, data) {
          if(err) {
             return next(err);
          }
          res.json(data);
       });
    });

    // add book
    app.post('/api', function(req, res, next) {
    var book = new Book({
        title: req.body.title,
        author: req.body.author,
        
    });
    book.save(function(err, data) {
        if(err) {
            return next(err);
        }
        res.status(201).json(data);
    });
    });

    // get one book

    app.get('/api/:id', function(req, res) {
    Book.findById(req.params.id, function(err, data){
        res.json(data);
    });
    });

    //delete book

        app.delete('/api/:book_id', function(req, res) {
        Book.remove({
            _id : req.params.book_id
        }, function(err, book) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Book.find(function(err, books) {
                if (err)
                    res.send(err)
                res.json(books);
            });
        });
    });



    //frontend application -------------------------------------------------------------
    app.get('*', function(req, res) {
        res.sendFile('public/index.html' , { root : __dirname}); // load the single view file (angular will handle the page changes on the front-end), the "*" allows refresh page
    });

    // listen (start app with node server.js) ======================================
    app.listen(8080);
    console.log("App listening on port 8080");
