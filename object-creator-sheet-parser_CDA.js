function reportEmailer_CDA() {

  //Email List
  var recipient = "jeffreychea234@gmail.com";

  //Spreadsheet - Sets the current spreadsheet to the active spreadsheet for this script.
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  //Sheet - Sets active sheet to US Build Notes. Returns class sheet, specific to Google Script
  //Note - CDA version is in separate file due to differences in cell placement.
  var sheet = ss.getSheetByName('CDA Build Notes');

  //String - Gets the URL for the spreadsheet
  var sheetURL = ss.getUrl();

  //Array - Grabs all named ranges, a special class type per Google Sheet's Script App API
  //Note - Named Ranges are established in the Build Note, and consist of a specified set of ranges that house each Division Page build.
  var namedRangeList = sheet.getNamedRanges();

  //String - Gets date from cell A2. Date needs to be in plain text in order to match typical naming conventions used by ONOL Production Team.
  var date = sheet.getRange('A2').getValue();

  //Array - Houses all Division Page objects that include names, tickets, and details
  var allDivisions = [];

  //Object - Contains all possible statuses within a build note.
  var STATUS_MSG = {
    bnQA: "BN QA Complete",
    readyEN: "CDA EN Ready for WCD",
    readyFR: "CDA FR Ready for WCD",
    needContact: "Please Contact WCD",
    QAReady: "Ready for QA Review",
    notReadyEN: "CDA EN Not Ready for WCD",
    notReadyFR: "CDA FR Not Ready for WCD",
    promoApproved: "Promo Marketing Approved",
    approved: "Approved QA Complete"
  }

  //Array - all properties from the STATUS_MSG for iteration purposes
  var STATUS_MSG_ARRAY = [
    STATUS_MSG.bnQA,
    STATUS_MSG.readyEN,
    STATUS_MSG.readyFR,
    STATUS_MSG.needContact,
    STATUS_MSG.QAReady,
    STATUS_MSG.notReadyEN,
    STATUS_MSG.notReadyFR,
    STATUS_MSG.promoApproved,
    STATUS_MSG.approved,
  ];

  //String - Body that contains CSS styling for email, including table styling, and email header
  //Body must be written as a collection of separated strings due to Google Script App formatting requirements
  var body =

    "<head><style>" +

    ".build__url { font-family: sans-serif; font-size: 12px;}" +
    ".build__category { font-family: sans-serif; margin-top: 40px; margin-bottom: -10px;}" +
    ".build__table { border: 1px; border-color: black; text-align: left; font-family: sans-serif;}" +
    ".build__header { line-height: 30px;}" +
    ".build__main_header { font-family: sans-serif; line-height: 30px;}" +
    ".build__ticket-row { height: 40px;}" +
    ".build__ticket-row-even { background-color: #e2edfb;}" +
    ".build_ticket-producer { text-align: center;}" +
    ".build_ticket-status-bnQA {  border-radius: 3px; text-align: center; background-color: #f9f0d7;}" +
    ".build_ticket-status-readyEN {  border-radius: 3px; text-align: center; background-color: #e29bff;}" +
    ".build_ticket-status-readyFR {  border-radius: 3px; text-align: center; background-color: #e29bff;}" +
    ".build_ticket-status-needContact {  border-radius: 3px; text-align: center; background-color: #ff00df;}" +
    ".build_ticket-status-QAReady {  border-radius: 3px; text-align: center; background-color: #e2f4dc;}" +
    ".build_ticket-status-notReadyEN {  border-radius: 3px; text-align: center; background-color: #ea6767;}" +
    ".build_ticket-status-notReadyFR {  border-radius: 3px; text-align: center; background-color: #ea6767;}" +
    ".build_ticket-status-promoApproved {  border-radius: 3px; text-align: center; background-color: #0effc7;}" +
    ".build_ticket-status-approved {  border-radius: 3px; text-align: center; background-color: #369ee8;}" +

    "</style></head><body height='80%'>" +

    "<h1 class='build__main-header'>" + date + " Build Note Report</h1>" + "<h2 class='build__url'>" + sheetURL + "</h2>";

  //If all statuses are set to Approved QA Completed
  var completedBody = "<body>All Division Pages have been Approved QA.</body>";


  //Function - Used for alphabetical sorting, attaches number value to names
  function compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
   }

  //Object - Returns an array of object property names
  var keyNames = Object.keys(STATUS_MSG);

  //Object - For each Named Range, will eventually return a completed object containing all completed information for each Named Range aka Division Page
  namedRangeList.forEach(function(namedRange){

    //Object - Hosts information for each DP (Division Page)
    var pageObject = {};

    //String - Grabs name of Named Range, special Google Script App method
    var tempName = namedRange.getName();

    var splitName = tempName.split('_');
    pageObject.name = splitName.join(' ');

    //Creates an empty array within pageObject that will house all tickets
    pageObject.tickets = [];

    //Try/Catch is used due to an error that can't be debugged.
    //Something in which the way the Build Note is built causes an error
    try {

     //Two-dimensional Array - Returns all values within the Named Range, by row and then column
     //getRange() is used on namedRange Object, which returns a Range Object
     //getValues() is then called on Range Object
     var dataRange = namedRange.getRange().getValues();
     var storedName = "";
     var storedState = "";
     dataRange.forEach(function(row) {

       var ticketObject = {};
       var currentState = row[5];
       var producer = row[10];


       //Name check for (NEW) in last 5 char spaces of names
       //Stores name and state for CDA FR checks
       var preName = row[6].trim();
       var currentName = "";
       if (!!(preName.slice(-5) === '(NEW)')) {
           storedName = preName;
           storedState = currentState;
           currentName = preName;
       }

       //Conditional statement that checks to see if currentState is not equal to "Approved QA Complete"
       //Also checks to make sure that currentState has an index that does not equal 0, to account for blank cells
       if ((currentState !== STATUS_MSG.approved) && (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)) {

         //shows CDA Fr status with blank name if CDA Eng is not approved, shows with name if approved
         if ((currentName == "") && (storedState == STATUS_MSG.approved)) {
          currentName = storedName;
         }

         ticketObject.name = currentName;
         ticketObject.status = currentState;
         ticketObject.producerName = producer;

         //Following for...in loop sets cssState to prop name for styling purposes
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

     //this checks to see if the pageObject has a ticket object with property name
     if (pageObject.tickets[0].name) {
      allDivisions.push(pageObject);
     }

    //Catches error, logs it using Google Logger
    } catch (err) {
     Logger.log(err);
    };
  });

  allDivisions.sort(compare);

  if (!!allDivisions) {
    allDivisions.forEach(function(item){

      body +=
        "<h3 class='build__category'>" + item.name + "</h3>" +
          "<table class='build__table' width='80%' cellpadding='10' cellspacing='0'>" +
            "<tr class='build__header-row'>" +
              "<th class='build__header' width='40%'>CAMPAIGN</th>" +
              "<th class='build__header' width='35%'>STATUS</th>" +
              "<th class='build__header' width='25%'>PRODUCER</th>" +
             "</tr>";

      //for each pageObject, grabs each ticketObject and index
      item['tickets'].forEach(function(campaign, index) {

        //Checks ticketObject index for CSS styling
        var isEven = (index % 2 == 0) ? 'even' : '';

        body += "<tr class='build__ticket-row-" + isEven + "'>" +
                  "<td class='build_ticket' width='40%'>" + campaign.name + "</td>" +
                  "<td class='build_ticket-status-" + campaign.cssState + "'>" + campaign.status + "</span></td>" +
                  "<td class='build_ticket-producer' width='25%'>" + campaign.producerName + "</td>" +
                "</tr>";
      });

      body += "</table></body>";

    });

    //Sends Build Note Report Email to specified email. Uses MailApp do to less authorization requirements.
    MailApp.sendEmail({
      to: recipient,
      subject: date + " Build Note Report",
      htmlBody: body,
    })
   } else {

    //Completed Build Note email
    MailApp.sendEmail({
      to: recipient,
      subject: date + " CDA Build Note Report",
      htmlBody: completedBody,
    })
  }
}
