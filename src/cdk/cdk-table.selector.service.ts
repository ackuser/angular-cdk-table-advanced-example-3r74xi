import { SelectionModel } from "@angular/cdk/collections";
import { Injectable } from "@angular/core";

@Injectable()
export class CdkTableSelectorService<T> {
  selection = new SelectionModel<T>(true, []);

  private _data: T[];

  constructor() {}

  set data(data: T[]) {
    this._data = data;
  }

  get data(): T[] {
    return this._data;
  }

  toggle(obj: T) {
    this.selection.toggle(obj);
  }

  unselectAll() {
    this.selection.clear();
  }

  selectAll() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.selection.select(...this.data);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }
}
