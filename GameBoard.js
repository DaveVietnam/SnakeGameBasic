//GAMEBOARD
export class GameBoard {
  constructor(size, container) {
    this.size = size;
    this.container = container;
    this.board = this.createBoard();
    this.cells = [];
    this.createCells();
  }

  //creating the board
  createBoard() {
    const board = document.createElement("div");
    board.classList.add("game_board");
    this.container.appendChild(board);
    return board;
  }

  //creatng the cells
  createCells() {
    const totalCells = this.size * this.size;
    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index_x = i % this.size; //calculates the remainder of dividing i by this.size, so we have 0%20 = 0; 1%20 =1; 2%20 = 2 and so on.
      cell.dataset.index_y = Math.floor(i / this.size); // divides the index by this.size(20), and then rounds down the number: 233(index)/20 = 11.5 -> 11th row
      this.board.appendChild(cell);
      this.cells.push(cell);
    }
  }
}
