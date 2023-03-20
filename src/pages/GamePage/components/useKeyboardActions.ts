import { useCallback, useEffect } from 'react';
import { useStore } from '../../../components/StoreContext';

/* eslint-disable  react-hooks/exhaustive-deps */
export const useKeyboardActions = (): void => {
  const store = useStore();

  const onKeyDown = useCallback((event: KeyboardEvent) => {
    const { game } = store;
    const pressedKey = event.key;
    const pacMan = game.pacMan;

    switch (pressedKey) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        pacMan.nextDirection = 'LEFT';
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        pacMan.nextDirection = 'RIGHT';
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        pacMan.nextDirection = 'UP';
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        pacMan.nextDirection = 'DOWN';
        break;
      case ' ':
        // Don't allow pausing while Ready message appears or it breaks
        // TODO: FIX??
        if(game.isReady) {
          break;
        }

        game.gamePaused = !game.gamePaused;
        game.sendPlayerPaused(game.gamePaused);
        break;
      default:
        break;
    }

    // Send the server the next direction
    game.sendNewDirectionToServer(pacMan.nextDirection);

  }, []);

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);
};
