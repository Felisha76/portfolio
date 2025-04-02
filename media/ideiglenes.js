// For time input questions related to duration calculations
else if (input.type === "time" && (questionText.includes("perc") || questionText.includes("hány percig tart"))) {
    totalAnswered++;
    
    let isCorrect = false;
    let expectedAnswer = "";
    
    // Question 1: Calculate arrival time (start time + travel time)
    if (questionText.includes("Ha a lány")) {
        // Extract start time and travel minutes from the question
        const startTimeMatch = questionText.match(/(\d+):(\d+)/);
        const travelMinutesMatch = questionText.match(/(\d+) percet/);
        
        if (startTimeMatch && travelMinutesMatch) {
            const startHour = parseInt(startTimeMatch[1]);
            const startMinute = parseInt(startTimeMatch[2]);
            const travelMinutes = parseInt(travelMinutesMatch[1]);
            
            // Calculate total minutes
            let totalMinutes = startHour * 60 + startMinute + travelMinutes;
            
            // Convert back to hours and minutes
            const expectedHour = Math.floor(totalMinutes / 60) % 24;
            const expectedMinute = totalMinutes % 60;
            
            // Format expected answer
            expectedAnswer = `${expectedHour.toString().padStart(2, '0')}:${expectedMinute.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Format user's answer for comparison
            const formattedUserAnswer = `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}`;
            
            // Debug output
            console.log(`Question 1: Expected ${expectedAnswer}, Got ${formattedUserAnswer}`);
            
            isCorrect = formattedUserAnswer === expectedAnswer;
        }
    }
    
    // Question 2: Calculate departure time (arrival time - travel time)
    else if (questionText.includes("Ha egy vonat")) {
        // Extract departure time and travel minutes from the question
        const departureTimeMatch = questionText.match(/(\d+):(\d+)/);
        const travelMinutesMatch = questionText.match(/(\d+) perc az út/);
        
        if (departureTimeMatch && travelMinutesMatch) {
            const departureHour = parseInt(departureTimeMatch[1]);
            const departureMinute = parseInt(departureTimeMatch[2]);
            const travelMinutes = parseInt(travelMinutesMatch[1]);
            
            // Calculate total minutes for departure time
            let departureMinutesTotal = departureHour * 60 + departureMinute;
            
            // Subtract travel time
            let arrivalMinutesTotal = departureMinutesTotal - travelMinutes;
            if (arrivalMinutesTotal < 0) {
                arrivalMinutesTotal += 24 * 60; // Add a day if it goes to previous day
            }
            
            // Convert back to hours and minutes
            const expectedHour = Math.floor(arrivalMinutesTotal / 60) % 24;
            const expectedMinute = arrivalMinutesTotal % 60;
            
            // Format expected answer
            expectedAnswer = `${expectedHour.toString().padStart(2, '0')}:${expectedMinute.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Format user's answer for comparison
            const formattedUserAnswer = `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}`;
            
            // Debug output
            console.log(`Question 2: Expected ${expectedAnswer}, Got ${formattedUserAnswer}`);
            
            isCorrect = formattedUserAnswer === expectedAnswer;
        }
    }
    
    // Question 3: Calculate duration (end time - start time)
    else if (questionText.includes("Ha egy focimeccs")) {
        // Extract start and end times from the question
        const timeMatches = questionText.match(/(\d+):(\d+).*?(\d+):(\d+)/);
        
        if (timeMatches) {
            const startHour = parseInt(timeMatches[1]);
            const startMinute = parseInt(timeMatches[2]);
            const endHour = parseInt(timeMatches[3]);
            const endMinute = parseInt(timeMatches[4]);
            
            // Calculate total minutes for start and end
            const startTotalMinutes = startHour * 60 + startMinute;
            const endTotalMinutes = endHour * 60 + endMinute;
            
            // Calculate duration in minutes
            let durationMinutes = endTotalMinutes - startTotalMinutes;
            if (durationMinutes < 0) {
                durationMinutes += 24 * 60; // Add a day if end time is on the next day
            }
            
            // Convert to hours and minutes
            const durationHours = Math.floor(durationMinutes / 60);
            const remainingMinutes = durationMinutes % 60;
            
            // Format expected answer
            expectedAnswer = `${durationHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Format user's answer for comparison
            const formattedUserAnswer = `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}`;
            
            // Debug output
            console.log(`Question 3: Expected ${expectedAnswer}, Got ${formattedUserAnswer}`);
            
            isCorrect = formattedUserAnswer === expectedAnswer;
        }
    }
    
    if (isCorrect) {
        input.style.backgroundColor = "#d4edda"; // Green background
        correctCount++;
    } else {
        input.style.backgroundColor = "#f8d7da"; // Red background
        // Show the expected answer
        const answerHint = document.createElement("span");
        answerHint.textContent = ` (Correct: ${expectedAnswer})`;
        answerHint.style.color = "#dc3545";
        answerHint.style.marginLeft = "10px";
        
        // Remove any existing hint
        const existingHint = input.nextElementSibling;
        if (existingHint && existingHint.tagName === "SPAN") {
            existingHint.remove();
        }
        
        input.parentNode.insertBefore(answerHint, input.nextSibling);
    }
}
