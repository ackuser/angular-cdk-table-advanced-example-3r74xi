import { Component, OnInit } from "@angular/core";
import { Sort } from "../cdk/data-src/paginated-endpoint";
import { User } from "./user";
import { PaginatedDataSource } from "../cdk/data-src/paginated-datasource";
import { UserService } from "./user.service";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, Subject } from "rxjs";
import { UserQuery } from "./user.query.definition";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { FormControl, FormGroup } from "@angular/forms";
import { Query } from "../cdk/query";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [UserQuery]
})
export class AppComponent implements OnInit {
  users: PaginatedDataSource<User, UserQuery>;
  initialSort: Sort<User> = { property: "id", order: "asc" };
  columnsToDisplay = ["id", "name", "email", "website"];
  queryForm: FormGroup;

  nameQueryChanged: Subject<string> = new Subject<string>();

  constructor(private userService: UserService, public userQuery: UserQuery) {
    this.queryForm = this.createQueryForm();
  }

  ngOnInit(): void {
    this.users = new PaginatedDataSource<User, UserQuery>();
    this.users.filterPredicate = this.userQuery.createFilter();
    this.userService.getUsers().subscribe(users => (this.users.data = users));
    this.queryForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filterValues => {
        this.users.filter = filterValues;
      });
  }

  clearFilters() {
    this.queryForm.reset(this.createQueryForm().getRawValue());
  }

  createQueryForm() {
    return new FormGroup({
      name: new FormControl(""),
      email: new FormControl(""),
      website: new FormControl("")
    });
  }
}
