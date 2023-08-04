import { Container, Rectangle } from 'pixi.js';
import { debugShowCellsSheetCulling } from '../../debugFlags';
import { GridSparseRust } from '../../grid/sheet/GridSparseRust';
import { SheetRust } from '../../grid/sheet/SheetRust';
import { intersects } from '../helpers/intersects';
import { Coordinate } from '../types/size';
import { CellsHash } from './CellsHash';
import { CellFill, CellHash, CellRust, CellsHashBounds, sheetHashHeight, sheetHashWidth } from './CellsTypes';

export class CellsSheet extends Container {
  sheet: SheetRust;

  // individual hash containers (eg, CellsBackground, CellsArray)
  private cellsHashContainer: Container;

  // index into cellsHashContainer
  private cellsHash: Map<string, CellsHash>;

  constructor(sheet: SheetRust) {
    super();
    this.sheet = sheet;
    this.cellsHash = new Map();
    this.cellsHashContainer = this.addChild(new Container());

    this.populate(sheet);
  }

  private addHash(hashX: number, hashY: number, cells?: CellRust[], background?: CellFill[]): CellsHash {
    const cellsHash = this.cellsHashContainer.addChild(
      new CellsHash(hashX, hashY, { sheet: this.sheet, cells, background })
    );
    this.cellsHash.set(cellsHash.key, cellsHash);
    return cellsHash;
  }

  protected populate(sheet: SheetRust): void {
    const bounds = sheet.grid.getGridBounds(false);
    if (bounds) {
      const hashBounds = this.getHashBounds(bounds);
      for (let y = hashBounds.yStart; y <= hashBounds.yEnd; y++) {
        for (let x = hashBounds.xStart; x <= hashBounds.xEnd; x++) {
          const rect = new Rectangle(x * sheetHashWidth, y * sheetHashHeight, sheetHashWidth - 1, sheetHashHeight - 1);

          const cells = (sheet.grid as GridSparseRust).getCellList(rect);
          const background = (sheet.grid as GridSparseRust).getCellBackground(rect);
          if (cells.length || background.length) {
            this.addHash(x, y, cells, background);
          }
        }
      }
    }
  }

  getHash(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.floor(x / sheetHashWidth),
      y: Math.floor(y / sheetHashHeight),
    };
  }

  protected getHashBounds(bounds: Rectangle): CellsHashBounds {
    const xStart = Math.floor(bounds.left / sheetHashWidth);
    const yStart = Math.floor(bounds.top / sheetHashHeight);
    const xEnd = Math.floor(bounds.right / sheetHashWidth);
    const yEnd = Math.floor(bounds.bottom / sheetHashHeight);
    return { xStart, yStart, xEnd, yEnd };
  }

  // protected add(hash: CellHash, x: number, y: number): void {
  //   const key = CellsHash.getKey(x, y);
  //   let cellsHash = this.cellsHash.get(key);
  //   if (!cellsHash) {
  //     cellsHash = this.cellsHashContainer.addChild(new CellsHash(x, y));
  //     this.cellsHash.set(key, cellsHash);
  //   }
  //   cellsHash.add(hash);
  //   hash.hashes.add(cellsHash);
  // }

  // protected remove(hash: CellHash): void {
  //   hash.hashes.forEach((cellHash) => {
  //     cellHash.delete(hash);
  //   });
  //   hash.hashes.clear();
  // }

  show(bounds: Rectangle): void {
    this.visible = true;
    let count = 0;
    this.cellsHash.forEach((cellsHash) => {
      if (intersects.rectangleRectangle(bounds, cellsHash.viewBounds)) {
        cellsHash.show();
        count++;
      } else {
        cellsHash.hide();
      }
    });
    if (debugShowCellsSheetCulling) {
      console.log(`[CellsSheet] visible: ${count}/${this.cellsHash.size}`);
    }
  }

  hide(): void {
    this.visible = false;
  }

  updateHash(hash: CellHash, AABB: Rectangle): void {
    // hash.AABB = AABB;
    // const bounds = this.getHashBounds(hash.AABB);
    // this.remove(hash);
    // for (let y = bounds.yStart; y <= bounds.yEnd; y++) {
    //   for (let x = bounds.xStart; x <= bounds.xEnd; x++) {
    //     this.add(hash, x, y);
    //   }
    // }
  }

  changeCells(cells: Coordinate[], options: { labels?: boolean; background?: boolean }) {
    const hashes = new Set<CellsHash>();
    cells.forEach((cell) => {
      const { x, y } = this.getHash(cell.x, cell.y);
      const key = CellsHash.getKey(x, y);
      const hash: CellsHash = this.cellsHash.get(key) ?? this.addHash(x, y);
      hashes.add(hash);
    });
    hashes.forEach((hash) => {
      hash.changeCells(options);
    });
  }
}
