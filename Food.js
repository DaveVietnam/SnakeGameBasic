export class Food {
  constructor(size, snakeBody) {
    this.size = size;
    this.snakeBody = snakeBody;
    this.position = this.generateFood();
  }

  //GENERATING THE FOOD
  generateFood() {
    let position;
    do {
      position = {
        x: Math.floor(Math.random() * this.size), //a rounded random nu,ber between 0 and 20
        y: Math.floor(Math.random() * this.size),
      };
    } while (
      this.snakeBody.some(
        (segment) => segment.x === position.x && segment.y === position.y
      )
    );
    return position;

    /* If the food position overlaps with a snake segment, the while loop continues, and a new random position is generated. This ensures that the food never spawns inside the snake’s body. Returning the Position:
    Once a valid, non-overlapping position is found, the method returns the position as an object containing the x and y coordinates.*/
  }

  //GENERATING THE NEW FOOD POSITION WHEN THE OLD ONE IS EATEN
  generateNewFood(snakeBody) {
    this.snakeBody = snakeBody;
    this.position = this.generateFood();
  }

  //drawing the food on the board
  draw(board) {
    const index = this.position.y * this.size + this.position.x;
    const cell = board[index];
    cell.classList.add("food");
  }

  clear(board) {
    const index = this.position.y * this.size + this.position.x;
    const cell = board[index];
    cell.classList.remove("food");
  }
}
