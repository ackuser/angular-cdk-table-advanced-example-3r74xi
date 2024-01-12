import { Injectable } from "@angular/core";
import { TableColumnDirective } from "../table-column/table-column.directive";

@Injectable()
export class TableSortService<T> {
  /**
   * Aktualnie aktywna kolumna
   */
  activeColumn: TableColumnDirective;

  /**
   * Aktywuje podaną kolumne
   */
  private activate(column: TableColumnDirective) {
    column.activate();
  }

  /**
   * Deaktywuje podaną kolumnę
   */
  private deactivate(column: TableColumnDirective) {
    column.deactivate();
  }

  /**
   * Ustawia aktywną kolumnę
   */
  setActive(column: TableColumnDirective) {
    if (this.activeColumn === column) {
      column.isDesc = !column.isDesc;
    } else {
      // deaktywuje poprzednią kolumnę (o ile istnieje)
      if (this.activeColumn) {
        this.deactivate(this.activeColumn);
      }
      //aktywuje nową
      this.activate(column);
      this.activeColumn = column;
    }
  }

  /**
   * @param records Rekordy do posortowania
   * @param fieldName Nazwa pola po jakim ma zostać posortowana tablica
   * @param desc Czy rekordy mają być posortowane malejąco?
   * @param fieldType Typ pola(string|number,boolean).
   */
  sort(
    records: T[],
    fieldName?: string,
    fieldType: string = "string",
    desc?: boolean
  ): T[] {
    if (fieldName) {
      let resolvedTypeFunction = this.typeResolver(fieldType);
      const sortedRecords = resolvedTypeFunction.call(
        this,
        fieldName,
        desc,
        records
      );
      return sortedRecords;
    } else {
      return records;
    }
  }

  private typeResolver(fieldType: string) {
    switch (fieldType) {
      case "boolean":
        return this.sortBooleanOrNumber;
      case "number":
        //return this.radixSortLSD;
        return this.sortBooleanOrNumber;
      case "string":
        return this.sortString;
      case "enum":
        return this.sortString;
      default:
        throw new Error(
          `brak metody dla typu ${fieldType} w  SortService.typeResolver`
        );
    }
  }

  private sortBooleanOrNumber(
    fieldName: string,
    desc: boolean,
    records: T[]
  ): T[] {
    if (desc) {
      return records.sort((x, y) => y[fieldName] - x[fieldName]);
    } else {
      return records.sort((x, y) => x[fieldName] - y[fieldName]);
    }
  }

  private sortString(fieldName: string, desc: boolean, records: T[]): T[] {
    return records.sort((x, y) => {
      let a = x[fieldName].toUpperCase(),
        b = y[fieldName].toUpperCase();
      if (desc) {
        return a < b ? -1 : a > b ? 1 : 0;
      } else {
        return a > b ? -1 : b > a ? 1 : 0;
      }
    });
  }

  private extractDigit(a, bitMask, shiftRightAmount) {
    var digit = (a & bitMask) >>> shiftRightAmount; // extract the digit we are sorting based on
    return digit;
  }

  private getKey(elementA, key: string) {
    return elementA[key];
  }
  // June 2017 Victor J. Duvanenko High Performance LSD Radix Sort for arrays of unsigned integers
  private radixSortLSD(
    sortByKey: string,
    _input_array: any[],
    getKey = this.getKey
  ) {
    var numberOfBins = 256;
    var Log2ofPowerOfTwoRadix = 8;
    var _output_array = new Array(_input_array.length);
    var count = new Array(numberOfBins);
    var _output_array_has_result = false;
    var bitMask = 255;
    var shiftRightAmount = 0;
    var startOfBin = new Array(numberOfBins);
    var endOfBin = new Array(numberOfBins);

    while (bitMask != 0) {
      // end processing digits when all the mask bits have been processed and shifted out, leaving no bits set in the bitMask
      for (var i = 0; i < numberOfBins; i++) count[i] = 0;
      for (
        var _current = 0;
        _current < _input_array.length;
        _current++ // Scan the array and count the number of times each digit value appears - i.e. size of each bin
      )
        count[
          this.extractDigit(
            getKey(_input_array[_current], sortByKey),
            bitMask,
            shiftRightAmount
          )
        ]++;
      startOfBin[0] = endOfBin[0] = 0;
      for (var i = 1; i < numberOfBins; i++)
        startOfBin[i] = endOfBin[i] = startOfBin[i - 1] + count[i - 1];
      for (var _current = 0; _current < _input_array.length; _current++)
        _output_array[
          endOfBin[
            this.extractDigit(
              getKey(_input_array[_current], sortByKey),
              bitMask,
              shiftRightAmount
            )
          ]++
        ] = _input_array[_current];
      bitMask <<= Log2ofPowerOfTwoRadix;
      shiftRightAmount += Log2ofPowerOfTwoRadix;
      _output_array_has_result = !_output_array_has_result;
      var tmp = _input_array,
        _input_array = _output_array,
        _output_array = tmp; // swap input and output arrays
    }
    if (_output_array_has_result)
      for (
        var _current = 0;
        _current < _input_array.length;
        _current++ // copy from output array into the input array
      )
        _input_array[_current] = _output_array[_current];
    return _input_array;
  }
}
