import { observable, action } from 'mobx';
import { Game } from './Game';
// import { Maze } from './Maze';
import { DebugState } from './DebugState';

export class Store {
  @observable
  game: Game = new Game(this);

  debugState = new DebugState(this);

  @action.bound
  resetGame() {
    this.game = new Game(this);
    this.game.readyGameForPlay();
  }

  // Reset the maze and pac-man and ghost positions
  // TODO: Add animation?
  @action.bound
  resetLevel() {
  // Reset level
  this.game.resetLevel();
  this.game.resetCount++; // Increment the resetCount here
    console.log(this.game.resetCount);
  }

}
