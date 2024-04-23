import { renderWebWorker } from '@/web-workers/renderWebWorker/renderWebWorker';
import { Container, Rectangle } from 'pixi.js';
import { CellsArray } from './CellsArray';
import { CellsBorders } from './CellsBorders';
import { CellsFills } from './CellsFills';
import { CellsImage } from './cellsImages/CellsImage';
import { CellsImages } from './cellsImages/CellsImages';
import { CellsLabels } from './cellsLabel/CellsLabels';
import { CellsMarkers } from './CellsMarkers';
import { CellsSearch } from './CellsSearch';

export class CellsSheet extends Container {
  private cellsFills: CellsFills;
  private cellsArray: CellsArray;
  private cellsBorders: CellsBorders;
  cellsImages: CellsImages;

  cellsMarkers: CellsMarkers;
  cellsLabels: CellsLabels;

  sheetId: string;

  constructor(sheetId: string) {
    super();
    this.sheetId = sheetId;
    this.cellsFills = this.addChild(new CellsFills(this));

    // may need to clean this up if we ever move to a SPA
    this.addChild(new CellsSearch(sheetId));

    this.cellsLabels = this.addChild(new CellsLabels(this));
    this.cellsArray = this.addChild(new CellsArray(this));
    this.cellsBorders = this.addChild(new CellsBorders(this));
    this.cellsMarkers = this.addChild(new CellsMarkers());
    this.cellsImages = this.addChild(new CellsImages(this));
    this.visible = false;
  }

  // used to render all cellsTextHashes to warm up the GPU
  showAll() {
    this.visible = true;
    this.cellsLabels.showAll();
  }

  show(bounds: Rectangle): void {
    this.visible = true;
    this.cellsLabels.show(bounds);
    this.cellsArray.visible = true;
    this.cellsArray.cheapCull(bounds);
    this.cellsFills.cheapCull(bounds);
    this.cellsImages.cheapCull(bounds);
  }

  hide(): void {
    this.visible = false;
  }

  toggleOutlines(off?: boolean) {
    this.cellsArray.visible = off ?? true;
    this.cellsMarkers.visible = off ?? true;
  }

  showLabel(x: number, y: number, show: boolean) {
    renderWebWorker.showLabel(this.sheetId, x, y, show);
  }

  unload(hashX: number, hashY: number) {
    this.cellsLabels.unload(hashX, hashY);
  }

  adjustOffsets() {
    this.cellsBorders.draw();
    this.cellsFills.draw();
  }

  updateCellsArray() {
    this.cellsArray.updateCellsArray();
  }

  getCellsImages(): CellsImage[] {
    return this.cellsImages.children;
  }
}
