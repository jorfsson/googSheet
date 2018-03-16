function reportEmailer() {

  //Spreadsheet - Sets the current spreadsheet to the active spreadsheet for this script.
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  //Sheet - Sets active sheet to US Build Notes. Returns class sheet, specific to Google Script
  //Note - CDA version is in separate file due to differences in cell placement.
  var sheet = ss.getSheetByName('US Build Notes');

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
  //An object is used to contain string information that is easily accessible.
  var STATUS_MSG = {
    bnQA: "BN QA Complete",
    ready: "Ready for WCD",
    needContact: "Please Contact WCD",
    QAReady: "Ready for QA Review",
    notReady: "Not Ready for WCD",
    promoApproved: "Promo Marketing Approved",
    approved: "Approved QA Complete"
  }

  //Array - all properties from the STATUS_MSG object.
  //An array is used to more easily cycle through each property, per web development industry standards.
  var STATUS_MSG_ARRAY = [
    STATUS_MSG.bnQA,
    STATUS_MSG.ready,
    STATUS_MSG.needContact,
    STATUS_MSG.QAReady,
    STATUS_MSG.notReady,
    STATUS_MSG.promoApproved,
    STATUS_MSG.approved,
  ];

  //String - Body that contains CSS styling for email, including table styling, and email header
  //Body must be written as a collection of separated strings due to Google Script App formatting requirements
  var body =

    "<head><style>" +

    ".build__url { font-family: sans-serif; font-size: 12px;}" +
    ".build__category { font-family: sans-serif; margin-top: 40px; margin-bottom: -10px;}" +
    ".build__table { border: 0; text-align: left; font-family: sans-serif;}" +
    ".build__header { line-height: 30px;}" +
    ".build__ticket-row { height: 30px;}" +
    ".build__ticket-row.even { background-color: #e2edfb;}" +

    ".build_ticket-status { padding: 5px 8px; border-radius: 3px; }" +
    ".build_ticket-status-bnQA { background-color: #f9f0d7;}" +
    ".build_ticket-status-ready { background-color: #e29bff;}" +
    ".build_ticket-status-needContact { background-color: #ff00df;}" +
    ".build_ticket-status-QAReady { background-color: #e2f4dc;}" +
    ".build_ticket-status-notReady { background-color: #ea6767;}" +
    ".build_ticket-status-promoApproved { background-color: #0effc7;}" +
    ".build_ticket-status-approved { background-color: #369ee8;}" +

    "</style></head><body height='80%'>" +

    "<h1 class='build__main-header'>" + date + " Build Note Report</h1>" + "<h2 class='build__url'>" + sheetURL + "</h2>";

  //Function - Creates a function that will later be used to sort Division Page objects in alphabetical order.
  function compare(a,b) {
    if (a.name < b.name)
      return -1;
    if (a.name > b.name)
      return 1;
    return 0;
   }

  //Object - Returns an array of object property names. Essential for specifying status classes for CSS
  var keyNames = Object.keys(STATUS_MSG);

  //Object - For each Named Range, will eventually return a completed object containing all completed information for each Named Range aka Division Page
  namedRangeList.forEach(function(namedRange){

    //Object - Creates an empty object named pageObject. All information will be set as properties of this object.
    var pageObject = {};

    //String - Grabs name of Named Range, special Google Script App method
    var tempName = namedRange.getName();

    //Array - Splits if underscore exists
    var splitName = tempName.split('_');

    //Property - Rejoins split name and sets property
    pageObject.name = splitName.join(' ');

    //Creates an empty array within pageObject that will house all tickets
    pageObject.tickets = [];

    //Try/Catch is used due to an error that can't be debugged.
    //Something in which the way the Build Note is built causes an error
    try {

     //Two-dimensional Array - Returns all values within the Named Range.
     //getRange() is used on namedRange Object, which returns a Range Object
     //getValues() is then called on Range Object
     var dataRange = namedRange.getRange().getValues();

     //forEach is called on two-dimensional array, which operates in a row, followed by column hierarchy
     dataRange.forEach(function(row) {

       //Creates empty ticketObject that will store all properties
       var ticketObject = {};

       //String - sets currentState to string in row[4], which houses all statuses in the Build Note
       var currentState = row[4];

       //String - sets currentName to string in row[5], which houses all campaign names in the Build Note
       var currentName = row[5];

       //String - sets producer to string in row[9], which houses all producer names in the Build Note
       var producer = row[9];

       //Conditional statement that checks to see if currentState is not equal to "Approved QA Complete"
       //Also checks to make sure that currentState has an index that does not equal 0, to account for blank cells
       if ((currentState !== STATUS_MSG.approved) && (STATUS_MSG_ARRAY.indexOf(currentState) >= 0)) {

         //Sets properties for ticketObject
         ticketObject.name = currentName;
         ticketObject.status = currentState;
         ticketObject.producerName = producer;

         //Property - sets cssState property by using for...in to grab STATUS_MSG property name
         for (var i in STATUS_MSG) {

           //Cycles through keyNames array
           keyNames.forEach(function(name){

             //If condition - if keyNames element is equal to i from STATUS_MSG, and STATUS_MSG[i] is equal to current state
             if ((i == name) && (STATUS_MSG[i] == currentState)){
               ticketObject.cssState = name;
             }
           });
         }

         //Pushes ticketObject in to pageObject 'tickets' array
         pageObject['tickets'].push(ticketObject);

       }
     });

     //this checks to see if the pageObject has a ticket object with property name
     //Pushes to allDivisions object if it does. Prevents Build Note from having empty pageObjects
     if (pageObject.tickets[0].name) {
      allDivisions.push(pageObject);
     }
    //Catches error, logs it using Google Logger
    } catch (err) {
     Logger.log(err);
    };
  });

  //Orders allDivisions by sorting based on number values provided by compare function
  allDivisions.sort(compare);

  //Adds to body with all relevant information for each pageObject in allDivisions array
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

      body += "<tr class='build__ticket-row " + isEven + "'>" +
                "<td class='build_ticket' width='40%'>" + campaign.name + "</td>" +
                "<td width='35%'> <span class='build_ticket-status build_ticket-status-" + campaign.cssState + "'>" + campaign.status + "</span></td>" +
                "<td class='build_ticket' width='25%'>" + campaign.producerName + "</td>" +
              "</tr>";
    });

    body += "</table></body>";

  });

  //Sends Build Note Report Email to specified email. Uses MailApp do to less authorization requirements.
  MailApp.sendEmail({
    to: "jeffrey_chea@gap.com",
    subject: date + " Build Note Report",
    htmlBody: body,
  })
}
