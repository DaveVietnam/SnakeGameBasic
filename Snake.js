//SNAKE
export class Snake {
  constructor(size, startX, startY) {
    this.body = [
      { x: startX, y: startY }, //head
      { x: startX, y: startY + 1 }, //body
    ];
    this.direction = "up";
    this.newDirection = "up";
    this.size = size;
  }

  //checking the direction
  changeDirection(newDirection) {
    // We check if the new direction is not the opposite of the current one.
    if (newDirection === "up" && this.direction !== "down") {
      this.newDirection = "up"; // Set new direction to up
    }
    if (newDirection === "down" && this.direction !== "up") {
      this.newDirection = "down"; // Set new direction to down
    }
    if (newDirection === "left" && this.direction !== "right") {
      this.newDirection = "left"; // Set new direction to left
    }
    if (newDirection === "right" && this.direction !== "left") {
      this.newDirection = "right"; // Set new direction to right
    }
  }

  //Making the snake move
  move(isGrowing = false) {
    //The snake updates its direction before moving
    this.direction = this.newDirection;

    //Get the currect position of the head
    const head = this.body[0]; //just a reference to the first element of the array
    let newHead; //variable to store the new head position, that will replace the first element

    //determine the new position of the head based on the direction
    switch (this.direction) {
      case "up":
        newHead = { x: head.x, y: head.y - 1 };
        break;
      case "down":
        newHead = { x: head.x, y: head.y + 1 };
        break;
      case "left":
        newHead = { x: head.x - 1, y: head.y };
        break;
      case "right":
        newHead = { x: head.x + 1, y: head.y };
        break;
    }

    this.body.unshift(newHead); //add a newHead to the front of the body element(thus replplacing the old head),

    //removing the last element of the body(tail)
    if (!isGrowing) {
      this.body.pop();
    }

    // basically, a new head becomes the head, and the old one becomes the body part while the tail (last element) gets removed, that's how the body always follows the head

    /* shifting the body(following the head)
    for (let i = this.body.length - 1; i > 0; i--) {
      this.body[i] = { ...this.body[i - 1] }; //taking the position of the element ahead
    } //Don't need this anymore because we used  this.body.unshift(newHead); and this.body.pop();*/
  }

  grow() {
    const lastSegment = this.body[this.body.length - 1];
    this.body.push({ ...lastSegment }); //adding a new segment to the snakes body
  }

  getHead() {
    return this.body[0];
  }

  getBody() {
    return this.body;
  }

  //Draw the snake on the board
  draw(board) {
    this.body.forEach((segment, index) => {
      if (
        segment.x >= 0 &&
        segment.x < this.size &&
        segment.y >= 0 &&
        segment.y < this.size
      ) {
        const cellIndex = segment.y * this.size + segment.x; //calculating the index of the cell with the snake
        const cell = board[cellIndex];
        console.log(`segment: ${segment.x}, ${segment.y}; index: ${index}`);
        if (index === 0) {
          cell.classList.add("snake_head");
        } else {
          cell.classList.add("snake");
        }
      }
    });
  }

  // Clear the snake from the game board
  clear(board) {
    this.body.forEach((segment) => {
      if (
        segment.x >= 0 &&
        segment.x < this.size &&
        segment.y >= 0 &&
        segment.y < this.size
      ) {
        const cellIndex = segment.y * this.size + segment.x;
        const cell = board[cellIndex];
        cell.classList.remove("snake_head");
        cell.classList.remove("snake");
      }
    });
  }
}
