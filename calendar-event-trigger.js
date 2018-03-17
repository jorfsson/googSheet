function calendarTrigger(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('US Build Notes');
  var dateSheet = sheet.getRange('A2').getValue();
  var date = dateSheet.trim();
  var today = new Date();
  var todayMin = today.getMinutes();
  var todayHr = today.getHours();

  var events = CalendarApp.getCalendarById('jeffreychea234@gmail.com').getEventsForDay(today);
  for (var i=0;i<events.length;i++) {
    var eventStart = events[i].getStartTime();
    var eventStartMin = eventStart.getMinutes();
    var eventStartHr = eventStart.getHours();

    var eventName = events[i].getTitle().split(' ');
    var nameLengthCheck = eventName[0].length;
    if ((nameLengthCheck == 8)) {
      var bnName = eventName[0];
    } else {
     Logger.log("Event Title is causing an error.");
    }
    Logger.log(date);
    Logger.log(bnName);
    if ((bnName == date) && (todayHr == eventStartHr) && ((Math.abs(todayMin - eventStartMin) <= 5) && (Math.abs(todayMin - eventStartMin) >= -5))) {
      reportEmailer();
      reportEmailer_CDA();
    }
  }
} 
