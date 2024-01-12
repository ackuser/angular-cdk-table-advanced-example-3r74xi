import { Injectable } from "@angular/core";
import { getNestedValue } from "../../../../functions";
import { NumberCondition } from "./number-condition.enum";

@Injectable({
  providedIn: "root"
})
export class NumberFilterService {
  search<T>(
    searchValue: number,
    columnName: string,
    condition: NumberCondition,
    records: T[]
  ): T[] {
    return this[NumberCondition[condition]](searchValue, columnName, records);
  }

  private isEqual(searchValue, columnName, records) {
    return records.filter(
      row => getNestedValue(row, columnName) == searchValue
    );
  }
  private greaterThan(searchValue, columnName, records) {
    return records.filter(row => getNestedValue(row, columnName) > searchValue);
  }
  private greaterOrEqual(searchValue, columnName, records) {
    return records.filter(
      row => getNestedValue(row, columnName) >= searchValue
    );
  }
  private lessThan(searchValue, columnName, records) {
    return records.filter(row => getNestedValue(row, columnName) < searchValue);
  }
  private lessOrEqual(searchValue, columnName, records) {
    return records.filter(
      row => getNestedValue(row, columnName) <= searchValue
    );
  }
  private isEmpty(searchValue, columnName, records) {
    return records.filter(row => getNestedValue(row, columnName) == null);
  }
  private isNotEmpty(searchValue, columnName, records) {
    return records.filter(row => getNestedValue(row, columnName) != null);
  }
  private isNotEqual(searchValue, columnName, records) {
    return records.filter(
      row => getNestedValue(row, columnName) != searchValue
    );
  }
}
