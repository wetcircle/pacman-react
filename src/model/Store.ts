import { observable, action } from 'mobx';
import { Game } from './Game';
// import { Maze } from './Maze';
import { DebugState } from './DebugState';
import io from 'socket.io-client';

export class Store {

  private static _instance: Store | null = null;

  public static getInstance(): Store {
    if (this._instance === null) {
      this._instance = new Store();
    }
    return this._instance;
  }

  private constructor() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
      this.socket.emit('user_connected');
    });
  }

  @observable
  game: Game = new Game(this);

  debugState = new DebugState(this);

  socket = io("http://localhost:3002", {
    withCredentials: true,
  });
  
  
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

  }

}
