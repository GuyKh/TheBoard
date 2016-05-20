// auth/index.js
(function(auth) {
    var data = require('../data');
    var hasher = require('./hasher');

    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;

    function userVerify(username, password, next) {
        data.getUser(username,
            function(err, user) {
                if (!err && user) {
                    var testHash = hasher.computeHash(password, user.salt);
                    if (testHash === user.passwordHash) {
                        next(null, user);
                        return;
                    }
                } else { // In Fail case
                    next(null, false, { message: "Invalid Credentials" });
                } 
            });
    };


    auth.ensureAuthenticated = function(req, res, next) {
        // Check if authenticated

        if (req.isAuthenticated()) { // a method that's added to the request by Passport
            next();
        } else {
            res.redirect("/login");
        }
    };


    auth.ensureApiAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) { // a method that's added to the request by Passport
            next();
        } else {
            res.send(401, "Not Authorized");
        }
    };

    auth.init = function (app) {

        // Setup Passport Authentication
        passport.use(new localStrategy(userVerify));
        passport.serializeUser(function (user, next) {   //Passport needs to know how to store a user
            next(null, user.username);  //our key
        });
        passport.deserializeUser(function (key, next) {   //Passport needs to know how to store a user
            data.getUser(key, function (err, user) {
                    if (err) {
                        next(null, false, { message: "Failed to retrieve user"});
                    } else {
                        next(null, user);
                    }
            });
        });
        app.use(passport.initialize()); //Tell the app to use passport
        app.use(passport.session());    //Tell the session to store the user


        app.get("/login",
            function(req, res) {
                res.render('login', { title: "Login to  The Board", message: req.flash("loginError") });
            });

        app.post("/login", function(req, res, next) {
                //next to hold if login was successfull.

            var authFunction = passport
                .authenticate('local', //specifying the authentication type. "local" = username-password
                    function(err, user, info) {
                        if (err) {
                            next(err);
                        } else {
                            req.logIn(user,
                                function(err) {
                                    if (err) {
                                        next(err);
                                    } else
                                        //if the login was successfully done, redirect to home
                                        res.redirect("/");
                                });
                        }
                });

            authFunction(req, res, next);   // This is where the authentication happens
        });

        app.get("/register",
            function(req, res) {
                res.render("register", { title: "Register The Board", message: req.flash("registrationError") });
            });

        app.post("/register",
            function (req, res) {

                var salt = hasher.createSalt();

                var user = {
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    passwordHash: hasher.computeHash(req.body.password, salt),   // use hash, not password
                    salt: salt    //part of the encryption, be generated when storing to the database

                }

                data.addUser(user,
                    function(err) {
                        if (err) {
                            req.flash("Registration Error", "Could not save user to database");
                            res.redirect("/register");
                        } else {
                            res.redirect("/login");
                        }
                    });
            });
    };
})(module.exports);