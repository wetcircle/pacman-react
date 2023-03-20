/* eslint-disable @typescript-eslint/ban-types */

import { Machine, interpret, State } from 'xstate';

export const INITIAL_GHOST_STATE = 'scatter';

export interface GhostEventHandler {
  onScatterToChase(): void;
  onChaseToScatter(): void;
  onDead(): void;
}

export type GhostContext = {};

export interface GhostStateSchema {
  states: {
    chase: {};
    scatter: {};
    frightened: {};
    dead: {};
  };
}

export type GhostEventType =
  | 'RESET'
  | 'ENERGIZER_EATEN'
  | 'ENERGIZER_TIMED_OUT'
  | 'PHASE_END'
  | 'COLLISION_WITH_PAC_MAN'
  | 'REVIVED';

export type GhostEvent = { type: GhostEventType };

export type GhostState = State<GhostContext, GhostEvent, GhostStateSchema, any>;

const GhostStateChart = Machine<GhostContext, GhostStateSchema, GhostEvent>({
  id: 'ghost',
  initial: INITIAL_GHOST_STATE,
  on: {
    RESET: INITIAL_GHOST_STATE,
  },
  states: {
    chase: {
      on: {
        ENERGIZER_EATEN: 'frightened',
        PHASE_END: {
          target: 'scatter',
          actions: 'onChaseToScatter',
        },
        COLLISION_WITH_PAC_MAN: {
          target: 'scatter',
        },
      },
    },
    scatter: {
      on: {
        ENERGIZER_EATEN: 'frightened',
        PHASE_END: {
          target: 'chase',
          actions: 'onScatterToChase',
        },
        COLLISION_WITH_PAC_MAN: {
          target: 'scatter',
        },
      },
    },
    frightened: {
      on: {
        ENERGIZER_TIMED_OUT: 'chase',
        COLLISION_WITH_PAC_MAN: {
          target: 'dead',
          actions: 'onDead',
        },
      },
    },
    dead: {
      on: {
        REVIVED: 'scatter',
        ENERGIZER_TIMED_OUT: 'scatter',
      },
    },
  },
});

export const makeGhostStateChart = (eventHandler: GhostEventHandler) => {
  const extended = GhostStateChart.withConfig({
    actions: {
      onScatterToChase: eventHandler.onScatterToChase,
      onChaseToScatter: eventHandler.onChaseToScatter,
      onDead: eventHandler.onDead,
    },
  });
  const stateChart = interpret(extended);
  return stateChart;
};
