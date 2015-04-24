
var RECIPE_PATH = RECIPES_PATH + '/cakephp2-core';
var TEMPLATES_PATH = RECIPE_PATH + '/templates';

var fs = require('fs-extra');
var async = require('async');
var burner = require(BASE_PATH + '/burner');

module.exports = {
        
    cook: function(config, json, callback) {
        
        console.log('[INFO] cakephp2-core()');
        
        async.series([
            function(callback) {
                // init recipe
                console.log('[DEBUG] initializing core...');
                init(json, callback);
            },
            function(callback) {
                // generate AppModel.php
                console.log('[DEBUG] generating AppModel...');
                burnAppModel(json, callback);
            },
            function(callback) {
                // generate each model
                console.log('[DEBUG] generating custom models...');
                async.each(json.models, burnModel, callback);
            }
        ], function(error, results) {
            return callback(error);
        });
        
    }
    
};

var init = function(json, callback) {
    async.parallel([
        function(callback) {
            fs.emptyDir(OUTPUT_PATH + '/Model', callback);
        },
        function(callback) {
            fs.emptyDir(OUTPUT_PATH + '/scripts', callback);
        }
    ], function(error, results) {
        callback(error);
    });
};

var burnAppModel = function(config, callback) {
    var input = TEMPLATES_PATH + '/AppModel.php';
    var output = OUTPUT_PATH + '/Model/AppModel.php';
    var params = {};
    burner.template(input, output, params, callback);
};

var burnModel = function(config, callback) {
    var input = TEMPLATES_PATH + '/Model.php';
    var output = OUTPUT_PATH + '/Model/' + config.name + '.php';
    var params = {
        Model: config.name,
        table: config.table
    };
    burner.template(input, output, params, callback);  
};