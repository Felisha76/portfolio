// Inside the checkAnswers function, add this code to handle duration questions
// Add this after the other question type checks

// For time input questions related to duration calculations
else if (input.type === "time" && questionText.includes("perc")) {
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
            const userAnswer = `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}`;
            
            isCorrect = userAnswer === expectedAnswer;
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
            
            // Calculate expected departure time
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
            const userAnswer = `${userHours.toString().padStart(2, '0')}:${userMinutes.toString().padStart(2, '0')}`;
            
            isCorrect = userAnswer === expectedAnswer;
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
            
            // For this question, we expect a numeric answer in minutes
            expectedAnswer = durationMinutes.toString();
            
            // Check if user's answer is correct
            // Since the input is time type, we need to convert it to minutes
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            const userAnswer = (userHours * 60 + userMinutes).toString();
            
            isCorrect = userAnswer === expectedAnswer || 
                        // Alternative: allow the answer as hours:minutes format
                        (userHours === Math.floor(durationMinutes / 60) && 
                         userMinutes === durationMinutes % 60);
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
