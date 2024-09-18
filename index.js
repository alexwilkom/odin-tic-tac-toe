function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

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

    return {
        getBoard,
        placeMark
    }
}

function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
    const gameBoard = GameBoard();
    const players = [
        {
            name: playerOneName,
            mark: "X"
        },
        {
            name: playerTwoName,
            mark: "O"
        }
    ];

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

        const checkWinner = () => {
            for (let i = 0; i < board.length; i++) {
                // Check rows
                if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                    gameOver = true;
                    return `${getActivePlayer().name} wins!`;
                }
                // Check columns
                if (board[0][i] !== "" && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                    gameOver = true;
                    return `${getActivePlayer().name} wins!`;
                }
            }
            // Check diagonals
            if (
                (board[0][0] !== "" && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
                (board[0][2] !== "" && board[0][2] === board[1][1] && board[1][1] === board[2][0])
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

            return null;  // <-- Return null if no winner or draw
        }

        const outcome = checkWinner();
        if (!gameOver) switchActivePlayer();  // <-- Only switch player if game isn't over
        return outcome;  // <-- Return the outcome (winner or draw message)
    }

    return {
        playTurn,
        getActivePlayer,
        getBoard: gameBoard.getBoard
    }
}

(function DisplayController() {
    const game = GameController();
    const board = game.getBoard();

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
            gameOutcome = game.playTurn(row, column);  // <-- Get the outcome from playTurn
            if (gameOutcome) {
                messageDisplay.textContent = gameOutcome;  // <-- Clear the turn message when game ends
            }
        }
        updateDisplay();

    }
    gridDisplay.addEventListener("click", clickHandlerBoard);

    // Initial rendering
    updateDisplay();
})()