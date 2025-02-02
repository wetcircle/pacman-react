import { observable, action, computed } from 'mobx';
import { Interpreter, ResolveTypegenMeta, TypegenDisabled, BaseActionObject, ServiceMap, State, StateValue } from 'xstate';

import { Direction, MilliSeconds } from './Types';
import {
  tileFromScreen,
  screenFromTile,
  TileCoordinates,
  ScreenCoordinates,
  assertValidTileCoordinates,
} from './Coordinates';
import {
  makePacManStateChart,
  PacManEventType,
  INITIAL_PACMAN_STATE,
  PacManState,
  PacManContext,
  PacManStateSchema,
  PacManEvent
} from './PacManStateChart';
import { Game } from './Game';

export class PacMan {
  constructor(game: Game) {
    this.game = game;

    this.stateChart.onTransition(this.handleTransition);
    this.stateChart.start();

    this.stateChartState = this.stateChart.state;
  }

  @action.bound
  handleTransition(state: State<PacManContext, PacManEvent, PacManStateSchema, any, ResolveTypegenMeta<TypegenDisabled, PacManEvent, BaseActionObject, ServiceMap>>) {
    if (!state.changed) {
      return;
    }
    this.stateChartState = state;
  }

  game: Game;

  stateChart: Interpreter<PacManContext, PacManStateSchema, PacManEvent, any, ResolveTypegenMeta<TypegenDisabled, PacManEvent, BaseActionObject, ServiceMap>> = makePacManStateChart({
    onChasing: this.onChasing,
    onDead: this.onDead,
  });

  @observable.ref
  stateChartState: State<PacManContext, PacManEvent, PacManStateSchema, any, ResolveTypegenMeta<TypegenDisabled, PacManEvent, BaseActionObject, ServiceMap>>;

  @action.bound
  onChasing() {
    this.game.energizerTimer.start();
  }

  @action.bound
  onDead() {
    this.diedAtTimestamp = this.game.timestamp;
  }

  @computed
  get dead(): boolean {
    return this.stateChartState.matches('dead');
  }

  @computed
  get state(): StateValue {
    return this.stateChartState.value;
  }

  // Send data to server
  sendStateToServer() {
    this.game.sendActionToServer({
      type: 'stateUpdate',
      state: this.state,
    });
  }  

  send(event: PacManEventType) {
    this.stateChart.send(event);
  }

  @computed
  get alive() {
    return !this.dead;
  }

  @observable
  screenCoordinates: ScreenCoordinates = screenFromTile({ x: 1, y: 1 });

  @action
  setTileCoordinates(tile: TileCoordinates) {
    assertValidTileCoordinates(tile);
    this.screenCoordinates = screenFromTile(tile);
  }

  @computed
  get tileCoordinates(): TileCoordinates {
    return tileFromScreen(this.screenCoordinates);
  }

  @observable
  diedAtTimestamp: MilliSeconds = -1;

  @computed
  get timeSinceDeath(): MilliSeconds {
    if (this.alive) {
      return 0;
    }
    return this.game.timestamp - this.diedAtTimestamp;
  }

  @observable
  extraLivesLeft = 10;

  @observable
  direction: Direction = 'RIGHT';
  nextDirection: Direction = 'RIGHT';
}

export const resetPacMan = (pacMan: PacMan) => {
  pacMan.diedAtTimestamp = -1;
  pacMan.stateChart.state.value = INITIAL_PACMAN_STATE;
  pacMan.setTileCoordinates({ x: 14, y: 23 });
  pacMan.nextDirection = 'LEFT';
  pacMan.direction = 'LEFT';
};

export const respawnPacMan = (pacMan: PacMan) => {
  pacMan.stateChart.state.value = INITIAL_PACMAN_STATE;
  pacMan.setTileCoordinates({ x: 14, y: 23 });
  pacMan.nextDirection = 'LEFT';
  pacMan.direction = 'LEFT';
}