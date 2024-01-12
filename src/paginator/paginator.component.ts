import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
  MAT_PAGINATOR_DEFAULT_OPTIONS
} from '@angular/material/paginator';
import { FetchPages } from './fetch.pages.pipe';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [FetchPages]
})
export class PaginatorComponent extends MatPaginator
  implements OnInit, OnChanges {
  pages: number[] = [];

  pageNeighbours = 2;
  LEFT_PAGE = 'LEFT';
  RIGHT_PAGE = 'RIGHT';

  selectedPageSize: number;

  /**
   * Helper method for creating a range of numbers
   * range(1, 5) => [1, 2, 3, 4, 5]
   */
  range(from: number, to: number, step = 1) {
    let i = from;
    const range = [];

    while (i <= to) {
      range.push(i);
      i += step;
    }

    return range;
  }

  constructor(
    intl: MatPaginatorIntl,
    changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: MatPaginatorDefaultOptions
  ) {
    super(intl, changeDetectorRef, defaults);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['length']) {
      this.setPage(0);
    }
  }

  ngOnInit(): void {
    this.emitPageEvent(0);
    this.selectedPageSize = this.pageSize;
  }

  setPage(page: number) {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = page;
    this.emitPageEvent(previousPageIndex);
  }

  emitPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: super.length
    });
  }

  changePageSize(selectedPageSize) {
    console.log(selectedPageSize);
    this.pageSize = selectedPageSize;
    this.setPage(0);
    this.emitPageEvent(0);
  }

  /**
   * from: https://www.digitalocean.com/community/tutorials/how-to-build-custom-pagination-with-react
   */
  fetchPageNumbers() {
    if (!this.length || this.getNumberOfPages() === 1) return null;
    const totalPages = this.getNumberOfPages();
    const currentPage = this.pageIndex + 1;
    const pageNeighbours = this.pageNeighbours;

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = this.pageNeighbours * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);
      let pages = this.range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = this.range(startPage - spillOffset, startPage - 1);
          pages = [this.LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = this.range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, this.RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [this.LEFT_PAGE, ...pages, this.RIGHT_PAGE];
          break;
        }
      }

      return [1, ...pages, totalPages];
    }

    return this.range(1, totalPages);
  }
}
