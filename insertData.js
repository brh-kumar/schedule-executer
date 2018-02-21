db.companyJob.remove({});
var data = [{
  "name" : "Yugaya",
  "interval" : "15 Seconds",
  "param" : "fetch latest tweets",
  "status" : "NEW-JOB",
  "campId" : "123"
}, {
  "name" : "Appy",
  "interval" : "15 Seconds",
  "param" : "fetch latest tweets",
  "status" : "NEW-JOB",
  "campId" : "123"
}, {
  "name" : "Labs",
  "interval" : "15 Seconds",
  "param" : "fetch latest tweets",
  "status" : "NEW-JOB",
  "campId" : "123"
}, {
  "name" : "AtLeast",
  "interval" : "15 Seconds",
  "param" : "fetch latest tweets",
  "status" : "NEW-JOB",
  "campId" : "123"
}];

for(var i=0; i<data.length; i++) {
  var res = db.companyJob.insert(data[i]);
  printjson(res)
}