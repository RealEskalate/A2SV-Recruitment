function createCalendarInvitesFromSheet() {
    // Get the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Week 9'); // Adjust sheet tab name
    var dataRange = sheet.getDataRange();
    var data = dataRange.getValues();
  
    Logger.log("Starting to process the sheet...");
  
    // Loop through the data starting from the second row (skip headers)
    for (var i = 1; i < data.length; i++) {
      var interviewerName = data[i][0];
      var interviewerEmail = data[i][1];
      var status = data[i][10]; // Column K
  
      // Log the current row being processed
      Logger.log(`Processing row ${i + 1}: Interviewer ${interviewerName || "Unknown"}, Interviewer Email: ${interviewerEmail || "Unknown"}`);
  
      // If interviewerEmail is empty or status is already "Sent", continue to the next row
      if (!interviewerEmail || status === "Sent") {
        Logger.log(`Skipping row ${i + 1} - either no interviewer email or status is already 'Sent'.`);
        continue;
      }
  
      var intervieweeName = data[i][2];
      var intervieweeEmail = data[i][3];
      var interviewTime = data[i][8];
  
      // Ensure the necessary data is present
      if (interviewerEmail && intervieweeEmail && interviewTime) {
        // Log details about the interview being scheduled
        Logger.log(`Scheduling interview: Interviewer - ${interviewerName}, Interviewee - ${intervieweeName}, Time - ${interviewTime}`);
  
        // Parse the interview time (adjust for your time zone if needed)
        var timeDetails = parseInterviewTime(interviewTime);
  
        // Create the calendar event with a description
        createCalendarInvite(interviewerEmail, intervieweeEmail,
          `A2SV  Recruitment Interview: ${intervieweeName} <> ${interviewerName}`,
          `Hello,
          We're excited to have you join us for your upcoming technical and behavioral interview at A2SV.
          Here are the details for your session:
  
          Duration:
          1 hour and 30 minutes
  
          Technical Setup:
          - Test your camera and microphone on your computer a few hours before the interview.
          - Ensure your identification card is readily available prior to the start of the interview.
  
          Instructions:
          1. Join the meeting on time.
          2. Open your camera for the interview.
          3. Have your identification card ready to show to the interviewer.
  
          Interview Structure:
          1. Technical Interview (45 minutes): You will be asked to solve problems in front of the interviewer. Please be prepared to discuss your thought process and approach.
          
          2. Behavioral Interview (30 minutes): This section will focus on understanding your motivations and background in detail. Be ready to discuss your experiences and aspirations.
  
          If you have any questions or concerns leading up to the interview, please feel free to reach out to us at remote.recruitment@a2sv.org`,
          timeDetails.startTime, timeDetails.endTime);
  
        // After successfully scheduling, update column K with "Sent"
        sheet.getRange(i + 1, 11).setValue("Sent"); // Update column K (11th column) in the current row
  
        Logger.log(`Interview scheduled successfully for ${intervieweeName}. Status updated to 'Sent'.`);
      } else {
        Logger.log(`Missing data for interview with interviewer ${interviewerName}. Skipping this row.`);
      }
    }
  
    Logger.log("Finished processing the sheet.");
  }
  
  function parseInterviewTime(interviewTime) {
    var [month, day, weekday, startTime, startRange, endTime, endRange] = interviewTime.split(/[\s-]+/);
  
    // Combine start and end times with their respective AM/PM ranges
    startTime = `${startTime} ${startRange}`;
    endTime = `${endTime} ${endRange}`;
  
    // Convert to a full date string
    var startDateTimeString = `${month} ${day}, 2024 ${convertTo24Hour(startTime)}`;
    var endDateTimeString = `${month} ${day}, 2024 ${convertTo24Hour(endTime)}`;
  
    // Create Date objects for start and end times
    var startDateTime = new Date(startDateTimeString);
    var endDateTime = new Date(endDateTimeString);
  
    return { startTime: startDateTime, endTime: endDateTime };
  }
  
  function convertTo24Hour(time) {
    // Convert 12-hour time format to 24-hour time format
    var [timePart, modifier] = time.split(' ');
    var [hours, minutes] = timePart.split(':');
  
    if (hours === '12') {
      hours = '00';
    }
    if (modifier.toLowerCase() === 'pm' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }
  
    return `${hours}:${minutes}`;
  }
  
  function createCalendarInvite(interviewerEmail, intervieweeEmail, eventTitle, eventDescription, startTime, endTime) {
    var calendar = CalendarApp.getDefaultCalendar();
    calendar.createEvent(eventTitle,
      startTime,
      endTime,
      {
        description: eventDescription,
        guests: [interviewerEmail, intervieweeEmail].join(","),
        sendInvites: true
      });
  }
  