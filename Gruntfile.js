var screepsConfig = require('./screepsConfig');

module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {

            dist: {
                options: {
                    email: screepsConfig.login,
                    password: screepsConfig.password,
                    branch: 'default',
                    ptr: false
                },
                src: ['src/*.js']
            },

            sim: {
                options: {
                    email: screepsConfig.login,
                    password: screepsConfig.password,
                    branch: 'sim',
                    ptr: false
                },
                src: ['sim/*.js']
            }
        },
    });
}