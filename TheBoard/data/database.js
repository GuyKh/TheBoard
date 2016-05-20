// database.js

(function (database) {
    var mongodb = require('mongodb');
    var mongoUrl = "mongodb://localhost:27017/theBoard";    //The db "connection string" (built in the 1st run)
    var theDb = null;  // To construct it only when needed (pass back for anyone else who needs it)

    database.getDb = function(next) {
        if (!theDb) {
            // connect the db
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                if (err) {
                    next(err, null);
                } else {
                    // Shawn recommends that we wrap the db in an object so we can extend it easily later.
                    theDb = {
                        db: db,
                        notes: db.collection('notes'),
                        users: db.collection('users')
                    };
                    next(null, theDb);
                }
            });
        } else {
            next(null, theDb); // return the DB
        }
    }

})(module.exports);