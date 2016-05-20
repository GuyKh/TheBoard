// auth/hasher.js

(function(hasher) {
    var crypto = require("crypto"); //Native NodeJS library

    hasher.createSalt = function () {
        var len = 8;
        return crypto.randomBytes(Math.ceil(len / 2)). //4 Bytes
            toString('hex').substring(0, len);
    };

    hasher.computeHash = function(source, salt) {
        var hmac = crypto.createHmac("sha1", salt); //Define the algorithm
        var hash = hmac.update(source); //Generate the hash
        return hash.digest("hex");  // The hash in the DB
    };
} )(module.exports);