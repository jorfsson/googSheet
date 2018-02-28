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
  var i = 0;
  //for (var i = 0; i < namedRangeList.length - 1; i++) {

    // range {object} - declares a variable for a named range
     var range = namedRangeList[i];

     // rangeName {string} - returns the name of a selected range
     var rangeName = range.getName();

     // datarange {Object[][]} - declares a variable for a rectangular object containing all values
       // within object range (which has an object type of range, unique to Google Sheets Script)
     // datarange is now an instance that can have range class methods used on it
     var dataRange = range.getRange().getValues();

     for (var a = 0; a < dataRange.length; a++) {
       var status = dataRange[a];

       if (!!(status[4] == STATUS_MSG.ready)) {
         Logger.log(status[5] + " " + status[5]);
       }


     }
}
