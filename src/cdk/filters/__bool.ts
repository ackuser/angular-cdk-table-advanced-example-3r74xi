import { Injectable } from "@angular/core";
import { CONDITION_TYPE } from "./condition.enum";
import { getNestedValue } from "../../../../functions";

@Injectable({
  providedIn: "root"
})
export class BooleanFilterService {
  search(columnName: string, condition: number, records) {
    switch (condition) {
      case CONDITION_TYPE.FALSE:
        return records.filter(row => getNestedValue(row, columnName) === false);
      case CONDITION_TYPE.TRUE:
        return records.filter(row => getNestedValue(row, columnName) === true);
      case CONDITION_TYPE.ALL:
        return records;
    }
  }
}
