
var fs = require('fs-extra');
var async = require('async');
var burner = require(__base + '/burner');

var outputPath = './output';
var templatesPath = __base + '/recipes/cakephp2-core/templates';

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
            fs.emptyDir(outputPath + '/Model', callback);
        },
        function(callback) {
            fs.emptyDir(outputPath + '/scripts', callback);
        }
    ], function(error, results) {
        callback(error);
    });
};

var burnAppModel = function(config, callback) {
    var input = templatesPath + '/AppModel.php';
    var output = outputPath + '/Model/AppModel.php';
    var params = {};
    burner.template(input, output, params, callback);
};

var burnModel = function(config, callback) {
    var input = templatesPath + '/Model.php';
    var output = outputPath + '/Model/' + config.name + '.php';
    var params = {
        Model: config.name,
        table: config.table
    };
    burner.template(input, output, params, callback);  
};