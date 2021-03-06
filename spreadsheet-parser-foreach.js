function lagProduct() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var namedRangeList = sheet.getNamedRanges();
  var categoryArray = [];
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

 /*function createStatusProp(range, row){

    var currentState = row[4];
    var rowName = row[5];

    if ((currentState !== STATUS_MSG.approved) || (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)){
       range.name = rowName;
       range.status = currentState;

    }
  }*/

  namedRangeList.forEach(function(namedRange){

    var pageObject = {};
    pageObject.name = namedRange.getName();
    pageObject.tickets = [];
    var ticketObject = {};

    try {
     var dataRange = namedRange.getRange().getValues();
     dataRange.forEach(function(row) {
       var currentState = row[4];
       var currentName = row[5];

       if ((currentState !== STATUS_MSG.approved) && (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)) {
       ticketObject.name = currentName;
       ticketObject.status = currentState;
       }
     });
     pageObject['tickets'].push(ticketObject);
  if (pageObject.tickets[0].name) {
      categoryArray.push(pageObject);
  }
    } catch (err) {
     Logger.log(err);
   };

  });
Logger.log(categoryArray);
Logger.log(categoryArray[0].tickets);
}
