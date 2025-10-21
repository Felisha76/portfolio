// test.js - Interaktív tesztlogika
// Feltételezzük, hogy a CSV fájl elérhető: "../../tesztkerdesek.csv"

const CSV_PATH = "01.csv";

let questions = [];
let selectedChapters = [];
let testQuestions = [];
let startTime = null;
let timerInterval = null;

function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/);
    return lines.map(line => {
        // Egyszerű CSV split, idézőjelet nem kezel
        let [chapter, question, a, b, c, d, correct, explanation] = line.split(';');
        correct = (correct || '').trim().toUpperCase();
        return { chapter, question, a, b, c, d, correct, explanation };
    });
}

function loadCSV() {
    fetch(CSV_PATH)
        .then(res => res.text())
        .then(text => {
            questions = parseCSV(text);
            fillChapterDropdown();
        })
        .catch(() => alert('Nem sikerült betölteni a tesztkérdéseket!'));
}

function fillChapterDropdown() {
    const dropdown = document.getElementById('chapterDropdown');
    const chapters = [...new Set(questions.map(q => q.chapter))];
    dropdown.innerHTML = '';
    chapters.forEach(ch => {
        const opt = document.createElement('option');
        opt.value = ch;
        opt.textContent = ch;
        dropdown.appendChild(opt);
    });
}

function getSelectedChapters() {
    const dropdown = document.getElementById('chapterDropdown');
    return Array.from(dropdown.selectedOptions).map(opt => opt.value);
}

function pickRandomQuestions(chapters, count) {
    const filtered = questions.filter(q => chapters.includes(q.chapter));
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function renderQuestions() {
    const ol = document.getElementById('questionList');
    ol.innerHTML = '';
    testQuestions.forEach((q, idx) => {
        const li = document.createElement('li');
        li.className = 'question-item';
        li.innerHTML =
            '<div class="qtext">' + q.question + '</div>' +
            '<div class="answers">' +
                '<label><input type="radio" name="q' + idx + '" value="A" /> ' + q.a + '</label><br />' +
                '<label><input type="radio" name="q' + idx + '" value="B" /> ' + q.b + '</label><br />' +
                '<label><input type="radio" name="q' + idx + '" value="C" /> ' + q.c + '</label><br />' +
                '<label><input type="radio" name="q' + idx + '" value="D" /> ' + q.d + '</label>' +
            '</div>' +
            '<div class="explanation" style="display:none;"></div>';
        ol.appendChild(li);
    });
}

function startTest() {
    selectedChapters = getSelectedChapters();
    if (selectedChapters.length === 0) {
        alert('Válassz legalább egy fejezetet!');
        return;
    }
    // Számoljuk meg, hány kérdés van összesen a kiválasztott fejezetekben
    const availableQuestions = questions.filter(q => selectedChapters.includes(q.chapter));
    const count = Math.min(20, availableQuestions.length);
    if (count === 0) {
        alert('Nincs kérdés a kiválasztott fejezet(ek)ben!');
        return;
    }
    testQuestions = pickRandomQuestions(selectedChapters, count);
    renderQuestions();
    document.getElementById('testForm').style.display = '';
    document.getElementById('checkBtn').style.display = '';
    document.getElementById('resultSummary').innerHTML = '';
    startTime = Date.now();
    startTimer();
}

function startTimer() {
    const timer = document.getElementById('timer');
    timer.textContent = '00:00';
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const min = String(Math.floor(elapsed / 60)).padStart(2, '0');
        const sec = String(elapsed % 60).padStart(2, '0');
        timer.textContent = `${min}:${sec}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) clearInterval(timerInterval);
}

function checkAnswers() {
    stopTimer();
    let correctCount = 0;
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const ol = document.getElementById('questionList');
    testQuestions.forEach((q, idx) => {
        const li = ol.children[idx];
        const radios = li.querySelectorAll('input[type=radio]');
        let selected = null;
        radios.forEach(r => { if (r.checked) selected = r.value; });
        const answerDiv = li.querySelector('.answers');
        const explanationDiv = li.querySelector('.explanation');
        // Letiltjuk a további választást
        radios.forEach(r => { r.disabled = true; });
        if ((selected || '').toLowerCase() === (q.correct || '').toLowerCase()) {
            answerDiv.classList.add('correct');
            correctCount++;
        } else {
            answerDiv.classList.add('incorrect');
            explanationDiv.style.display = '';
            // Mindig kisbetűs property lookup
            const correctText = q[q.correct ? q.correct.toLowerCase() : ''] || '';
            explanationDiv.innerHTML = `Helyes válasz: <b>${q.correct}</b> (${correctText})<br />${q.explanation || ''}`;
        }
    });
    document.getElementById('checkBtn').style.display = 'none';
    // Pontszámítás
    const score = ((correctCount * 1000) / (elapsed || 1)).toFixed(2);
    document.getElementById('resultSummary').innerHTML =
        `<div class="score-summary">Helyes válaszok (a): ${correctCount}/${testQuestions.length}<br />Idő (b): ${elapsed} mp<br />Összpontszám (a*1000)/b): ${score}</div>`;
}

document.getElementById('startTestBtn').addEventListener('click', startTest);
document.getElementById('checkBtn').addEventListener('click', checkAnswers);

window.addEventListener('DOMContentLoaded', loadCSV);
