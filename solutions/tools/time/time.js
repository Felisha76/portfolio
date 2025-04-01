document.addEventListener("DOMContentLoaded", function () {
    const clockCanvas = document.getElementById("clockCanvas");
    const ctx = clockCanvas.getContext("2d");
    const digitalHours = document.getElementById("digital-hours");
    const digitalMinutes = document.getElementById("digital-minutes");
    const testContainer = document.getElementById("test-container");
    const startTestBtn = document.getElementById("start-test");
    let hours = 0;
    let minutes = 0;
    let draggingHand = null;
    let timeFormat = "24";
    let testActive = false;

    document.getElementById("timeFormat").addEventListener("change", function (e) {
        timeFormat = e.target.value;
        updateDigitalClock();
    });

    function drawClock() {
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        ctx.beginPath();
        ctx.arc(100, 100, 90, 0, Math.PI * 2);
        ctx.stroke();

        for (let i = 1; i <= 12; i++) {
            let angle = (i * 30 - 90) * (Math.PI / 180);
            let x = 100 + Math.cos(angle) * 75;
            let y = 100 + Math.sin(angle) * 75;
            ctx.fillText(i, x - 5, y + 5);
        }

        let hourAngle = ((hours % 12) * 30 + minutes / 2) * (Math.PI / 180) - Math.PI / 2;
        let minuteAngle = (minutes * 6) * (Math.PI / 180) - Math.PI / 2;

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100 + 40 * Math.cos(hourAngle), 100 + 40 * Math.sin(hourAngle));
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.lineTo(100 + 60 * Math.cos(minuteAngle), 100 + 60 * Math.sin(minuteAngle));
        ctx.stroke();
    }

    clockCanvas.addEventListener("mousedown", function (event) {
        let rect = clockCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;
        let min = Math.round((angle / (Math.PI * 2)) * 60) % 60;
        let hr = Math.round((angle / (Math.PI * 2)) * 12) % 12;
        
        let minuteDiff = Math.abs(min - minutes);
        if (minuteDiff < 5 || minuteDiff > 55) {
            draggingHand = "minute";
        } else {
            draggingHand = "hour";
        }
    });

    clockCanvas.addEventListener("mousemove", function (event) {
        if (!draggingHand) return;
        let rect = clockCanvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;

        if (draggingHand === "minute") {
            let newMinutes = Math.round((angle / (Math.PI * 2)) * 60) % 60;
            if (newMinutes < 0) newMinutes += 60;
            if (newMinutes < minutes && minutes - newMinutes > 30) hours = (hours + 1) % 24;
            if (newMinutes > minutes && newMinutes - minutes > 30) hours = (hours - 1 + 24) % 24;
            minutes = newMinutes;
        } else {
            let newHours = Math.round((angle / (Math.PI * 2)) * 12) % 12;
            if (newHours < 0) newHours += 12;
            hours = newHours;
        }
        updateDigitalClock();
        drawClock();
    });

    clockCanvas.addEventListener("mouseup", function () {
        draggingHand = null;
    });

    function updateDigitalClock() {
        digitalHours.value = timeFormat === "24" ? hours : hours % 12 || 12;
        digitalMinutes.value = minutes.toString().padStart(2, '0');
    }

    digitalHours.addEventListener("input", function () {
        hours = parseInt(digitalHours.value) || 0;
        drawClock();
    });
    
    digitalMinutes.addEventListener("input", function () {
        minutes = parseInt(digitalMinutes.value) || 0;
        drawClock();
    });
    
    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    // Tesztkérdések generálása
function generateTestQuestions() {
    const testContainer = document.getElementById("test-container");
    testContainer.style.display = "block"; // Make sure it's visible
    testContainer.innerHTML = "";
    testActive = true;

// 1. típus: Analóg <-> Digitális átváltás
    const randomHour = Math.floor(Math.random() * 12);
    const randomMinute = Math.floor(Math.random() * 60);

    const analogToDigitalQuestion = document.createElement("div");
    analogToDigitalQuestion.innerHTML = `<p>Hány óra van az alábbi analóg órán? (${randomHour}:${randomMinute.toString().padStart(2, '0')})</p>
                                        <canvas id='testClockCanvas' width='200' height='200'></canvas>
                                        <input type='time' id='analog-answer' required>`;
    testContainer.appendChild(analogToDigitalQuestion);
    drawTestClock(randomHour, randomMinute, 'testClockCanvas');

    const digitalToAnalogQuestion = document.createElement("div");
    digitalToAnalogQuestion.innerHTML = `<p>Állítsd be az analóg órát erre az időre: ${randomHour}:${randomMinute.toString().padStart(2, '0')}</p>
                                        <canvas id='setClockCanvas' width='200' height='200'></canvas>`;
    testContainer.appendChild(digitalToAnalogQuestion);
    setupAnalogClockInteraction("setClockCanvas");

    // 2. típus: Idővel kapcsolatos kérdések
    const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
    const seasons = { "Tavasz": ["Március", "Április", "Május"], "Nyár": ["Június", "Július", "Augusztus"], "Ősz": ["Szeptember", "Október", "November"], "Tél": ["December", "Január", "Február"] };
    const randomMonth = getRandomItem(months);
    const randomSeason = getRandomItem(Object.keys(seasons));

    const generalQuestions = [
        `Hány napból áll egy év?`,
        `Hány napból áll a ${randomMonth} hónap?`,
        `Hanyadik hónap a ${randomMonth}?`,
        `Melyik évszakba tartozik a ${randomMonth}?`,
        `A(z) ${randomSeason} melyik hónapokból áll?`,
        `Hány hétből áll egy év?`,
        `Hány hónapból áll egy év?`,
        `Hány órából áll egy nap?`,
        `Mik a hét napjai?`
    ];
    generalQuestions.forEach(question => {
        let div = document.createElement("div");
        div.innerHTML = `<p>${question}</p><input type='text' required>`;
        testContainer.appendChild(div);
    });

    // 3. típus: Időtartam kérdések
    const randomStartHour = Math.floor(Math.random() * 24);
    const randomStartMinute = Math.floor(Math.random() * 60);
    const travelMinutes = Math.floor(Math.random() * 90);

    const durationQuestions = [
        `Ha a lány ${randomStartHour}:${randomStartMinute} órakor indul el, és ${travelMinutes} percet utazik, hány órakor ér oda?`,
        `Ha egy vonat ${randomStartHour}:${randomStartMinute}-kor indul, és ${travelMinutes} perc az út az állomásig, mikor kell elindulni?`,
        `Ha egy focimeccs ${randomStartHour}:${randomStartMinute}-kor kezdődik és ${randomStartHour + 2}:${randomStartMinute}-kor ér véget, hány percig tart?`
    ];
    durationQuestions.forEach(question => {
        let div = document.createElement("div");
        div.innerHTML = `<p>${question}</p><input type='text' required>`;
        testContainer.appendChild(div);
    });

    // Add a check answers button at the end
    const checkButton = document.createElement("button");
    checkButton.textContent = "Check Answers";
    checkButton.style.marginTop = "20px";
    checkButton.style.padding = "10px";
    checkButton.addEventListener("click", checkAnswers);
    
    testContainer.appendChild(checkButton);    

}

// Óra rajzolása a teszthez
function drawTestClock(hour, minute, canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, Math.PI * 2);
    ctx.stroke();

    for (let i = 1; i <= 12; i++) {
        let angle = (i * 30 - 90) * (Math.PI / 180);
        let x = 100 + Math.cos(angle) * 75;
        let y = 100 + Math.sin(angle) * 75;
        ctx.fillText(i, x - 5, y + 5);
    }

    let hourAngle = ((hour % 12) * 30 + minute / 2) * (Math.PI / 180) - Math.PI / 2;
    let minuteAngle = (minute * 6) * (Math.PI / 180) - Math.PI / 2;

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100 + 40 * Math.cos(hourAngle), 100 + 40 * Math.sin(hourAngle));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(100 + 60 * Math.cos(minuteAngle), 100 + 60 * Math.sin(minuteAngle));
    ctx.stroke();
}

// Interaktív óra beállítás
function setupAnalogClockInteraction(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    let userHours = 0;
    let userMinutes = 0;
    let draggingHand = null;
    
    // Draw initial clock
    drawTestClock(userHours, userMinutes, canvasId);
    
    canvas.addEventListener("mousedown", function(event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;
        let min = Math.round((angle / (Math.PI * 2)) * 60) % 60;
        let hr = Math.round((angle / (Math.PI * 2)) * 12) % 12;
        
        // Determine if user is trying to move hour or minute hand
        let distance = Math.sqrt(x*x + y*y);
        if (distance < 50) {
            draggingHand = "hour";
        } else {
            draggingHand = "minute";
        }
    });

    canvas.addEventListener("mousemove", function(event) {
        if (!draggingHand) return;
        
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left - 100;
        let y = event.clientY - rect.top - 100;
        let angle = Math.atan2(y, x) + Math.PI / 2;
        
        if (draggingHand === "minute") {
            userMinutes = Math.round((angle / (Math.PI * 2)) * 60) % 60;
            if (userMinutes < 0) userMinutes += 60;
        } else {
            userHours = Math.round((angle / (Math.PI * 2)) * 12) % 12;
            if (userHours < 0) userHours += 12;
        }
        
        // Redraw the clock with new values
        drawTestClock(userHours, userMinutes, canvasId);
    });
    canvas.addEventListener("mouseup", function() {
        draggingHand = null;
    });
    
    // Store the user's answer in a data attribute for later checking
    canvas.dataset.userHours = userHours;
    canvas.dataset.userMinutes = userMinutes;
    
    // Update data attributes when values change
    const updateDataset = function() {
        canvas.dataset.userHours = userHours;
        canvas.dataset.userMinutes = userMinutes;
    };
    
    canvas.addEventListener("mouseup", updateDataset);
}

// Add this function to check answers and display results
function checkAnswers() {
    const testContainer = document.getElementById("test-container");

    // Remove any existing results table
    const existingTable = document.getElementById("results-table");
    if (existingTable) {
        existingTable.remove();
    }

    const questions = testContainer.querySelectorAll("div");
    let correctCount = 0;
    let totalQuestions = questions.length;
    
    // Create results table
    const resultsTable = document.createElement("table");
    resultsTable.innerHTML = `
        <thead>
            <tr>
                <th>Kérdés</th>
                <th>Helyes válasz</th>
                <th>A te válaszod</th>
                <th>Eredmény</th>
            </tr>
        </thead>
        <tbody id="results-body"></tbody>
    `;
    resultsTable.style.width = "100%";
    resultsTable.style.borderCollapse = "collapse";
    resultsTable.style.marginTop = "20px";
    
    const resultsBody = resultsTable.querySelector("#results-body");
    
    // Check each question
    questions.forEach((questionDiv, index) => {
        const questionText = questionDiv.querySelector("p")?.textContent || `Kérdés ${index + 1}`;
        let userAnswer = "";
        let correctAnswer = "";
        let isCorrect = false;
        
        // Handle different question types
        if (questionDiv.querySelector("#testClockCanvas")) {
            // Analog to digital conversion
            const timeInput = questionDiv.querySelector("input[type='time']");
            userAnswer = timeInput.value;
            const [randomHour, randomMinute] = getRandomTimeFromCanvas("testClockCanvas");
            correctAnswer = `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`;
            isCorrect = userAnswer === correctAnswer;
        } 
        else if (questionDiv.querySelector("#setClockCanvas")) {
            // Digital to analog conversion
            const canvas = questionDiv.querySelector("canvas");
            const userHours = parseInt(canvas.dataset.userHours) || 0;
            const userMinutes = parseInt(canvas.dataset.userMinutes) || 0;
            
            // Extract the expected time from the question text
            const timeMatch = questionText.match(/(\d+):(\d+)/);
            const expectedHour = timeMatch ? parseInt(timeMatch[1]) : 0;
            const expectedMinute = timeMatch ? parseInt(timeMatch[2]) : 0;
            
            userAnswer = `${userHours}:${userMinutes.toString().padStart(2, '0')}`;
            correctAnswer = `${expectedHour}:${expectedMinute.toString().padStart(2, '0')}`;
            
            // Allow some tolerance for analog clock setting
            isCorrect = Math.abs(userHours - expectedHour) <= 1 && Math.abs(userMinutes - expectedMinute) <= 5;
        }
        else if (questionDiv.querySelector("input[type='text']")) {
            // Text input questions
            const input = questionDiv.querySelector("input[type='text']");
            userAnswer = input.value;
            
            // Determine correct answer based on question text
            if (questionText.includes("Hány napból áll egy év")) {
                correctAnswer = "365";
                isCorrect = userAnswer === "365" || userAnswer === "366";
            }
            else if (questionText.includes("Hány napból áll a")) {
                const month = questionText.match(/Hány napból áll a (\w+)/)[1];
                if (["Április", "Június", "Szeptember", "November"].includes(month)) {
                    correctAnswer = "30";
                } else if (month === "Február") {
                    correctAnswer = "28/29";
                    isCorrect = userAnswer === "28" || userAnswer === "29" || userAnswer === "28/29";
                } else {
                    correctAnswer = "31";
                }
                if (!isCorrect) isCorrect = userAnswer === correctAnswer;
            }
            // Add more question-specific logic here
            else {
                // For simplicity, we'll just mark other questions as correct if they have any answer
                correctAnswer = "(Egyéni értékelés)";
                isCorrect = userAnswer.trim() !== "";
            }
        }
        
        if (isCorrect) correctCount++;
        
        // Add row to results table
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${questionText}</td>
            <td>${correctAnswer}</td>
            <td>${userAnswer}</td>
            <td>${isCorrect ? "✓" : "✗"}</td>
        `;
        row.style.border = "1px solid #ddd";
        row.style.padding = "8px";
        row.style.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
        
        resultsBody.appendChild(row);
    });
    
    // Add summary row
    const summaryRow = document.createElement("tr");
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    summaryRow.innerHTML = `
        <td colspan="3"><strong>Összesítés</strong></td>
        <td><strong>${correctCount}/${totalQuestions} (${percentage}%)</strong></td>
    `;
    summaryRow.style.border = "1px solid #ddd";
    summaryRow.style.padding = "8px";
    summaryRow.style.backgroundColor = "#e2e3e5";
    resultsBody.appendChild(summaryRow);
    
    // Add results table to the page
    testContainer.appendChild(resultsTable);
    resultsTable.scrollIntoView({ behavior: 'smooth' });

    // Add a restart button
    const restartButton = document.createElement("button");
    restartButton.textContent = "Új teszt";
    restartButton.style.marginTop = "20px";
    restartButton.style.padding = "10px 20px";
    restartButton.addEventListener("click", function() {
        generateTestQuestions();
    });
    
    testContainer.appendChild(restartButton);
    
    console.log("Results table added to the page");
}

// Helper function to extract time from a canvas
function getRandomTimeFromCanvas(canvasId) {
    // In a real implementation, we would store the actual time when drawing the test clock
    // For now, we'll extract it from the question text
    const questionDiv = document.getElementById(canvasId).closest("div");
    const questionText = questionDiv.querySelector("p").textContent;
    const timeMatch = questionText.match(/(\d+):(\d+)/);
    
    if (timeMatch) {
        return [parseInt(timeMatch[1]), parseInt(timeMatch[2])];
    }
    return [0, 0];
}

// Teszt indítása
document.getElementById("start-test").addEventListener("click", generateTestQuestions);

    drawClock();
    updateDigitalClock();
});

        // Add event listener for Enter key to check answers
        document.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                checkAnswers();
            }
        });