import { Food } from "/Food.js";
import { GameBoard } from "/GameBoard.js";
import { Snake } from "/Snake.js";
import { Score } from "/Score.js";

//THE GAME
class Game {
  constructor(size) {
    this.size = size;
    this.gameContainer = document.getElementById("game_container");
    this.boardGame = new GameBoard(size, this.gameContainer);
    this.score = new Score(this.gameContainer);
    this.snake = new Snake(size, Math.floor(size / 2), Math.floor(size / 2)); //x:10, y:10
    this.food = new Food(size, this.snake.getBody());
    this.gameOverMessage = null;
    this.pauseMessage = null;
    this.gameInterval = null;
    this.gameSpeed = 800;
    this.gameStarted = false;
    this.paused = false;
    this.init();
  }

  //Initializing the Game on click
  init() {
    if (this.gameOverMessage) {
      this.gameOverMessage.remove();
      this.gameOverMessage = null;
    }

    this.gameStarted = true;
    this.gameContainer.addEventListener("click", () => {
      this.gameSpeedInterval(this.gameSpeed); //with refular "function" in this callback, "this" here points to this.gameContainer above, which, in turn, doesnt have startGame() method, so we used an arrow function that doesnt have its own "this" and refers to the enclosing scope (the Game instance)
    });
  }

  //Game's speed
  gameSpeedInterval(gameSpeed) {
    if (this.gameSpeedInterval) clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => {
      if (!this.paused) this.update();
    }, gameSpeed);
  }

  reset() {
    // Clear any previous game over message
    if (this.gameOverMessage) {
      this.gameOverMessage.remove();
      this.gameOverMessage = null;
    }

    // Reset the score
    this.score.updateCurrentScore(0);
    this.score.updateHighestScore(localStorage.getItem("highestScore") || 0);

    // Reset the snake and food
    this.snake.clear(this.boardGame.cells);
    this.food.clear(this.boardGame.cells);
    this.snake = new Snake(
      this.size,
      Math.floor(this.size / 2),
      Math.floor(this.size / 2)
    );
    this.food = new Food(this.size, this.snake.getBody());
    this.gameSpeed = 800;

    // Restart the game loop
    clearInterval(this.gameInterval); // Stop the previous game loop
    this.init(); // Start a new game
  }

  showGameOver() {
    // Create a custom game over message
    if (!this.gameOverMessage) {
      this.gameOverMessage = document.createElement("div");
      this.gameOverMessage.classList.add("game-over");

      this.gameOverMessage.textContent = "Game Over! Press 'R' to restart.";
      this.gameContainer.appendChild(this.gameOverMessage);
      this.gameStarted = false;

      //the fade-in-effect
      setTimeout(() => {
        this.gameOverMessage.classList.add("show");
      }, 10);
    }
  }

  showPauseMessage() {
    if (!this.pauseMessage) {
      this.pauseMessage = document.createElement("div");
      this.pauseMessage.classList.add("game-paused");

      this.pauseMessage.textContent = `Game is paused! Press "P" to continue!`;
      this.gameContainer.appendChild(this.pauseMessage);
    }
  }

  togglePause() {
    this.paused = !this.paused;

    if (this.paused) {
      // Pause the game
      clearInterval(this.gameInterval);
      this.showPauseMessage();
    } else {
      if (!this.paused) {
        this.pauseMessage.remove();
        this.pauseMessage = null;
      }
      // Resume the game
      this.gameSpeedInterval(this.gameSpeed); // Restart the interval
    }
  }

  //updating the game
  update() {
    if (this.checkCollision()) {
      this.showGameOver();
      return;
    }
    //Check if the snake's head collides with the food
    if (
      this.snake.getHead().x === this.food.position.x &&
      this.snake.getHead().y === this.food.position.y
    ) {
      //Snake eats the food and  grow method applies
      this.snake.grow(); //
      //Increasing the speed
      this.gameSpeed = Math.max(200, this.gameSpeed - 50); //never below 200ms
      this.gameSpeedInterval(this.gameSpeed);
      console.log(this.gameSpeed);
      this.food.clear(this.boardGame.cells);
      this.food.generateNewFood(this.snake.getBody()); //new food is generated
      this.score.updateCurrentScore(this.score.currentScore + 1); //updating the score
      this.score.updateHighestScore(this.score.currentScore);
    }
    this.snake.clear(this.boardGame.cells);
    this.snake.move();
    this.snake.draw(this.boardGame.cells);
    this.food.draw(this.boardGame.cells);
  }

  checkCollision() {
    //checking for collissions or out-of-bounds
    const head = this.snake.getHead();
    if (
      head.x < 0 ||
      head.x >= this.size ||
      head.y < 0 ||
      head.y >= this.size
    ) {
      return true;
    } else if (
      this.snake
        .getBody()
        .slice(1) //starting from element 1 (skipping the head[0])
        .some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      return true;
    }
  }
}

export default Game;

//INTIALIZING THE GAME
const game = new Game(20);

//ADDING KEY THE PRESSING EVENT (first intializing the game to access its preperties)
document.addEventListener("keydown", (event) => {
  event.preventDefault();
  const key = event.key;
  if (key === "ArrowUp") {
    game.snake.changeDirection("up");
  } else if (key === "ArrowDown") {
    game.snake.changeDirection("down");
  } else if (key === "ArrowLeft") {
    game.snake.changeDirection("left");
  } else if (key === "ArrowRight") {
    game.snake.changeDirection("right");
  }
});

// Handle keyboard input for restarting the game
document.addEventListener("keydown", (e) => {
  if (e.key === "r" || e.key === "R") {
    game.reset(); // Reset the game when 'R' is pressed
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") {
    game.togglePause();
    console.log("the game is paused");
    console.log(this.paused);
    console.log(this.pauseMessage);
  }
});

/*
Purpose of newDirection:

The main reason we need the newDirection variable is to prevent the snake from immediately reversing direction. Without this, if the player presses an opposite direction (like “up” when the snake is moving “down”), the snake would flip around and crash into itself. We want to control this behavior by allowing direction changes only in certain conditions.
08:10 pm


Why We Need Both direction and newDirection:

• this.direction: The current direction in which the snake is moving. This is used to determine how the snake moves and how the body follows the head.
• this.newDirection: A temporary variable that stores the desired direction based on user input. This is what we update in changeDirection but don’t apply until the next move. It acts as a buffer to prevent immediate direction reversal.
 */

/*Let’s walk through the iteration where we shift the body parts in more detail. The goal of this iteration is to move each body part one position forward in the snake’s body, so they follow the head’s movement.

Snake Body Example

Suppose the snake’s body is represented like this:

this.body = [
{ x: 5, y: 5 }, // head
{ x: 4, y: 5 }, // first body segment
{ x: 3, y: 5 }, // second body segment
{ x: 2, y: 5 } // tail
];

The head is at index 0, the first body segment is at index 1, the second body segment is at index 2, and the tail is at index 3.

Objective:

When the snake moves, each body segment should take the position of the one ahead of it, and the head will move to a new position based on the user input (using the arrow keys).

Loop Explanation

Here’s the loop in the code you sent:

for (let i = this.body.length - 1; i > 0; i--) {
// Start from the second-to-last element to the tail
this.body[i] = { ...this.body[i - 1] }; // Each body part moves to the position of the one ahead of it
}

1. let i = this.body.length - 1; i > 0; i--

• this.body.length - 1: This is the index of the tail (the last segment of the body). If the body has 4 segments, this.body.length will be 4, so this.body.length - 1 equals 3, which is the index of the tail.
• i > 0: The loop will continue until i is greater than 0, meaning it stops right before the head. We don’t need to move the head here, because it moves separately based on user input.
• i--: We decrease i after each iteration, so the loop moves backwards through the body. We start from the tail and work towards the head.

2. Body Shifting Logic

Inside the loop:

this.body[i] = { ...this.body[i - 1] };

This line updates the current body part (this.body[i]) to take the position of the body part just ahead of it (this.body[i - 1]). The spread operator { ...this.body[i - 1] } creates a shallow copy of the position of the previous body part and assigns it to the current one. This ensures that the body part “moves” to the position of the segment ahead of it.

Step-by-Step Example

Let’s go through the loop step by step using the initial body state:

this.body = [
{ x: 5, y: 5 }, // head
{ x: 4, y: 5 }, // first body segment
{ x: 3, y: 5 }, // second body segment
{ x: 2, y: 5 } // tail
];

1. First Iteration (i = 3):
• The loop starts from the tail (this.body[3]), which is { x: 2, y: 5 }.
• We update this.body[3] to be the same as the segment just ahead of it (this.body[2]), which is { x: 3, y: 5 }.
• After the first iteration, the body looks like this:

this.body = [
{ x: 5, y: 5 }, // head
{ x: 4, y: 5 }, // first body segment
{ x: 3, y: 5 }, // second body segment
{ x: 3, y: 5 } // tail (moved to the second body segment's position)
];

2. Second Iteration (i = 2):
• Now the second-to-last segment (this.body[2]), which was { x: 3, y: 5 }, will take the position of the first body segment (this.body[1]), which is { x: 4, y: 5 }.
• After the second iteration, the body looks like this:

this.body = [
{ x: 5, y: 5 }, // head
{ x: 4, y: 5 }, // first body segment (position hasn't changed yet)
{ x: 4, y: 5 }, // second body segment (moved to the first body segment's position)
{ x: 3, y: 5 } // tail
];

3. Third Iteration (i = 1):
• Finally, the first body segment (this.body[1]), which was { x: 4, y: 5 }, will move to the position of the head (this.body[0]), which is { x: 5, y: 5 }.
• After the third iteration, the body looks like this:

this.body = [
{ x: 5, y: 5 }, // head (position hasn't changed yet)
{ x: 5, y: 5 }, // first body segment (moved to the head's position)
{ x: 4, y: 5 }, // second body segment
{ x: 3, y: 5 } // tail
];

Result:

At this point, we’ve successfully shifted the body, but the head hasn’t moved yet. The head’s position will be updated based on the player’s input (e.g., using arrow keys), and after updating the head, the body will follow it in the next iteration.

Why Do We Loop Backwards?

We loop backwards through the body because we want to preserve the order of the segments. By
08:28 pm


starting from the tail and moving towards the head, each segment takes the position of the one ahead of it, so the entire body “follows” the head.

Summary:

• The loop starts at the tail (this.body[this.body.length - 1]) and goes backward toward the second body part (this.body[1]).
• Each body part moves to the position of the one ahead of it, ensuring the body follows the head.
• The head itself is updated separately (usually based on user input), and its position doesn’t get updated in this loop.

This mechanism ensures that the snake’s body moves smoothly and follows the head without jumping or losing segments.
08:28 pm
*/
