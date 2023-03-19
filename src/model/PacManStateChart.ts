/* eslint-disable @typescript-eslint/ban-types */

import { Machine, interpret, State } from 'xstate';

export const INITIAL_PACMAN_STATE = 'eating';

interface EventHandler {
  onChasing(): void;
  onDead(): void;
}

export type PacManContext = {};

export interface PacManStateSchema {
  states: {
    eating: {};
    chasing: {};
    dead: {};
  };
}

export type PacManEventType =
  | 'ENERGIZER_EATEN'
  | 'ENERGIZER_TIMED_OUT'
  | 'COLLISION_WITH_GHOST'
  | 'REVIVED';

export type PacManEvent = { type: PacManEventType };

export type PacManState = State<PacManContext, PacManEvent>;

const PacManStateChart = Machine<PacManContext, PacManStateSchema, PacManEvent>(
  {
    id: 'pac-man',
    initial: INITIAL_PACMAN_STATE,
    states: {
      eating: {
        on: {
          ENERGIZER_EATEN: 'chasing',
          COLLISION_WITH_GHOST: 'dead',
        },
      },
      chasing: {
        entry: 'onChasing',
        on: {
          ENERGIZER_TIMED_OUT: 'eating',
        },
      },
      dead: {
        entry: 'onDead',
        on: {
          REVIVED: 'eating',
        },
      },
    },
  }
);
export const makePacManStateChart = (eventHandler: EventHandler) => {
  const extended = PacManStateChart.withConfig({
    actions: {
      onChasing: eventHandler.onChasing,
      onDead: eventHandler.onDead,
    },
  });
  const stateChart = interpret(extended);
  return stateChart;
};



