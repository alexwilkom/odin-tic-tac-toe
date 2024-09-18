// Gameboard
function Gameboard() {
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

    const placeMark = (row, column) => {
        if (board[row][column] === "_") {
            board[row][column] = "X";
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

const game = Gameboard();
game.printBoard();
console.log("-----------------")
game.placeMark(1, 1);
game.printBoard();
console.log("-----------------")
game.placeMark(0, 0);
game.printBoard();
console.log("-----------------")
game.placeMark(1, 1);
game.printBoard();

// Cell

// Gamecontroller
