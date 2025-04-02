function checkAnswers() {
    console.log("Checking answers...");
    
    // Get all input elements in the test container
    const testContainer = document.getElementById("test-container");
    const inputs = testContainer.querySelectorAll("input");

    // Track correct answers
    let correctCount = 0;
    let totalAnswered = 0;   
    
    // Process each input
    inputs.forEach(input => {
        // Get the parent question div
        const questionDiv = input.closest("div");
        
        // Get the question text
        const questionText = questionDiv.querySelector("p")?.textContent || "";
        
        // Check if it's a time input (analog to digital conversion)
        if (input.type === "time" && input.value) {
            totalAnswered++;
            
            // Get the expected time from the data attributes
            const questionDiv = input.closest("div");
            const expectedHour = parseInt(questionDiv.dataset.expectedHour || 0);
            const expectedMinute = parseInt(questionDiv.dataset.expectedMinute || 0);
            
            // Parse user's answer
            const [userHours, userMinutes] = input.value.split(':').map(Number);
            
            // Check if correct (allowing for 12/24 hour format)
            const isCorrect = (userHours % 12 === expectedHour % 12) && (userMinutes === expectedMinute);
            
            
            if (isCorrect) {
                input.style.backgroundColor = "#d4edda"; // Green background
                correctCount++;
            } else {
                input.style.backgroundColor = "#f8d7da"; // Red background
                
                // Add expected answer as a paragraph
                const expectedAnswer = formatTime(expectedHour, expectedMinute);
                const answerHint = document.createElement("p");
                answerHint.textContent = `Helyes válasz: ${expectedAnswer}`;
                answerHint.style.color = "#dc3545";
                answerHint.style.margin = "5px 0";
                answerHint.classList.add("expected-answer");
                
                // Remove any existing hint
                const existingHint = questionDiv.querySelector(".expected-answer");
                if (existingHint) {
                    existingHint.remove();
                }
                
                questionDiv.appendChild(answerHint);
            }
        }

        // For text inputs
        else if (input.type === "text" && input.value.trim() !== "") {
            totalAnswered++;
            
            // Determine correct answer based on question text
            let isCorrect = false;
            let expectedAnswer = "";
            
            if (questionText.includes("Hány napból áll egy év")) {
                expectedAnswer = "365";
                isCorrect = input.value === "365";
            }
            else if (questionText.includes("Hány napból áll a")) {
                // Use a more inclusive regex pattern that captures accented characters
                const monthMatch = questionText.match(/Hány napos a ([^\?]+)/);
                
                if (monthMatch) {
                    // Trim any whitespace from the extracted month name
                    const month = monthMatch[1].trim();
                    
                    if (["Január", "Március", "Május", "Július", "Augusztus", "Október", "December"].includes(month)) {
                        expectedAnswer = "31";
                        isCorrect = input.value.trim() === "31";
                    } else if (["Április", "Június", "Szeptember", "November"].includes(month)) {
                        expectedAnswer = "30";
                        isCorrect = input.value.trim() === "30";
                    } else if (month === "Február") {
                        expectedAnswer = "28/29";
                        isCorrect = input.value.trim() === "28" || input.value.trim() === "29" || input.value.trim() === "28/29";
                    }
                }
            }
            else if (questionText.includes("Hanyadik hónap a")) {
                const monthMatch = questionText.match(/Hanyadik hónap a ([^\?]+)/);
                
                if (monthMatch) {
                    const month = monthMatch[1].trim();
                    // Dictionary mapping month names to their numbers
                    const monthNumbers = {
                        "Január": 1,
                        "Február": 2,
                        "Március": 3,
                        "Április": 4,
                        "Május": 5,
                        "Június": 6, 
                        "Július": 7,
                        "Augusztus": 8,
                        "Szeptember": 9,
                        "Október": 10,
                        "November": 11,
                        "December": 12
                    };
                    
                    if (month in monthNumbers) {
                        expectedAnswer = monthNumbers[month].toString();
                        // Compare the user's input with the expected number, allowing for both string and number inputs
                        isCorrect = input.value.trim() === expectedAnswer || parseInt(input.value) === monthNumbers[month];
                    }
                }
            }
            
            
            else if (questionText.includes("Hány órából áll egy nap")) {
                expectedAnswer = "24";
                isCorrect = input.value === "24";
            }
            else if (questionText.includes("Hány hónapból áll egy év")) {
                expectedAnswer = "12";
                isCorrect = input.value === "12";
            }
            else if (questionText.includes("Hány hétből áll egy év")) {
                expectedAnswer = "52";
                isCorrect = input.value === "52" || input.value === "53";
            }

            else if (questionText.includes("Melyik évszakba tartozik a")) {
                const monthMatch = questionText.match(/Melyik évszakba tartozik a ([^\?]+)/);
                
                if (monthMatch) {
                    const month = monthMatch[1].trim();
                    
                    // Define seasons based on months
                    const winterMonths = ["December", "Január", "Február"];
                    const springMonths = ["Március", "Április", "Május"];
                    const summerMonths = ["Június", "Július", "Augusztus"];
                    const autumnMonths = ["Szeptember", "Október", "November"];
                    
                    // Determine expected answer based on month
                    if (winterMonths.includes(month)) {
                        expectedAnswer = "Tél";
                        isCorrect = input.value.toLowerCase().trim() === "tél";
                    } else if (springMonths.includes(month)) {
                        expectedAnswer = "Tavasz";
                        isCorrect = input.value.toLowerCase().trim() === "tavasz";
                    } else if (summerMonths.includes(month)) {
                        expectedAnswer = "Nyár";
                        isCorrect = input.value.toLowerCase().trim() === "nyár";
                    } else if (autumnMonths.includes(month)) {
                        expectedAnswer = "Ősz";
                        isCorrect = input.value.toLowerCase().trim() === "ősz";
                    }
                }
            }

            // For time input questions related to duration calculations (last 3 questions)
            else if (input.type === "time" && (questionText.includes("perc") || questionText.includes("hány percig tart"))) {
                totalAnswered++;
                
                let isCorrect = false;
                let expectedAnswer = "";
                
                // Question 1: Calculate arrival time (start time + travel time)
                if (questionText.includes("Ha a lány")) {
                    const startTimeMatch = questionText.match(/(\d+):(\d+)/);
                    const travelMinutesMatch = questionText.match(/(\d+) percet/);
                    
                    if (startTimeMatch && travelMinutesMatch) {
                        const startHour = parseInt(startTimeMatch[1]);
                        const startMinute = parseInt(startTimeMatch[2]);
                        const travelMinutes = parseInt(travelMinutesMatch[1]);
                
                        // Idő hozzáadása
                        let totalMinutes = startHour * 60 + startMinute + travelMinutes;
                        let expectedHour = Math.floor(totalMinutes / 60) % 24;
                        let expectedMinute = totalMinutes % 60;
                        expectedAnswer = formatTime(expectedHour, expectedMinute);
                
                        // Felhasználói válasz beolvasása
                        const [userHours, userMinutes] = input.value.split(':').map(Number);
                        const formattedUserAnswer = formatTime(userHours, userMinutes);
                
                        isCorrect = formattedUserAnswer === expectedAnswer;
                    }
                }
                
                // Question 2: Calculate departure time (arrival time - travel time)
                else if (questionText.includes("Ha egy vonat")) {
                    const departureTimeMatch = questionText.match(/(\d+):(\d+)/);
                    const travelMinutesMatch = questionText.match(/(\d+) perc az út/);
                
                    if (departureTimeMatch && travelMinutesMatch) {
                        const departureHour = parseInt(departureTimeMatch[1]);
                        const departureMinute = parseInt(departureTimeMatch[2]);
                        const travelMinutes = parseInt(travelMinutesMatch[1]);
                
                        // Idő kivonása
                        let departureMinutesTotal = departureHour * 60 + departureMinute - travelMinutes;
                        if (departureMinutesTotal < 0) {
                            departureMinutesTotal += 24 * 60; // Ha visszalépnénk előző napra
                        }
                
                        let expectedHour = Math.floor(departureMinutesTotal / 60) % 24;
                        let expectedMinute = departureMinutesTotal % 60;
                        expectedAnswer = formatTime(expectedHour, expectedMinute);
                
                        // Felhasználói válasz beolvasása
                        const [userHours, userMinutes] = input.value.split(':').map(Number);
                        const formattedUserAnswer = formatTime(userHours, userMinutes);
                
                        isCorrect = formattedUserAnswer === expectedAnswer;
                    }
                }
                
                
                // Question 3: Calculate duration (end time - start time)
                else if (questionText.includes("Ha egy focimeccs")) {
                    const timeMatches = questionText.match(/(\d+):(\d+).*?(\d+):(\d+)/);
                
                    if (timeMatches) {
                        const startHour = parseInt(timeMatches[1]);
                        const startMinute = parseInt(timeMatches[2]);
                        const endHour = parseInt(timeMatches[3]);
                        const endMinute = parseInt(timeMatches[4]);
                
                        // Időtartam kiszámítása
                        let startTotalMinutes = startHour * 60 + startMinute;
                        let endTotalMinutes = endHour * 60 + endMinute;
                
                        let durationMinutes = endTotalMinutes - startTotalMinutes;
                        if (durationMinutes < 0) {
                            durationMinutes += 24 * 60; // Ha az idő átnyúlik másnapra
                        }
                
                        let durationHours = Math.floor(durationMinutes / 60);
                        let remainingMinutes = durationMinutes % 60;
                        expectedAnswer = formatTime(durationHours, remainingMinutes);
                
                        // Felhasználói válasz beolvasása
                        const [userHours, userMinutes] = input.value.split(':').map(Number);
                        const formattedUserAnswer = formatTime(userHours, userMinutes);
                
                        isCorrect = formattedUserAnswer === expectedAnswer;
                    }
                }
                
                
                if (isCorrect) {
                    input.style.backgroundColor = "#d4edda"; // Green background
                    correctCount++;
                } else {
                    input.style.backgroundColor = "#f8d7da"; // Red background
                    
                    // Create a paragraph for the expected answer
                    const answerHint = document.createElement("p");
                    answerHint.textContent = `Helyes válasz: ${expectedAnswer}`;
                    answerHint.style.color = "#dc3545";
                    answerHint.style.margin = "5px 0";
                    answerHint.classList.add("expected-answer");
                    
                    // Remove any existing hint
                    const existingHint = questionDiv.querySelector(".expected-answer");
                    if (existingHint) {
                        existingHint.remove();
                    }
                    
                    questionDiv.appendChild(answerHint);
                }
            }

            // ---------------------------------------------
            // For other questions, we'll just mark them as "correct" for now
            else {
                isCorrect = true;
            }
            
            if (isCorrect) {
                input.style.backgroundColor = "#d4edda"; // Green background
                correctCount++;
            } else {
                input.style.backgroundColor = "#f8d7da"; // Red background
                
                // Add expected answer as a paragraph
                const answerHint = document.createElement("p");
                answerHint.textContent = `Helyes válasz: ${expectedAnswer}`;
                answerHint.style.color = "#dc3545";
                answerHint.style.margin = "5px 0";
                answerHint.classList.add("expected-answer");
                
                // Remove any existing hint
                const existingHint = questionDiv.querySelector(".expected-answer");
                if (existingHint) {
                    existingHint.remove();
                }
                
                questionDiv.appendChild(answerHint);
            }
        }
    });
    
    // Handle the analog clock canvas (digital to analog conversion)
    const setClockCanvas = document.getElementById("setClockCanvas");
    if (setClockCanvas) {
        totalAnswered++;
        
        // Get the expected time from the question text
        const questionDiv = setClockCanvas.closest("div");
        const questionText = questionDiv.querySelector("p")?.textContent || "";
        const timeMatch = questionText.match(/(\d+):(\d+)/);
        
        let isCorrect = false;
        
        if (timeMatch) {
            const expectedHour = parseInt(timeMatch[1]) % 12;
            const expectedMinute = parseInt(timeMatch[2]);
            
           // Get the user's set time from the canvas data attributes
           const userHours = parseInt(setClockCanvas.dataset.userHours || 0);
           const userMinutes = parseInt(setClockCanvas.dataset.userMinutes || 0);
           
           // Check if the time is correct (with some tolerance for minutes)
           const hourCorrect = userHours % 12 === expectedHour % 12;
           const minuteCorrect = Math.abs(userMinutes - expectedMinute) <= 2; // Allow 2 minutes tolerance
           
           isCorrect = hourCorrect && minuteCorrect;
           
           if (isCorrect) {
               correctCount++;
           } else {
               // Add expected answer as a paragraph
               const expectedAnswer = `${expectedHour}
