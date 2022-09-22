/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

/****  Function 1 *****/
const makeBoard = () => {
//Push a row filled with "null" number of times equal to "WIDTH", and repeat that number of times equal to "HEIGHT"
  for (i=0; i<HEIGHT; i++){
    board.push(Array(WIDTH).fill(null));
  };;
  return board;
};

/****  Function 2 *****/
/** makeHtmlBoard: make HTML table and row of column tops. */
const makeHtmlBoard = () => {
// get "htmlBoard" variable from the item in HTML w/ID of "board"
const htmlBoard = document.querySelector("#board");

  //create a new row with "column-top" id and adds an event listener to the row so that when clicked, will run "handeClick" 
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick); //refer to function 6

  //create number of columns equal to "WIDTH", with id equal to column number. Append to the new row.
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  //Append the new row of columns to the "htmlBoard"
  htmlBoard.append(top);

  //create number of new rows equal to "HEIGHT", append number of columns to each new row that is equal to "WIDTH".
  //Each cell in this grid will have assigned id that is equal to corresponding "column#-Row#"
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      cell.setAttribute("class", "container")
      row.append(cell);
    }
    //Append the grid to the "htmlBoard"
    htmlBoard.append(row);
  }
}

/****  Function 3 *****/
/** findSpotForCol: given column x, return top empty y (null if filled) */
const findSpotForCol = (x) => {
  // TODO: write the real version of this, rather than always returning 0
  //Check if the column is filled. If not filled, find first value in column (checking from bottom to top) with "null". Return y of value
  if (board[0][x]) {
    return null;
  }
  for (let y = HEIGHT - 1; y > -1; y--) {
    const val = board[y][x];
    if (val === null) {
      return y;
    }
  }
  };



/****  Function 4 *****/
/** placeInTable: update DOM to place piece into HTML table of board */
//Then update the "board" variable with player piece
const placeInTable = (y, x) => {
  //make a div and insert into correct table cell
  const playerClass = 'p'+currPlayer.toString();
  const piece = document.createElement("div");
  piece.classList.add("piece", playerClass);
  const tdInPlay = document.getElementById(`${y}-${x}`);
  tdInPlay.append(piece);

  //update the "board" with currPlayer value in location corresponding to the placed piece
  board[y][x]= currPlayer;
  
}


/****  Function 5 *****/
/** endGame: announce game end */
//add text to come down page that announces which player one, or if there is a tie.
const endGame = (msg) => {
  const winner = document.createElement("div");
  winner.setAttribute("id", "winner");
  winner.innerText= msg;
  document.getElementById('game').append(winner);
  if (currPlayer===1){
    winner.style.color= "red";
  } else {
    winner.style.color= "blue";
  };

  //add a button for restarting the game. Append button to a div, append the div to the "winner" div
  const refreshButton = document.createElement('BUTTON');
  refreshButton.setAttribute("id","button");
  refreshButton.innerText='Play Again?';
  const buttonDiv = document.createElement('div')
  buttonDiv.setAttribute('id','button-div')
	buttonDiv.appendChild(refreshButton);
  document.getElementById('game').appendChild(buttonDiv);
  refreshButton.addEventListener('click', refreshPage); //refer to function 11 

  //prevent further pieces from being clicked
  document.getElementById('column-top').removeEventListener("click", handleClick);
}


/****  Function 6 *****/
/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x); // refer to funciton 3
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x); //refer to function 4

  // check for win
  if (checkForWin()) { //refer to function 9
    return endGame(`Player ${currPlayer} won!`); //refer to function 5
  }
  

  // check for tie
checkForTie(); //refer to function 8


// switch currPlayer 1 <-> 2
  switchPlayer(); //refer to function 7
}


/****  Function 7 *****/
/** switchPlaers: switch players between 1 and 2 */
const switchPlayer = () => {currPlayer===1 ? currPlayer = 2 : currPlayer = 1};


/****  Function 8 *****/
/** checkForTie: check if all cells in board are filled; if so call, call endGame */
const checkForTie = () => {
  //intitialize a count for how many rows are completely filled
  let count = 0
  for (let h = 0; h < HEIGHT; h++) {
    //add a count for every "board" row that doesn't contain the value "null"
    if (board[h].every( val => (val !== null))){
      count++
    };
  };
  //if all 6 rows are filled with numbers and there are no "null" values, return end the game as a tie
    if (count===6){
      return endGame("It's a tie!") //refer to function 5
  };
};


/****  Function 9 *****/
/** checkForWin: check board cell-by-cell for "does a win start here?" */
const checkForWin = () => {

  /****  Function 10 *****/
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
//for every cell location in the "board" matrix (producing all cells row by row, top to bottom)...
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      //produce 4 arrays of length 4 that each start with the current cell and then include 3 sequentional cell locations (the next 3 values either go right, down, or down diagonaly left/right 
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      //if one of the four arrays has every cell meet every criteria in the _win function, the function returns true inside function 6 and will trigger an alert
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {  //refer to function 10
        return true;
      }
    }
  }
}


  /****  Function 11 *****/
  //function refreshPage
  const refreshPage = () => {
    location.reload();
  }


makeBoard(); //refer to function 1
makeHtmlBoard(); //refer to function 2
