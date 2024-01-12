import { Injectable } from '@angular/core';
import { Query, QueryDefinition } from './../cdk/query';
import { User } from './user';

type FilterPropName = 'name' | 'email' | 'website';

interface U extends User {}

interface IFilterValues extends Partial<U> {}

@Injectable()
export class UserQuery extends Query<U, IFilterValues, FilterPropName> {
  queryDefinition: QueryDefinition<U, IFilterValues, FilterPropName>[] = [
    {
      filterPropName: 'name',
      queryFn: this.findByName
    },
    {
      filterPropName: 'email',
      queryFn: this.findByEmail
    },
    {
      filterPropName: 'website',
      queryFn: this.findByWebsite
    }
  ];

  private findByName(row: U, query: IFilterValues) {
    return (
      row.fullName.toLowerCase().indexOf(query.fullName.toLowerCase()) != -1
    );
  }

  private findByEmail(row: U, query: IFilterValues) {
    return row.email.toLowerCase().indexOf(query.email.toLowerCase()) != -1;
  }

  private findByWebsite(row: U, query: IFilterValues) {
    const regexp = new RegExp(`${query.website.toLowerCase()}$`, 'i');
    return row.website.toLowerCase().search(regexp) >= 0;
  }
}
