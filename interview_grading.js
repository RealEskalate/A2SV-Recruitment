function onFormSubmit(e) {

    var columnMapping = {sourceColumns: [3, 4, 7, 8, 10, 13, 15, 16], targetColumns: [1, 2, 3, 4, 5, 6, 7, 8]};
  
    // List of target sheets
    var sheets = ['Biruk', 'Bahailu', 'Yonas', 'Fikreselassie', 'Gizaw']; // adjust the names of the graders based on the actual names in your Google Sheet tabs
    
    // Get the active spreadsheet and the submissions sheet
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var submissionSheet = ss.getSheetByName('Submissions');
    
    // Get the range of the newly added row
    var newRow = e.range.getRow();
    var numColumns = submissionSheet.getLastColumn();
    var newData = submissionSheet.getRange(newRow, 1, 1, numColumns).getValues()[0];
  
    var range = submissionSheet.getDataRange();
    var values = range.getValues();
    var uniqueId = newData[0];
  
    // Find the row with the same unique identifier
    for (var i = 1; i < values.length; i++) { 
      if (values[i][0] === uniqueId) {
        return;
      }
    }
  
    // Determine which sheet to send the new data to
    var currentCount = submissionSheet.getLastRow() - 1; // -1 to ignore the header row
    var targetSheetIndex = (currentCount - 1) % sheets.length; // Zero-based index
    
    // Get the target sheet
    var targetSheet = ss.getSheetByName(sheets[targetSheetIndex]);
  
    var mappedData = [];
    
    for (var j = 0; j < columnMapping.targetColumns.length; j++) {
      var sourceCol = columnMapping.sourceColumns[j] - 1;
      var targetCol = columnMapping.targetColumns[j] - 1; 
      mappedData[targetCol] = newData[sourceCol];
    }
  
    // Append the new data to the target sheet
    targetSheet.appendRow(mappedData);
  }
   