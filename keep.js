
var mongoHost = process.env.MONGODB_HOST || 'localhost',
    mongoPort = process.env.MONGODB_PORT || '27017',
    mongoCfg = 'mongodb://' + mongoHost + ':' + mongoPort + '/agenda-test';

var Agenda = require('agenda');
var agenda = new Agenda();
var agenda = new Agenda({db: { address: 'localhost:27017/agenda-test', collection: 'agendaJobs' }});

var MongoClient = require('mongodb').MongoClient;
var mongo = null;
var agendaJobs = null;
var agendaDir = null;

function dbClose() {
  mongo.close();
}

agenda.define('execute jobs', function(job) {
  console.log('execute jobs')
});

agenda.on('ready', function() {
  agenda.every('10 seconds', 'execute jobs');
  agenda.start();
});


