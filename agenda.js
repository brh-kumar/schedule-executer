
 var request = require('request');
 var Agenda = require('agenda');
 var MongoClient = require('mongodb').MongoClient;
 var Winston = require('winston');
 var settings = require('../settings.json');

 var mongoHost = settings.agenda.host;
 var mongoPort = settings.agenda.port;
 var taskCln = settings.agenda.taskCollection;
 var dataFetchURL = settings.agenda.dataFetchURL;
 var agendaCfg = mongoHost + ':' + mongoPort + '/' + settings.agenda.database;
 var mongoCfg = 'mongodb://' + agendaCfg;
 var agendaCln = settings.agenda.collection;

 var agenda = new Agenda({db: { address: agendaCfg, collection: agendaCln }}),
   logger = new (Winston.Logger)({
     transports: [
       new (Winston.transports.Console)(),
       new (Winston.transports.File)({ filename: '../logs/schedulerLogs.log' })
     ]
   });

// Helper Functions
 var helperFunctions = {
   'companyJob': function (param) {

   },

   'default': function () {
     console.log('default helper function....');
   }
 };

// ##-Remove Agenda Jobs
// -- params: node, --returns: none
// -- removes all records from agendaJobs collection
 var removeAgendaJobs = function () {
   MongoClient.connect(mongoCfg, function (err, db) {
     db.collection('agendaJob').remove({}, function (err, res) {
       console.log(err, res.result);
     });
   });
 };

// ##-Find Company Jobs
// -- params: params {}, callback --returns: none
// -- triggers a find query along with specified arguments
// -- then iterates over each record and calls specified helper function for further operations.
 var findCompanyJobs = function (params, callback) {
   var db = params.db;
   var url = '';
   var cursor = db.collection(taskCln).find({status: {$in: ['NEW-TASK', 'COMPLETED']}});

   cursor.each(function (err, doc) {
     if (doc !== null) {
       url = dataFetchURL + doc.campId;
       console.log(url + ' @ ' + new Date().getSeconds());
       logger.log('info', 'Calling the server ' + url, {campId: doc.campId});
       request(url, function (error, response, body) {
         if (error) {
           logger.log('error', error, {campId: doc.campId});
         } else {
           logger.log('info', 'Successful call  ' + url, {campId: doc.campId});
         }

         console.log(error, body);
       });
       callback();
     } else {
       callback();
     }
   });
 };

// ##-BUG Agenda not running tasks upon restart (server restart)
// -- removing agenda jobs history from the collection
// -- so, agenda can start operation on server restart
 removeAgendaJobs();

 agenda.define('execute jobs', function (job, done) {
   console.log('executing jobs...');

   MongoClient.connect(mongoCfg, function (error, db) {
     var params = {
       db: db,
       hF: 'updateCompanyTask',
       sts: 'Processing'
     };

     findCompanyJobs(params, function () {
       db.close();
       done();
     });
   });
 });

 agenda.define('test', function (job, done) {
   console.log('Start test...');
   console.log(new Date().getSeconds());
   setTimeout(function () {
     console.log('done');
     console.log(new Date().getSeconds());
     done();
   }, 10000);
 });

 agenda.on('ready', function () {
   agenda.every('1 hours', 'execute jobs');
   agenda.start();
 });
