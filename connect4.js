/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

class Game {
    constructor(p1,p2,height=6, width=7){
      this.players = [p1,p2];
      this.WIDTH = width;
      this.HEIGHT = height;
      this.currPlayer = p1; //active player: 1 or 2
      //this.addButtons();
      this.liveStatus = false;
      this.makeBoard();
      this.makeHtmlBoard();
      //console.log(this.players[0]);
      //this.board = []; // array of rows, each row is array of cells  (board[y][x])
    }
    // makeBoard: create in-JS board structure board = array of rows, each row is array of cells
    makeBoard(){
      this.board = [];
      for (let y = 0; y < this.HEIGHT; y++){
        this.board.push(Array.from({length: this.WIDTH}));
      }
    }
    
    // makeHtmlBoard: make HTML table and row of column tops
    makeHtmlBoard(){

      //const gameSpace = document.getElementById('game');
      
      const board = document.getElementById('board');
      // make column tops (clickable area for adding a piece to that column)
      const top = document.createElement('tr');
      top.setAttribute('id', 'column-top');

      top.addEventListener('click', this.handleClick.bind(this));

      for (let x = 0; x < this.WIDTH; x++) {
        const headCell = document.createElement('td');
        headCell.setAttribute('id', x);
        top.append(headCell);
      }
      board.append(top);

      // make main part of board
      for (let y = 0; y < this.HEIGHT; y++) {
        const row = document.createElement('tr');

        for (let x = 0; x < this.WIDTH; x++) {
          const cell = document.createElement('td');
          cell.setAttribute('id', `${y}-${x}`);
          row.append(cell);
        }

        board.append(row);  
      }

      //make start & new game buttons and append to the board
      const btnStart = document.createElement('button');
        btnStart.innerText = "START GAME";
        btnStart.classList.add('button');
        btnStart.addEventListener("click", this.startButton.bind(this));

        board.append(btnStart);
      const btnNewGame = document.createElement('button');
        btnNewGame.innerText = "NEW GAME";
        btnNewGame.classList.add('button');
        btnNewGame.addEventListener("click", this.newGameButton.bind(this));

        board.append(btnNewGame);
    }
    startButton(evt){
      if(this.checkForWin()){
        location.reload();
      } else {this.liveStatus = true;}
    }
    newGameButton(evt){
      location.reload();
    }
    /** findSpotForCol: given column x, return top empty y (null if filled) */
    findSpotForCol(x){
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
          if (!this.board[y][x]) {
            return y;
          }
        }
        return null;
    }

    /** placeInTable: update DOM to place piece into HTML table of board */
    placeInTable(y,x){

      const piece = document.createElement('div');
      piece.classList.add('piece');
      //piece.style.backgroundColor = this.currPlayer.color;
      piece.style.backgroundColor = this.currPlayer === this.players[0] ? this.players[0].color.value: this.players [1].color.value;
      piece.style.top = -50 * (y + 2);
  
      const spot = document.getElementById(`${y}-${x}`);
      spot.append(piece);
    }

    //endGame: announce game end
    endGame(msg){
      alert(msg);
    }

    // handleClick: handle click of column top to play piece 
    handleClick(evt){
      //get x from ID of clicked cell
      if(!this.liveStatus){
        return;
      };

      const x = +evt.target.id;
 
      //get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y===null){
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y,x);

      // check for win
      if (this.checkForWin()){
        this.liveStatus = false;
        return this.endGame(`${this.currPlayer.color.value} team wins!`);
      }

      // check for tie
      if(this.board.every(row => row.every(cell => cell))){
        return this.endGame('Tie!');
      }

      this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    // checkForWin: check board cell-by-cell for 'does a win start here'
    checkForWin(){
      const _win = cells =>
        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer
        cells.every(
          ([y, x]) =>
            y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH &&
            this.board[y][x] === this.currPlayer
        );
      
      for (let y = 0; y < this.HEIGHT; y++) {
        for (let x = 0; x < this.WIDTH; x++) {
          // get "check list" of 4 cells (starting here) for each of the different
          // ways to win
          const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
          const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
          const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
          const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
    
          // find winner (only checking each win-possibility as needed)
          if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
            return true;
          }
        }
      }
    };
};

class Player{
  constructor(color){
    this.color = color;
  }
}

let color1 = document.querySelector('input[name = "color1"]');
let color2 = document.querySelector('input[name = "color2"]');

const p1 = new Player(color1);
const p2 = new Player (color2);

let myGame = new Game(p1,p2)
