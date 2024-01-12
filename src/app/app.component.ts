import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { UserQuery } from './user.query.definition';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { PaginatorComponent } from '../paginator/paginator.component';
import { MatSort, MatSortable } from '@angular/material/sort';
import { ROW_ANIMATION } from './row.animation';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserQuery],
  animations: [ROW_ANIMATION]
})
export class AppComponent implements OnInit {
  users: MatTableDataSource<User>;
  initialSort: MatSortable = {
    id: 'id',
    start: 'desc',
    disableClear: false
  };
  // initil filter without forms
  initialFilter = {
    website: 'uk'
  };
  columnsToDisplay = ['id', 'fullName', 'email', 'website'];
  queryForm: FormGroup;

  nameQueryChanged: Subject<string> = new Subject<string>();
  @ViewChild('pagination', { static: true })
  paginator: PaginatorComponent;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageSize = 10;

  domains: any;

  constructor(private userService: UserService, public userQuery: UserQuery) {
    this.queryForm = this.createQueryForm();
  }

  ngOnInit(): void {
    // sort definition
    this.sort.sort(this.initialSort);
    // mat table definition
    this.users = new MatTableDataSource();
    this.users.filterPredicate = this.userQuery.createFilter();
    this.users.paginator = this.paginator;
    this.users.sort = this.sort;
    this.users.filter = this.userQuery.filter(this.initialFilter);

    // connect data to table
    this.userService
      .getUsers()
      .pipe(
        tap(users => {
          let domains = users.map(user => user.website.split('.').slice(-1)[0]);
          this.domains = [...new Set<string>(domains)];
        })
      )
      .subscribe(users => (this.users.data = users));

    // form filter listener
    this.queryForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filterValues => {
        this.users.filter = this.userQuery.filter(filterValues);
      });
  }

  clearFilters() {
    this.queryForm.reset(this.createQueryForm().getRawValue());
  }

  createQueryForm() {
    return new FormGroup({
      fullName: new FormControl(''),
      email: new FormControl(''),
      website: new FormControl('')
    });
  }

  // filter on demand without forms
  manualFilter() {
    this.users.filter = this.userQuery.filter({
      website: 'org',
      fullName: 'ba'
    });
  }
}
