module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {

            dist: {
                options: {
                    email: 'grzegorz.przydryga@gmail.com',
                    password: '',
                    branch: 'default',
                    ptr: false
                },
                src: ['src/*.js']
            },

            sim: {
                options: {
                    email: 'grzegorz.przydryga@gmail.com',
                    password: '',
                    branch: 'sim',
                    ptr: false
                },
                src: ['src/*.js']
            }
        },
    });
}