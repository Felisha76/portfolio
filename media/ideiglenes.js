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
            
            // Calculate expected arrival time
            let expectedHour = startHour;
            let expectedMinute = startMinute + travelMinutes;
            
            // Adjust for hour overflow
            if (expectedMinute >= 60) {
                expectedHour = (expectedHour + Math.floor(expectedMinute / 60)) % 24;
                expectedMinute = expectedMinute % 60;
            }
            
            // Format expected answer
            expectedAnswer = `${expectedHour.toString().padStart(2, '0')}:${expectedMinute.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Compare hours and minutes separately to handle 24-hour format differences
            isCorrect = (userHours % 24 === expectedHour % 24) && (userMinutes === expectedMinute);
        }
    }
    
    // Question 2: Calculate departure time (arrival time - travel time)
    else if (questionText.includes("Ha egy vonat")) {
        // Extract arrival time and travel minutes from the question
        const arrivalTimeMatch = questionText.match(/(\d+):(\d+)/);
        const travelMinutesMatch = questionText.match(/(\d+) perc az út/);
        
        if (arrivalTimeMatch && travelMinutesMatch) {
            const arrivalHour = parseInt(arrivalTimeMatch[1]);
            const arrivalMinute = parseInt(arrivalTimeMatch[2]);
            const travelMinutes = parseInt(travelMinutesMatch[1]);
            
            // Calculate expected departure time (when to leave to arrive at the specified time)
            let expectedHour = arrivalHour;
            let expectedMinute = arrivalMinute - travelMinutes;
            
            // Adjust for hour underflow
            if (expectedMinute < 0) {
                expectedHour = (expectedHour - 1 + 24) % 24;
                expectedMinute = expectedMinute + 60;
            }
            
            // Format expected answer
            expectedAnswer = `${expectedHour.toString().padStart(2, '0')}:${expectedMinute.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Compare hours and minutes separately to handle 24-hour format differences
            isCorrect = (userHours % 24 === expectedHour % 24) && (userMinutes === expectedMinute);
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
            
            // Calculate duration in minutes
            let durationMinutes = (endHour - startHour) * 60 + (endMinute - startMinute);
            if (durationMinutes < 0) {
                durationMinutes += 24 * 60; // Add a day if end time is on the next day
            }
            
            // Calculate hours and minutes for display
            const durationHours = Math.floor(durationMinutes / 60);
            const remainingMinutes = durationMinutes % 60;
            
            // Format expected answer in HH:MM format
            expectedAnswer = `${durationHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Check if user's answer matches the expected duration
            isCorrect = (userHours === durationHours && userMinutes === remainingMinutes);
        }
    }
    
    if (isCorrect) {
        input.style.backgroundColor = "#d4edda"; // Green background
        correctCount++;
    } else {
        input.style.backgroundColor = "#f8d7da"; // Red background
        // Optionally show the expected answer
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
