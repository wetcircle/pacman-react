import { action, computed, observable } from 'mobx';
import { Ghost } from './Ghost';
import { makeGhosts, resetGhosts } from './makeGhosts';
import { Maze } from './Maze';
import { getPillsMatrix } from "./MazeData";
import { PacMan, resetPacMan, respawnPacMan } from './PacMan';
import { MilliSeconds, PixelsPerFrame } from './Types';
import { Store } from './Store';
import { TimeoutTimer } from './TimeoutTimer';
import { Socket } from 'socket.io-client';

export const DEFAULT_SPEED = 5;

const ENERGIZER_DURATION: MilliSeconds = 5000;

export class Game {
  constructor(store: Store) {
    this.store = store;
    this.pacMan = new PacMan(this);
    this.ghosts = makeGhosts(this);
  }

  store: Store;

  //** The timestamp we got from requestAnimationFrame().
  @observable
  externalTimeStamp: MilliSeconds | null = null;

  @observable
  timestamp: MilliSeconds = 0;

  @observable
  lastFrameLength: MilliSeconds = 17;

  @observable
  frameCount = 0;

  @observable
  gamePaused = false;

  speed: PixelsPerFrame = DEFAULT_SPEED;

  ghosts: Ghost[];

  pacMan: PacMan;

  @observable
  score = 0;

  @observable
  killedGhosts = 0;

  @observable
  resetCount: number = 0;


  maze = new Maze();

  // Add this observable property to the Game class
  @observable
  isReady = false;

  // Add this action to the Game class
  @action
  setReady(ready: boolean) {
    this.isReady = ready;
  }

  // Add this method to the Game class
  showReadyMessage() {
    this.setReady(true);
    this.gamePaused = true;
    setTimeout(() => {
      this.setReady(false);
      this.gamePaused = false;
    }, 3000);
  }


  @action.bound
  revivePacMan() {
    this.pacMan.send('REVIVED');
    this.timestamp = 0;
    resetPacMan(this.pacMan);
    resetGhosts(this.ghosts);
  }

  // If player completes level
  @action.bound
  resetLevel() {
    respawnPacMan(this.pacMan);
    resetGhosts(this.ghosts);

    // Reset the maze & pills layer
    this.maze = new Maze();
    this.maze.pills = getPillsMatrix();
    this.showReadyMessage();
  }

  @computed
  get gameOver(): boolean {
    const pacMan = this.pacMan;
    return pacMan.dead && pacMan.extraLivesLeft === 0;
  }

  energizerTimer = new TimeoutTimer(ENERGIZER_DURATION, () => {
    this.handleEnergizerTimedOut();
  });

  @action
  handleEnergizerTimedOut() {
    this.pacMan.send('ENERGIZER_TIMED_OUT');
    for (const ghost of this.ghosts) {
      ghost.send('ENERGIZER_TIMED_OUT');
    }
  }

  readyGameForPlay() {
    resetPacMan(this.pacMan);
    this.showReadyMessage();
  }
}
