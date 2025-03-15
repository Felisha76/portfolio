document.addEventListener('DOMContentLoaded', function () {
    // Variables to track state
    let questions = [];
    let currentQuestionIndex = 0;
    let answeredCount = 0;
    let correctCount = 0;
    let timerInterval = null;
    let timeLeft = 20;
    let incorrectQuestions = [];
    let waitTimeout = null;

    // DOM elements
    const startTable = document.getElementById('startTable');
    const endTable = document.getElementById('endTable');
    const questionCountInput = document.getElementById('questionCount');
    const startBtn = document.getElementById('startBtn');
    const practiceArea = document.getElementById('practiceArea');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const nextBtn = document.getElementById('nextBtn');
    const feedbackElement = document.getElementById('feedback');
    const answeredCountElement = document.getElementById('answeredCount');
    const totalQuestionsElement = document.getElementById('totalQuestions');
    const correctCountElement = document.getElementById('correctCount');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerEnabled = document.getElementById('timerEnabled');

    function updateMaxQuestions() {
        const start = parseInt(startTable.value);
        const end = parseInt(endTable.value);
        if (start > end || start < 1 || end > 12) {
            return;
        }
        const maxAvailable = (end - start + 1) * 12;
        questionCountInput.max = maxAvailable;
        if (parseInt(questionCountInput.value) > maxAvailable) {
            questionCountInput.value = maxAvailable;
        }
    }

    startTable.addEventListener('input', updateMaxQuestions);
    endTable.addEventListener('input', updateMaxQuestions);

    startBtn.addEventListener('click', function () {
        const start = parseInt(startTable.value);
        const end = parseInt(endTable.value);

        if (start < 1 || start > 12 || end < 1 || end > 12 || start > end) {
            alert('Please enter a valid range (1–12), and make sure start ≤ end.');
            return;
        }

        const count = parseInt(questionCountInput.value);
        const maxAvailable = (end - start + 1) * 12;
        if (count < 1 || count > maxAvailable) {
            alert(`Number of questions must be between 1 and ${maxAvailable}!`);
            return;
        }

        generateQuestions(start, end, count);
        currentQuestionIndex = 0;
        answeredCount = 0;
        correctCount = 0;
        incorrectQuestions = [];

        answeredCountElement.textContent = answeredCount;
        totalQuestionsElement.textContent = questions.length;
        correctCountElement.textContent = correctCount;

        practiceArea.classList.remove('hidden');
        practiceArea.scrollIntoView({ behavior: 'smooth' });
        displayQuestion();
    });

    function generateQuestions(start, end, count) {
        const allPossibleQuestions = [];

        for (let i = start; i <= end; i++) {
            for (let j = 1; j <= 12; j++) {
                allPossibleQuestions.push({
                    factor1: j,
                    factor2: i,
                    answer: j * i,
                    asked: false
                });
            }
        }

        shuffleArray(allPossibleQuestions);
        questions = allPossibleQuestions.slice(0, count);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayQuestion() {
        clearInterval(timerInterval);
        clearTimeout(waitTimeout);

        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            questionElement.textContent = `${question.factor1} × ${question.factor2} = ?`;
            answerInput.value = '';
            feedbackElement.textContent = '';
            feedbackElement.className = '';
            answerInput.disabled = false;
            nextBtn.disabled = false;
            answerInput.focus();

            if (timerEnabled.checked) {
                timeLeft = 20;
                timerDisplay.textContent = `Time left: ${timeLeft}s`;
                timerDisplay.classList.remove('hidden');

                timerInterval = setInterval(function () {
                    timeLeft--;
                    timerDisplay.textContent = `Time left: ${timeLeft}s`;

                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        handleAnswer(true);
                    }
                }, 1000);
            } else {
                timerDisplay.classList.add('hidden');
            }
        } else {
            if (incorrectQuestions.length > 0) {
                questions = [...incorrectQuestions];
                incorrectQuestions = [];
                currentQuestionIndex = 0;
                displayQuestion();
            } else {
                clearInterval(timerInterval);
                questionElement.textContent = 'Practice completed!';
                answerInput.value = '';
                answerInput.disabled = true;
                nextBtn.disabled = true;
                feedbackElement.textContent = `You got ${correctCount} out of ${answeredCount} correct!`;
                feedbackElement.className = 'correct';
                timerDisplay.classList.add('hidden');
            }
        }
    }

    function handleAnswer(isTimeout = false) {
        clearInterval(timerInterval);
        clearTimeout(waitTimeout);

        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = parseInt(answerInput.value);

        answerInput.disabled = true;
        nextBtn.disabled = true;

        if (isTimeout || isNaN(userAnswer)) {
            feedbackElement.textContent = `The correct answer is: ${currentQuestion.answer}`;
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);

            waitTimeout = setTimeout(() => {
                proceedToNext();
            }, 3000);
        } else if (userAnswer === currentQuestion.answer) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'correct';
            correctCount++;
            correctCountElement.textContent = correctCount;
        } else {
            feedbackElement.textContent = `The correct answer is: ${currentQuestion.answer}`;
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);

            waitTimeout = setTimeout(() => {
                proceedToNext();
            }, 3000);
        }

        answeredCount++;
        answeredCountElement.textContent = answeredCount;

        if (!isTimeout && userAnswer === currentQuestion.answer) {
            currentQuestionIndex++;
        }
    }

    function proceedToNext() {
        currentQuestionIndex++;
        displayQuestion();
    }

    nextBtn.addEventListener('click', function () {
        if (answerInput.value.trim() === '') {
            alert('Please enter an answer!');
            return;
        }

        handleAnswer();
        if (feedbackElement.className !== 'incorrect') {
            displayQuestion();
        }
    });

    answerInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (answerInput.value.trim() === '') {
                alert('Please enter an answer!');
                return;
            }

            handleAnswer();
            if (feedbackElement.className !== 'incorrect') {
                displayQuestion();
            }
        }
    });

    updateMaxQuestions();
});
