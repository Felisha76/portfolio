document.addEventListener('DOMContentLoaded', function () {
    // Variables to track state
    let questions = [];
    let currentQuestionIndex = 0;
    let answeredCount = 0;
    let correctCount = 0;
    let timerInterval = null;
    let timeLeft = 20;
    let incorrectQuestions = [];

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

    // Update questionCount max value dynamically
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

    // Attach event listeners to update max when range changes
    startTable.addEventListener('input', updateMaxQuestions);
    endTable.addEventListener('input', updateMaxQuestions);

    // Start practice
    startBtn.addEventListener('click', function () {
        const start = parseInt(startTable.value);
        const end = parseInt(endTable.value);

        // Validate input ranges
        if (start < 1 || start > 12) {
            alert('Start table must be between 1 and 12!');
            return;
        }

        if (end < 1 || end > 12) {
            alert('End table must be between 1 and 12!');
            return;
        }

        if (start > end) {
            alert('Start table must be less than or equal to end table!');
            return;
        }

        const count = parseInt(questionCountInput.value);
        const maxAvailable = (end - start + 1) * 12;
        if (count < 1 || count > maxAvailable) {
            alert(`Number of questions must be between 1 and ${maxAvailable}!`);
            return;
        }

        // Generate questions
        generateQuestions(start, end, count);

        // Reset counters
        currentQuestionIndex = 0;
        answeredCount = 0;
        correctCount = 0;
        incorrectQuestions = [];

        // Update UI
        answeredCountElement.textContent = answeredCount;
        totalQuestionsElement.textContent = questions.length;
        correctCountElement.textContent = correctCount;

        // Show practice area
        practiceArea.classList.remove('hidden');

        // Scroll to questions
        practiceArea.scrollIntoView({ behavior: 'smooth' });

        // Display first question
        displayQuestion();
    });

    // Generate questions
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

    // Fisher-Yates shuffle
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Display current question
    function displayQuestion() {
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

                clearInterval(timerInterval);
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

    // Handle answer
    function handleAnswer(isTimeout = false) {
        clearInterval(timerInterval);
        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = parseInt(answerInput.value);

        if (isTimeout || isNaN(userAnswer)) {
            feedbackElement.textContent = `Time's up or no answer! The correct answer is ${currentQuestion.answer}.`;
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);
        } else if (userAnswer === currentQuestion.answer) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'correct';
            correctCount++;
            correctCountElement.textContent = correctCount;
        } else {
            feedbackElement.textContent = `Incorrect! The correct answer is ${currentQuestion.answer}.`;
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);
        }

        answeredCount++;
        answeredCountElement.textContent = answeredCount;
        currentQuestionIndex++;
    }

    // Next button
    nextBtn.addEventListener('click', function () {
        if (answerInput.value.trim() === '') {
            alert('Please enter an answer!');
            return;
        }

        handleAnswer();
        displayQuestion();
    });

    // Enter key = submit
    answerInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            if (answerInput.value.trim() === '') {
                alert('Please enter an answer!');
                return;
            }

            handleAnswer();
            displayQuestion();
        }
    });

    // Initial update
    updateMaxQuestions();
});
