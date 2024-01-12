export interface QueryDefinition<T, F, C> {
  filterPropName: C;
  queryFn: (row: T, query: F) => boolean;
}

export abstract class Query<T, F, C extends string> {
  queryDefinition: QueryDefinition<T, F, C>[];
  filterValues: F = {} as F;

  filter(filterValues: F): string {
    this.filterValues = filterValues;
    return JSON.stringify(filterValues);
  }

  createFilter() {
    let queryDefinition = this.queryDefinition;

    let filterFunction = function(dataRow: T, filtersJson: string): boolean {
      const matchFilter = [];
      const filters = JSON.parse(filtersJson);
      for (const prop in filters) {
        if (filters.hasOwnProperty(prop)) {
          const columnQueryDef = queryDefinition.reduce((acc, row) => {
            if (row.filterPropName === prop) {
              acc = row;
            }
            return acc;
          });
          let searchResult = columnQueryDef.queryFn(dataRow, filters);
          matchFilter.push(searchResult);
        }
      }

      return matchFilter.every(Boolean);
    };

    return filterFunction;
  }
}
