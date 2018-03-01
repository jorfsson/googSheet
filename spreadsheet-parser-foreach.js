function logProductInfo() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
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


  // namedRangeList {array} - delcares an array of all the named ranges in the spreadsheet
  // >[NamedRange, NamedRange, NamedRange...]
  var namedRangeList = sheet.getNamedRanges();

  namedRangeList.forEach(function(namedRange){
  //for (var i = 0; i < namedRangeList.length - 1; i++) {

     //var range = namedRangeList[i];
     //var range = namedRange.getRange();
     var rangeName = namedRange.getName();

     // datarange {Object[][]} - declares a variable for a rectangular object containing all values
       // within object range (which has an object type of range, unique to Google Sheets Script)
     // datarange is now an instance that can have range class methods used on it

    try {
     var dataRange = namedRange.getRange().getValues();

     for (var a = 0; a < dataRange.length; a++) {
       var status = dataRange[a];

       if (!!(status[4] == STATUS_MSG.approved)) {
         Logger.log("Division Page: " + rangeName + "\n Current Status is set to: " + status[4] + "\nContent Name: " + status[5]);
       }
     }
   } catch (err) {
     Logger.log(err);
   }
  });
}
