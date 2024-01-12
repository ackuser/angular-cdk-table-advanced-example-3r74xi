import { DataSource } from "@angular/cdk/collections";
import { Observable, Subject, BehaviorSubject, combineLatest } from "rxjs";
import { switchMap, startWith, map, share, tap } from "rxjs/operators";
import { indicate } from "./../operators";
import {
  Page,
  Sort,
  PageRequest,
  PaginatedEndpoint
} from "./paginated-endpoint";

export class PaginatedDataSource<T, Q> implements DataSource<T> {
  protected pageNumber = new Subject<number>();
  protected sort: BehaviorSubject<Sort<T>>;
  protected query: BehaviorSubject<Q>;
  protected loading = new Subject<boolean>();

  public loading$ = this.loading.asObservable();
  public page$: Observable<Page<T>>;

  private readonly _data: BehaviorSubject<T[]>;

  constructor() {
    // this.query = new BehaviorSubject<Q>(initialQuery);
    // this.sort = new BehaviorSubject<Sort<T>>(initialSort);
    // const param$ = combineLatest([this.query, this.sort]);
    // this.page$ = param$.pipe(
    //   switchMap(([query, sort]) =>
    //     this.pageNumber.pipe(
    //       startWith(0),
    //       switchMap(page =>
    //         this.endpoint({ page, sort, size: this.pageSize }, query).pipe(
    //           indicate(this.loading)
    //         )
    //       )
    //     )
    //   ),
    //   share()
    // );
  }

  set data(data: T[]) {
    this._data.next(data);
  }

  sortBy(sort: Partial<Sort<T>>): void {
    const lastSort = this.sort.getValue();
    const nextSort = { ...lastSort, ...sort };
    this.sort.next(nextSort);
  }

  queryBy(query: Partial<Q>): void {
    const lastQuery = this.query.getValue();
    const nextQuery = { ...lastQuery, ...query };
    this.query.next(nextQuery);
  }

  fetch(page: number): void {
    this.pageNumber.next(page);
  }

  connect(): Observable<T[]> {
    return this.page$.pipe(map(page => page.content));
  }

  disconnect(): void {}

  filterPredicate: (data: T, filter: string) => boolean;
}
