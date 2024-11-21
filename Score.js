//SCORE
export class Score {
  constructor(container) {
    this.container = container;
    this.currentScore = 0;
    this.highestScore = this.loadHighestScore(); //display the highest score
    this.scores = this.createScoreElement();
    this.updateHighestScore(this.highestScore); //update the highest score
  }

  createScoreElement() {
    const scoreContainer = document.createElement("div");
    scoreContainer.classList.add("scores");

    let currentScoreElement = document.createElement("span");
    currentScoreElement.textContent = `CURRENT SCORE: ${this.currentScore}`;

    let highestScoreElement = document.createElement("span");
    highestScoreElement.textContent = `HIGHEST SCORE: ${this.highestScore}`;

    scoreContainer.appendChild(currentScoreElement);
    scoreContainer.appendChild(highestScoreElement);

    this.container.prepend(scoreContainer);

    //creating references to DOM for instances
    this.currentScoreElement = currentScoreElement;
    this.highestScoreElement = highestScoreElement;

    return scoreContainer;
  }

  updateCurrentScore(score) {
    this.currentScore = score;
    this.currentScoreElement.textContent = `CURRENT SCORE: ${this.currentScore}`;
  }

  updateHighestScore(score) {
    if (this.highestScore < this.currentScore) {
      this.highestScore = score;
      this.highestScoreElement.textContent = `CURRENT SCORE: ${this.currentScore}`;
      localStorage.setItem("highestScore", score);
    }
  }

  loadHighestScore() {
    return parseInt(localStorage.getItem("highestScore")) || 0; //coverting to an integer
  }
}
