//gruntfile.js
module.exports = function(grunt) {
    grunt.initConfig({
        nodemon: {
            all: {
                script: 'server.js',
                options: {
                    watchedExtentions: ['js']
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-nodemon");
    grunt.registerTask('default', ["nodemon"]);
};