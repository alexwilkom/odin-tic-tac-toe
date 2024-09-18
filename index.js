function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push("_");
        }
    }

    const getBoard = () => board;

    const placeMark = (row, column, mark) => {
        if (board[row][column] === "_") {
            board[row][column] = mark;
        } else {
            return;
        }
    }

    const printBoard = () => {
        for (const row of board) {
            console.log(row);
        }
    }

    return {
        getBoard,
        printBoard,
        placeMark
    }
}

(function GameController(playerOneName = "Player 1", playerTwoName = "Player 2") {
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
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
    }
    const getActivePlayer = () => activePlayer;

    const playNewRound = () => {
        console.log(`${getActivePlayer().name}'s turn.`);
        gameBoard.printBoard();
    }

    const playTurn = (row, column) => {
        const board = gameBoard.getBoard();

        playNewRound();
        gameBoard.placeMark(row, column, getActivePlayer().mark);

        const checkWinner = () => {
            for (let i = 0; i < board.length; i++) {
                // check rows
                if (board[i][0] !== '_' && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
                    console.log(`${getActivePlayer().name} wins.`);
                    return;
                }
                // check columns
                if (board[0][i] !== '_' && board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
                    console.log(`${getActivePlayer().name} wins.`);
                    return;
                }
            }

            // check diagonals
            if (
                (board[0][0] !== '_' && board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
                (board[0][2] !== '_' && board[0][2] === board[1][1] && board[1][1] === board[2][0])
            ) {
                console.log(`${getActivePlayer().name} wins.`);
                return;
            }

            // Check for draw or ongoing game
            let isDraw = true;
            for (let i = 0; i < board.length; i++) {
                for (let j = 0; j < board.length; j++) {
                    if (board[i][j] === '_') {
                        isDraw = false;
                        break;
                    }
                }
            }

            if (isDraw) {
                console.log("It is a draw");
            }
        }

        checkWinner();
        switchActivePlayer();
    }

    return {
        playTurn,
        getActivePlayer
    }
})()
