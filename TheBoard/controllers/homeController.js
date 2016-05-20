(function(homeController) {
    var data = require("../data");
    var auth = require("../auth");

    homeController.init = function (app) {
        app.get("/", function (req, res) {
            data.getNoteCategories(function(err, results) {
                res.render("index", {
                    title: "The Board",
                    error: err,
                    categories: results,
                    newCatError: req.flash("newCatName"),
                    user: req.user
                });
            });
        });

        app.get("/notes/:categoryName",
            auth.ensureAuthenticated,   // call this first, and if it's next called, call the following function
            function(req, res) {
                var categoryName = req.params.categoryName;
                res.render("notes", {title : categoryName, user: req.user});
            });

        app.post("/newCategory", function(req, res) {
            var categoryName = req.body.categoryName;   //Get the body and the form encoded value (from the form)
            data.addNewCategory(categoryName, function(err) {
                if (err) {
                    // Handle Error
                    req.flash("newCatName", err);   // Store this information in session and remove in retrieval
                    console.log(err);
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + categoryName); //Open the notes page for a specific cateogry
                }
            });
        });
    }
})(module.exports);