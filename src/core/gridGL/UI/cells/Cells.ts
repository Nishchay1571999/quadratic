import { Container, Graphics } from 'pixi.js';
import { PixiApp } from '../../pixiApp/PixiApp';
import { CellsLabels } from './CellsLabels';
import { drawCell } from './drawCell';

export interface CellsBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export class Cells extends Container {
  private app: PixiApp;
  private cellBackgrounds: Graphics;
  private labels: CellsLabels;
  dirty = true;

  constructor(app: PixiApp) {
    super();
    this.app = app;
    this.cellBackgrounds = this.addChild(new Graphics());
    this.labels = this.addChild(new CellsLabels());
  }

  private draw() {
    const { viewport, grid, gridOffsets } = this.app;
    this.labels.clear();
    this.cellBackgrounds.clear();

    const bounds = grid.getBounds(viewport.getVisibleBounds());
    const xStart = gridOffsets.getColumnPlacement(bounds.left).x;
    let y = gridOffsets.getRowPlacement(bounds.top).y;
    for (let row = bounds.top; row <= bounds.bottom; row++) {
      let x = xStart;
      const height = gridOffsets.getRowHeight(row);
      for (let column = bounds.left; column <= bounds.right; column++) {
        const width = gridOffsets.getColumnWidth(column);
        const cell = grid.get(column, row);
        if (cell) {
          drawCell({
            graphics: this.cellBackgrounds,
            cell,
            x,
            y,
            width,
            height,
            gridOffsets: this.app.gridOffsets,
          });
          this.labels.add({
            x: x,
            y: y,
            text: cell.value,
          });
        }
        x += width;
      }
      x = xStart;
      y += height;
    }
    this.labels.update();
  }

  update(): void {
    if (this.dirty) {
      this.dirty = false;
      this.draw();
    }
  }
}