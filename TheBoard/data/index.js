(function (data) {
    var seedData = require("./seedData");

    var database = require('./database');

    data.getNoteCategories = function (next) {
        //return next(null /*No Exceptions*/, seedData.initialNotes);

        database.getDb(function(err, db) {
                if (err) {
                    next(err, null);
                } else {
                    db.notes.find( /*
                    {
                      name: "People"   // Just like .Where in LINQ
                    }*/

                        /*
                        {
                            $note: {notes: $size: 5}     // Only not 5 sized note groups
                        }
                    */
                    ).sort({
                        name: 1 // sort by name in ABC order
                    }).toArray(function(err, results) {
                        if (err) {
                            next(err, null);
                        } else {
                            next(null, results);
                        }
                    });
                }
            });
    };

    data.getNotes = function(categoryName, next) {
        database.getDb(function(err, db) {
                if (err) {
                    next(err, null);
                } else {
                    db.notes.findOne({ name: categoryName }, //Like FirstOrDefault,
                        next); // We have the same signature which we expect from the calling method
                }
            }
        );
    };

    data.addNote = function(categoryName, noteToInsert, next)
    {
        database.getDb(function(err, db) {
                if (err) {
                    next(err);
                } else {
                    // Update behaves here like an Insert
                    db.notes.update({ name: categoryName }, { $push: { notes: noteToInsert } }, next);
                }
            }
        );
    };

    data.addNewCategory = function (categoryName, next) {
        //return next(null /*No Exceptions*/, seedData.initialNotes);

        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {

                db.notes.find({ name: categoryName }).count(function(err, count) {

                    if (err) {
                        next(err);
                    } else {
                        if (count != 0) {
                            next("Category already exists");
                        } else {
                            // No existing category

                            var cat = {
                                name: categoryName,
                                notes: [] //need for count and sort
                            };

                            db.notes.insert(cat, function(err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
                });
            }
        });
    };

    data.addUser = function(user, next) {
        database.getDb(function(err, db) {
            if (err) {
                console.log("Failed to seed DB " + err);
            } else {
                db.users.insert(user,next);
            }
        });
    };

    data.getUser = function(username, next) {
        database.getDb(function(err, db) {
                if (err) {
                    next(err);
                } else {
                    db.users.findOne({ username: username }, next);
                }
            }
        );
    };

    function seedDatabase() {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to seed DB " + err);
            } else {
                // Test if data exists
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retrieve database count " + err);
                    } else {
                        if (count === 0) {
                            seedData.initialNotes.forEach( //* forEach dependent on ES but node supports it
                                function (item) {
                                    db.notes.insert(item, function (err) {
                                        if (err) console.log("Failed to insert note into database " + err);
                                    });
                                });
                        } else {
                            console.log("Database already seeded")
                        }
                    }
                });
            }
        });
    };

    seedDatabase();
})(module.exports);