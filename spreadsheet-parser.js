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

  for (var i = 0; i < data.length; i++) {
    var status = data[i];

    if (!!(status[4] == STATUS_MSG.ready)) {
    Logger.log(status[4] + " " + status[5]);

    }
  }
}
