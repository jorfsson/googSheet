function lagProduct() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var namedRangeList = sheet.getNamedRanges();
  var globalObjekt = {};
  var STATUS_MSG = {
    BNQA: "BN QA Complete",
    notReady: "Not Ready for WCD",
    ready: "Ready for WCD",
    needContact: "Pleaser Contact WCD",
    QAReady: "Ready for QA Review",
    promoApproved: "Promo Marketing Approved",
    wipQA: "WIP QA Complete",
    approved: "Approved QA Complete"
  }
  var STATUS_MSG_ARRAY = [
    STATUS_MSG.BNQA,
    STATUS_MSG.notReady,
    STATUS_MSG.ready,
    STATUS_MSG.needContact,
    STATUS_MSG.QAReady,
    STATUS_MSG.promoApproved,
    STATUS_MSG.wipQA,
    STATUS_MSG.approved,
  ];

  function createStatusProp(range, row){
    var currentRange = globalObjekt[range];

    var currentState = row[4];
    var contentItemName = row[5];

    if ((currentState !== STATUS_MSG.approved) && (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)){
       currentRange[contentItemName] = currentState;
    }
  }

  namedRangeList.forEach(function(namedRange){
    var rangeName = namedRange.getName();
    globalObjekt[rangeName] = {};

    try {
     var dataRange = namedRange.getRange().getValues();
     dataRange.forEach(function(row) {
       createStatusProp(rangeName, row);
     });

    } catch (err) {
     Logger.log(err);
   };
  });

  Logger.log(globalObjekt)
}
