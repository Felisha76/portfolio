// Tesztkérdések generálása
function generateTestQuestions() {
    const testContainer = document.getElementById("test-container");
    testContainer.style.display = "flex";
    testContainer.style.flexDirection = "column";
    testContainer.innerHTML = "";
    testActive = true;

    // 1. típus: Analóg <-> Digitális átváltás
    const clockQuestionContainer = document.createElement("div");
    clockQuestionContainer.classList.add("clock_question_row");
    clockQuestionContainer.style.display = "flex";
    clockQuestionContainer.style.justifyContent = "space-between";

    // Analóg óra kérdés
    const randomHour1 = Math.floor(Math.random() * 12);
    const randomMinute1 = Math.floor(Math.random() * 60);

    const analogToDigitalQuestion = document.createElement("div");
    analogToDigitalQuestion.classList.add("analog_clock_question");
    analogToDigitalQuestion.style.display = "flex";
    analogToDigitalQuestion.style.flexDirection = "column";
    analogToDigitalQuestion.style.alignItems = "center";
    analogToDigitalQuestion.innerHTML = `<p style='text-align: center;'>Hány óra van az analóg órán? (DE és DU is elfogadható)</p>
                                        <div style='display: flex; align-items: center;'>
                                            <canvas id='testClockCanvas' width='200' height='200'></canvas>
                                            <input type='time' id='analog-answer' required>
                                        </div>`;
    analogToDigitalQuestion.dataset.expectedHour = randomHour1;
    analogToDigitalQuestion.dataset.expectedMinute = randomMinute1;
    drawTestClock(randomHour1, randomMinute1, 'testClockCanvas');

    // Digitális óra kérdés
    const randomHour2 = Math.floor(Math.random() * 12);
    const randomMinute2 = Math.floor(Math.random() * 60);

    const digitalToAnalogQuestion = document.createElement("div");
    digitalToAnalogQuestion.classList.add("digital_clock_question");
    digitalToAnalogQuestion.style.display = "flex";
    digitalToAnalogQuestion.style.flexDirection = "column";
    digitalToAnalogQuestion.style.alignItems = "center";
    digitalToAnalogQuestion.innerHTML = `<p style='text-align: center;'>Állítsd be az analóg órát erre az időre az óramutatók mozgatásával: <b>${randomHour2}:${randomMinute2.toString().padStart(2, '0')}</b></p>
                                        <canvas id='setClockCanvas' width='200' height='200'></canvas>`;
    setupAnalogClockInteraction("setClockCanvas");

    clockQuestionContainer.appendChild(analogToDigitalQuestion);
    clockQuestionContainer.appendChild(digitalToAnalogQuestion);
    testContainer.appendChild(clockQuestionContainer);

    // 2. típus: Idővel kapcsolatos kérdések
    const otherQuestionsContainer = document.createElement("div");
    otherQuestionsContainer.classList.add("other_questions");
    otherQuestionsContainer.style.display = "flex";
    otherQuestionsContainer.style.flexDirection = "column";

    const months = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    
    const generalQuestions = [
        `Hány napból áll egy év?`,
        `Hány napos a ${randomMonth} hónap?`,
        `Hanyadik hónap a ${randomMonth}?`,
        `Hány hétből áll egy év?`,
        `Hány hónapból áll egy év?`,
        `Hány órából áll egy nap?`
    ];

    generalQuestions.forEach(question => {
        let div = document.createElement("div");
        div.classList.add("question_row");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.innerHTML = `<p>${question}</p><input type='text' required>`;
        otherQuestionsContainer.appendChild(div);
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
        div.classList.add("question_row");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.innerHTML = `<p>${question}</p><input type='text' required>`;
        otherQuestionsContainer.appendChild(div);
    });

    testContainer.appendChild(otherQuestionsContainer);
}
