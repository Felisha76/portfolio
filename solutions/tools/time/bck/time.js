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

    function generateTestQuestions() {
        testContainer.innerHTML = "";
        const months = ["január", "február", "március", "április", "május", "június", "július", "augusztus", "szeptember", "október", "november", "december"];
        const seasons = { "tél": ["december", "január", "február"], "tavasz": ["március", "április", "május"], "nyár": ["június", "július", "augusztus"], "ősz": ["szeptember", "október", "november"] };
        
        let randomMonth = getRandomItem(months);
        let randomSeason = getRandomItem(Object.keys(seasons));

        const questions = [
            { question: "Hány napból áll egy év?", answer: "365" },
            { question: `Hány napból áll a ${randomMonth}?`, answer: randomMonth === "február" ? "28" : (["április", "június", "szeptember", "november"].includes(randomMonth) ? "30" : "31") },
            { question: `Hanyadik hónap a ${randomMonth}?`, answer: (months.indexOf(randomMonth) + 1).toString() },
            { question: `Melyik évszakba tartozik a ${randomMonth}?`, answer: Object.keys(seasons).find(season => seasons[season].includes(randomMonth)) },
            { question: `A(z) ${randomSeason} melyik hónapokból áll?`, answer: seasons[randomSeason].join(", ") }
        ];

        questions.forEach((q, index) => {
            let questionDiv = document.createElement("div");
            questionDiv.innerHTML = `<p>${q.question}</p><input type='text' id='answer-${index}'>`;
            testContainer.appendChild(questionDiv);
        });

        let submitBtn = document.createElement("button");
        submitBtn.textContent = "Ellenőrzés";
        submitBtn.addEventListener("click", checkAnswers);
        testContainer.appendChild(submitBtn);
    }

    function checkAnswers() {
        const inputs = testContainer.querySelectorAll("input");
        let correctCount = 0;
        inputs.forEach((input, index) => {
            if (input.value.trim().toLowerCase() === questions[index].answer.toLowerCase()) {
                input.style.borderColor = "green";
                correctCount++;
            } else {
                input.style.borderColor = "red";
            }
        });
        alert(`Helyes válaszok száma: ${correctCount}/${inputs.length}`);
    }

    startTestBtn.addEventListener("click", generateTestQuestions);

    drawClock();
    updateDigitalClock();
});
