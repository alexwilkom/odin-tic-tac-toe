function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push("");
        }
    }

    const getBoard = () => board;

    const placeMark = (row, column, mark) => {
        if (board[row][column] === "") {
            board[row][column] = mark;
        }
    }

    const resetBoard = () => {
        board = [];
    }

    return {
        getBoard,
        placeMark,
        resetBoard
    }
}

function GameController() {
    const gameBoard = GameBoard();
    const players = Players().getPlayers();

    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = () => activePlayer;

    let gameOver = false;  // <-- Added to track if the game is over

    const playTurn = (row, column) => {
        if (gameOver) return;  // <-- Prevent moves if the game is over

        const board = gameBoard.getBoard();
        gameBoard.placeMark(row, column, getActivePlayer().mark);

        const equals = (a, b, c) => (a === b && b == c);

        const checkWinner = () => {
            for (let i = 0; i < board.length; i++) {
                // Check rows
                if (board[i][0] !== "" && equals(board[i][0], board[i][1], board[i][2])) {
                    gameOver = true;
                    return `${getActivePlayer().name} wins!`;
                }
                // Check columns
                if (board[0][i] !== "" && equals(board[0][i], board[1][i], board[2][i])) {
                    gameOver = true;
                    return `${getActivePlayer().name} wins!`;
                }
            }
            // Check diagonals
            if (
                (board[0][0] !== "" && equals(board[0][0], board[1][1], board[2][2])) ||
                (board[0][2] !== "" && equals(board[0][2], board[1][1], board[2][0]))
            ) {
                gameOver = true;
                return `${getActivePlayer().name} wins!`;
            }
            // Check for draw or ongoing game
            let isDraw = true;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j] === '') {
                        isDraw = false;
                        break;
                    }
                }
            }
            if (isDraw) {
                gameOver = true;
                return "It is a draw!";
            }

            return null;
        }

        const outcome = checkWinner();
        if (!gameOver) switchActivePlayer();
        return outcome;
    }

    const resetGame = () => {
        gameBoard.resetBoard();
        activePlayer = players[0];
        gameOver = false;
    };

    return {
        gameBoard,
        playTurn,
        getActivePlayer,
        resetGame
    }
}

function Players() {
    const playerOneName = document.querySelector("#player-1").value.trim();
    const playerTwoName = document.querySelector("#player-2").value.trim();

    const players = [
        { name: playerOneName || "Player 1", mark: "X" },
        { name: playerTwoName || "Player 2", mark: "O" }
    ];

    const getPlayers = () => players;

    return { getPlayers };
}

function DisplayController() {
    const game = GameController();
    const board = game.gameBoard.getBoard();

    const messageDisplay = document.querySelector(".message");
    const gridDisplay = document.querySelector(".grid");

    let gameOutcome = null;

    const updateDisplay = () => {

        gridDisplay.innerHTML = "";

        // Only update the message if the game is not over (no outcome yet)
        if (!gameOutcome) {
            const activePlayer = game.getActivePlayer();
            messageDisplay.textContent = `${activePlayer.name}'s turn`;
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board.length; j++) {
                const button = document.createElement("button");
                button.setAttribute("type", "button");
                button.dataset.row = i;
                button.dataset.column = j;
                button.classList.add("cell");
                button.innerText = board[i][j];
                gridDisplay.appendChild(button);
            }
        }
    }

    const clickHandlerBoard = (event) => {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;
        if (!row) return;
        if (gameOutcome) return;

        if (board[row][column]) {
            return;
        } else {
            gameOutcome = game.playTurn(row, column);
            if (gameOutcome) {
                messageDisplay.textContent = gameOutcome;
            }
        }
        updateDisplay();

    }
    gridDisplay.addEventListener("click", clickHandlerBoard);

    // Initial rendering
    updateDisplay();

    return { updateDisplay }
}

(function GameUI() {
    const startContainer = document.querySelector('.start-game-container');
    const boardContainer = document.querySelector('.board-container');
    const startGameBtn = document.querySelector("#start-game-btn");
    const restartGameBtn = document.querySelector("#restart-game-btn");

    function toggleVisibility() {
        startContainer.classList.toggle('hidden');
        boardContainer.classList.toggle('hidden');
    }

    function setupEventListeners() {
        startGameBtn.addEventListener("click", (event) => {
            event.preventDefault();
            toggleVisibility();
            DisplayController();
        });

        restartGameBtn.addEventListener("click", () => {
            toggleVisibility();
            GameController().resetGame();
            DisplayController().updateDisplay();
        });
    }

    setupEventListeners();
})();
