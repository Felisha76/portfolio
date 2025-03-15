document.addEventListener('DOMContentLoaded', function() {
    // Populate dropdown lists
    const startTable = document.getElementById('startTable');
    const endTable = document.getElementById('endTable');
    
    for (let i = 1; i <= 12; i++) {
        const startOption = document.createElement('option');
        startOption.value = i;
        startOption.textContent = i;
        startTable.appendChild(startOption);
        
        const endOption = document.createElement('option');
        endOption.value = i;
        endOption.textContent = i;
        endTable.appendChild(endOption);
    }
    
    // Default selections
    startTable.value = 1;
    endTable.value = 12;
    
    // Variables to track state
    let questions = [];
    let currentQuestionIndex = 0;
    let answeredCount = 0;
    let correctCount = 0;
    let timerInterval = null;
    let timeLeft = 20;
    let incorrectQuestions = [];
    
    // DOM elements
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
    
    // Start practice
    startBtn.addEventListener('click', function() {
        const start = parseInt(startTable.value);
        const end = parseInt(endTable.value);
        
        if (start > end) {
            alert('Start table must be less than or equal to end table!');
            return;
        }
        
        const count = parseInt(document.getElementById('questionCount').value);
        if (count < 10 || count > 100) {
            alert('Number of questions must be between 10 and 100!');
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
        
        // Display first question
        displayQuestion();
    });
    
    // Generate questions
    function generateQuestions(start, end, count) {
        const allPossibleQuestions = [];
        
        // Generate all possible questions in the range
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
        
        // Shuffle the questions
        shuffleArray(allPossibleQuestions);
        
        // Take the requested number of questions
        questions = allPossibleQuestions.slice(0, count);
    }
    
    // Fisher-Yates shuffle algorithm
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
            answerInput.focus();
            
            // Start timer if enabled
            if (timerEnabled.checked) {
                timeLeft = 20;
                timerDisplay.textContent = `Time left: ${timeLeft}s`;
                timerDisplay.classList.remove('hidden');
                
                clearInterval(timerInterval);
                timerInterval = setInterval(function() {
                    timeLeft--;
                    timerDisplay.textContent = `Time left: ${timeLeft}s`;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        handleAnswer(false);
                    }
                }, 1000);
            } else {
                timerDisplay.classList.add('hidden');
            }
        } else {
            // If there are incorrect questions, ask them again
            if (incorrectQuestions.length > 0) {
                questions = [...incorrectQuestions];
                incorrectQuestions = [];
                currentQuestionIndex = 0;
                displayQuestion();
            } else {
                // Practice completed
                clearInterval(timerInterval);
                questionElement.textContent = 'Practice completed!';
                answerInput.value = '';
                answerInput.disabled = true;
                nextBtn.disabled = true;
                feedbackElement.textContent = `You got ${correctCount} out of ${answeredCount} correct!`;
                feedbackElement.className = 'correct';
            }
        }
    }
    
    // Handle answer submission
    function handleAnswer(isTimeout = false) {
        clearInterval(timerInterval);
        
        const currentQuestion = questions[currentQuestionIndex];
        const userAnswer = parseInt(answerInput.value);
        
        if (isTimeout || isNaN(userAnswer)) {
            feedbackElement.textContent = 'Time's up! Try again later.';
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);
        } else if (userAnswer === currentQuestion.answer) {
            feedbackElement.textContent = 'Correct!';
            feedbackElement.className = 'correct';
            correctCount++;
            correctCountElement.textContent = correctCount;
        } else {
            feedbackElement.textContent = `Incorrect! The answer is ${currentQuestion.answer}.`;
            feedbackElement.className = 'incorrect';
            incorrectQuestions.push(currentQuestion);
        }
        
        answeredCount++;
        answeredCountElement.textContent = answeredCount;
        currentQuestionIndex++;
    }
    
    // Next button click handler
    nextBtn.addEventListener('click', function() {
        if (answerInput.value.trim() === '') {
            alert('Please enter an answer!');
            return;
        }
        
        handleAnswer();
        displayQuestion();
    });
    
    // Allow pressing Enter to submit answer
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            if (answerInput.value.trim() === '') {
                alert('Please enter an answer!');
                return;
            }
            
            handleAnswer();
            displayQuestion();
        }
    });
});
