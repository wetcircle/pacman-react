import { Game } from './Game';
import { Ghost } from './Ghost';

describe('Ghost', () => {
  describe('when killing pac man', () => {
    it('pauses the ghost', () => {
      const game = new Game();
      const ghost = game.ghosts[0];
      ghost.ghostPaused = false;
      expect(ghost.state).toBe('scatter');
      expect(ghost.ghostPaused).toBeFalsy();
      ghost.send('COLLISION_WITH_PAC_MAN');
      expect(ghost.ghostPaused).toBeTruthy();
    });
  });

  describe('when dying', () => {
    let game: Game;

    let ghost: Ghost;

    beforeEach(() => {
      game = new Game();
      ghost = game.ghosts[0];
      ghost.ghostPaused = false;
      ghost.send('ENERGIZER_EATEN');
      expect(ghost.state).toBe('frightened');
      expect(ghost.ghostPaused).toBeFalsy();
      ghost.send('COLLISION_WITH_PAC_MAN');
    });

    it('is dead', () => {
      expect(ghost.state).toBe('dead');
    });

    it('pauses the ghost', () => {
      expect(ghost.ghostPaused).toBeTruthy();
    });

    it('increments killedGhosts', () => {
      expect(game.killedGhosts).toBe(1);
    });

    it('score increases 100, 200, 400, 800', () => {
      expect(game.score).toBe(100);
    });
  });
});
