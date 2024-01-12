import { Injectable } from "@angular/core";
import { getNestedValue } from "../../../../functions";
import { StringCondition } from "./string-condition.enum";

@Injectable({
  providedIn: "root"
})
export class StringTypeService {
  search(
    searchValue: string,
    columnName: string,
    condition: StringCondition,
    records
  ) {
    let regExp = this[StringCondition[condition]](searchValue);
    return records.filter(row => {
      let nestedValued = getNestedValue(row, columnName);
      if (nestedValued === null) return false;
      return nestedValued.search(regExp) >= 0;
    });
  }

  private contains(searchValue) {
    return new RegExp(searchValue, "i");
  }
  private notContains(searchValue) {
    return new RegExp(`^(?!.*${searchValue}).*$`, "i");
  }
  private beginsWith(searchValue) {
    return new RegExp(`^${searchValue}`, "i");
  }
  private endsWith(searchValue) {
    return new RegExp(`${searchValue}$`, "i");
  }
  private isEmpty(searchValue) {
    return new RegExp(/^$/);
  }
  private isNotEmpty(searchValue) {
    return new RegExp(/.+/);
  }
}
