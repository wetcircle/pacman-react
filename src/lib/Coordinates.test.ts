import { screenFromTile, TILE_SIZE, tileFromScreen } from './Coordinates';

describe('Coordinates', () => {
  describe('screenFromTile()', () => {
    it('returns the screen coordinates from tile coordinates', () => {
      expect(screenFromTile({ x: 0, y: 0 })).toEqual([
        TILE_SIZE / 2,
        TILE_SIZE / 2,
      ]);
      expect(screenFromTile({ x: 1, y: 1 })).toEqual([
        TILE_SIZE + TILE_SIZE / 2,
        TILE_SIZE + TILE_SIZE / 2,
      ]);
      expect(screenFromTile({ x: 2, y: 3 })).toEqual([
        2 * TILE_SIZE + TILE_SIZE / 2,
        3 * TILE_SIZE + TILE_SIZE / 2,
      ]);
    });
  });

  describe('tileFromScreen()', () => {
    it('returns the tile coordinates from screen coordinates', () => {
      expect(tileFromScreen({ x: 0, y: 0 })).toEqual([0, 0]);
      expect(tileFromScreen({ x: 1, y: 1 })).toEqual([0, 0]);
      expect(
        tileFromScreen({
          x: 2 * TILE_SIZE + TILE_SIZE / 2,
          y: 3 * TILE_SIZE + TILE_SIZE / 2,
        })
      ).toEqual([2, 3]);
    });
  });

  describe('forward-backward', () => {
    const screen = screenFromTile({ x: 1, y: 3 });
    const tile = tileFromScreen(screen);
    expect(tile).toEqual({ x: 1, y: 3 });
  });
});
