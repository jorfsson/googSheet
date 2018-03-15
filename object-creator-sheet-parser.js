function lagProduct() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var namedRangeList = sheet.getNamedRanges();
  var currentDate = sheet.getRange('A2').getValue();

  var date = currentDate.toLocaleDateString();
  var body = "<head><style>" +
    ".build__category { font-family: sans-serif; margin-top: 40px; margin-bottom: -10px;}" +
    ".build__table { border: 0; text-align: left; font-family: sans-serif;}" +
    ".build__header { line-height: 30px;}" +
    ".build__ticket-row { height: 30px;}" +
    ".build__ticket-row.even { background-color: #e2edfb;}" +
    ".build_ticket-status-bnQA { border-radius: 3px; background-color: red;}" +
    ".build_ticket-status-notReady { border-radius: 3px; background-color: red;}" +
    ".build_ticket-status-QAReady { border-radius: 3px; background-color: red;}" +
    ".build_ticket-status-wipQA { border-radius: 3px; background-color: red;}" +
         "</style></head><body height='80%'>" +
      "<h1 class='build__main-header'>" + date + " Build Note Report</h1>";

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
    needContact: "Please Contact WCD",
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
  var keyNames = Object.keys(STATUS_MSG);

  namedRangeList.forEach(function(namedRange){

    var pageObject = {};
    pageObject.name = namedRange.getName();
    var splitNames = pageObject.name.split('_');
    pageObject.newName = splitNames.join(' ');

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
         for (var i in STATUS_MSG) {
           keyNames.forEach(function(name){
           if ((i == name) && (STATUS_MSG[i] == currentState)){
             ticketObject.cssState = name;
           }
           });
         }

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

    body +=
      "<h2 class='build__category'>" + item.newName + "</h2>" +
        "<table class='build__table' width='80%' cellpadding='10' cellspacing='0'>" +
          "<tr class='build__header-row'>" +
            "<th class='build__header' width='40%'>CAMPAIGN</th>" +
            "<th class='build__header' width='35%'>STATUS</th>" +
            "<th class='build__header' width='25%'>PRODUCER</th>" +
           "</tr>";

    item['tickets'].forEach(function(campaign, index) {
    var isEven = (index % 2 == 0) ? 'even' : '';

      body += "<tr class='build__ticket-row " + isEven + "'>" +
                "<td class='build_ticket' width='40%'>" + campaign.name + "</td>" +
                "<td class='build_ticket-status-" + campaign.cssState + "' width='35%'>" + campaign.status + "</td>" +
                "<td class='build_ticket' width='25%'>" + campaign.producerName + "</td>" +
              "</tr>";
    });

    body += "</table></body>";

  });

  MailApp.sendEmail({
    to: "jeffreychea234@gmail.com",
    subject: "Build Note Report",
    htmlBody: body,
  })
}
