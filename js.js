// Prime Number Game Logic
let gameState = {
    player1Name: '',
    player2Name: '',
    player1Score: 0,
    player2Score: 0,
    currentPlayer: 1,
    timeLeft: 30,
    timerInterval: null,
    numbers: [],
    primeNumbers: new Set()
};

function isPrime(num) {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
}

function generateNumbers() {
    const ranges = [[100, 200], [200, 300], [300, 400], [400, 500]];
    const numbers = [];
    const primes = new Set();
    
    for (let i = 0; i < 25; i++) {
        const range = ranges[Math.floor(Math.random() * ranges.length)];
        const num = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
        numbers.push(num);
        if (isPrime(num)) {
            primes.add(num);
        }
    }
    
    return { numbers, primes };
}

function startGame() {
    const p1Name = document.getElementById('player1-name').value.trim() || 'Player 1';
    const p2Name = document.getElementById('player2-name').value.trim() || 'Player 2';
    
    gameState.player1Name = p1Name;
    gameState.player2Name = p2Name;
    gameState.player1Score = 0;
    gameState.player2Score = 0;
    gameState.currentPlayer = 1;
    gameState.timeLeft = 30;
    
    const { numbers, primes } = generateNumbers();
    gameState.numbers = numbers;
    gameState.primeNumbers = primes;
    
    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('game-play').style.display = 'block';
    document.getElementById('game-over').style.display = 'none';
    
    document.getElementById('player1-info').querySelector('div:first-child').textContent = p1Name;
    document.getElementById('player2-info').querySelector('div:first-child').textContent = p2Name;
    
    renderGrid();
    updateDisplay();
    startTimer();
}

function renderGrid() {
    const grid = document.getElementById('number-grid');
    grid.innerHTML = '';
    
    gameState.numbers.forEach((num, index) => {
        const button = document.createElement('button');
        button.textContent = num;
        button.id = `num-${index}`;
        button.style.cssText = `
            padding: 20px;
            font-size: 1.2em;
            font-weight: bold;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            transition: all 0.3s;
        `;
        button.onclick = () => selectNumber(num, index);
        button.onmouseenter = function() {
            if (!this.disabled) {
                this.style.background = '#f3f4f6';
                this.style.transform = 'scale(1.05)';
            }
        };
        button.onmouseleave = function() {
            if (!this.disabled && !this.classList.contains('selected')) {
                this.style.background = 'white';
                this.style.transform = 'scale(1)';
            }
        };
        grid.appendChild(button);
    });
}

function selectNumber(num, index) {
    const button = document.getElementById(`num-${index}`);
    if (button.disabled) return;
    
    const isCorrect = gameState.primeNumbers.has(num);
    
    if (isCorrect) {
        button.style.background = '#dcfce7';
        button.style.borderColor = '#16a34a';
        button.style.color = '#166534';
        if (gameState.currentPlayer === 1) {
            gameState.player1Score++;
        } else {
            gameState.player2Score++;
        }
    } else {
        button.style.background = '#fee2e2';
        button.style.borderColor = '#dc2626';
        button.style.color = '#991b1b';
    }
    
    button.disabled = true;
    button.style.cursor = 'not-allowed';
    updateDisplay();
    
    setTimeout(() => {
        gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
        gameState.timeLeft = 30;
        updateDisplay();
    }, 500);
}

function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer').textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
            gameState.timeLeft = 30;
            updateDisplay();
            
            const allSelected = gameState.numbers.every((_, i) => 
                document.getElementById(`num-${i}`).disabled
            );
            if (allSelected) {
                endGame();
            }
        }
    }, 1000);
}

function updateDisplay() {
    document.getElementById('player1-score').textContent = gameState.player1Score;
    document.getElementById('player2-score').textContent = gameState.player2Score;
    document.getElementById('timer').textContent = gameState.timeLeft;
    
    const currentTurnText = gameState.currentPlayer === 1 ? 
        `${gameState.player1Name}'s Turn` : `${gameState.player2Name}'s Turn`;
    document.getElementById('current-turn').textContent = currentTurnText;
    
    if (gameState.currentPlayer === 1) {
        document.getElementById('player1-info').style.transform = 'scale(1.05)';
        document.getElementById('player2-info').style.transform = 'scale(1)';
        document.getElementById('player1-info').style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
        document.getElementById('player2-info').style.boxShadow = 'none';
    } else {
        document.getElementById('player2-info').style.transform = 'scale(1.05)';
        document.getElementById('player1-info').style.transform = 'scale(1)';
        document.getElementById('player2-info').style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
        document.getElementById('player1-info').style.boxShadow = 'none';
    }
}

function endGame() {
    clearInterval(gameState.timerInterval);
    
    document.getElementById('game-play').style.display = 'none';
    document.getElementById('game-over').style.display = 'block';
    
    let winner = '';
    if (gameState.player1Score > gameState.player2Score) {
        winner = `${gameState.player1Name} Wins!`;
    } else if (gameState.player2Score > gameState.player1Score) {
        winner = `${gameState.player2Name} Wins!`;
    } else {
        winner = "It's a Tie!";
    }
    
    document.getElementById('winner-announcement').textContent = winner;
    document.getElementById('final-player1-name').textContent = gameState.player1Name;
    document.getElementById('final-player2-name').textContent = gameState.player2Name;
    document.getElementById('final-player1-score').textContent = gameState.player1Score;
    document.getElementById('final-player2-score').textContent = gameState.player2Score;
}

function resetGame() {
    clearInterval(gameState.timerInterval);
    gameState = {
        player1Name: '',
        player2Name: '',
        player1Score: 0,
        player2Score: 0,
        currentPlayer: 1,
        timeLeft: 30,
        timerInterval: null,
        numbers: [],
        primeNumbers: new Set()
    };
    
    document.getElementById('game-setup').style.display = 'block';
    document.getElementById('game-play').style.display = 'none';
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('player1-name').value = '';
    document.getElementById('player2-name').value = '';
}