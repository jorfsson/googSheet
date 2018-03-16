function lagProduct() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var namedRangeList = sheet.getNamedRanges();
  var body

  function compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
  }

  var allCategories = [];
  var STATUS_MSG = {
    bnQA: "BN QA Complete",
    notReady: "Not Ready for WCD",
    ready: "Ready for WCD",
    needContact: "Pleaser Contact WCD",
    QAReady: "Ready for QA Review",
    promoApproved: "Promo Marketing Approved",
    wipQA: "WIP QA Complete",
    approved: "Approved QA Complete"
  }
  var STATUS_MSG_ARRAY = [
    STATUS_MSG.bnQA,
    STATUS_MSG.notReady,
    STATUS_MSG.ready,
    STATUS_MSG.needContact,
    STATUS_MSG.QAReady,
    STATUS_MSG.promoApproved,
    STATUS_MSG.wipQA,
    STATUS_MSG.approved,
  ];

  namedRangeList.forEach(function(namedRange){

    var pageObject = {};
    pageObject.name = namedRange.getName();
    pageObject.tickets = [];


    try {
     var dataRange = namedRange.getRange().getValues();
     dataRange.forEach(function(row) {
       var ticketObject = {};
       var currentState = row[4];
       var currentName = row[5];
       var producer = row[9];

       if ((currentState !== STATUS_MSG.approved) && (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)) {
         ticketObject.name = currentName;
         ticketObject.status = currentState;
         ticketObject.producerName = producer;
         pageObject['tickets'].push(ticketObject);

       }
     });

  if (pageObject.tickets[0].name) {
      allCategories.push(pageObject);
  }
    } catch (err) {
     Logger.log(err);
   };
  });

allCategories.sort(compare);
allCategories.forEach(function(item){
  body += "<p>" + item.name + "</p><table width=\"600\" cellpadding=\"0\" cellspacing=\"0\" border=\"1\"><tr><th>Campaign</th><th>Status</th><th>Producer</th></tr>";

  item['tickets'].forEach(function(campaign) {
    body += "<tr><td>" + campaign.name + "</td><td>" + campaign.status + "</td><td>" + campaign.producerName + "</td></tr>";
  });

  body += "</table>";
});
Logger.log(allCategories);

MailApp.sendEmail({
  to: "jeffrey_chea@gap.com",
  subject: "Build Note Report",

  htmlBody: body,

})
}
