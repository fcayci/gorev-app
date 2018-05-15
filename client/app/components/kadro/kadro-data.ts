import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map, takeUntil } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { OE } from '../../oe';
import { UserService } from '../../services/user.service';

/**
 * Data source for the MyTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class KadroDataTable extends DataSource<OE> {
  kadro: OE[];
  filteredKadro: OE[];
  filterPredicate;
  _filter: BehaviorSubject<string>;

  constructor(
    private paginator: MatPaginator,
    private sort: MatSort,
    private _user: UserService) {
    super(); // FIXME: Figure out what super() does.

    this._filter = new BehaviorSubject('');

    this._user.getKadro()
      .subscribe((kadro : OE[]) => {
        this.kadro = kadro;
    });

    this.filterPredicate = (data, filter) => {
      // Transform the data into a lowercase string of all property values.
      const accumulator = (currentTerm, key) => currentTerm + data[key];
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) != -1;
    };

  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<OE[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.kadro),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginators length
    this.paginator.length = this.kadro.length;


    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.kadro]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side).
   */
  private getPagedData(kadro: OE[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return kadro.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Filter data (client-side).
   */
  private getFilteredData(filter: string) {
    console.log('Filtre', filter)
    if (filter){
      return this.kadro.filter(kadro => kadro.fullname.toLowerCase().indexOf(filter) > -1)
    }
    else {
      return this.kadro
    }
  }

  //set filter(filter) { this._filter.next(filter); }
  /**
   * Sort the data (client-side).
   */
  private getSortedData(kadro: OE[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return kadro;
    }

    return kadro.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'fullname': return compare(a.fullname, b.fullname, isAsc);
        case 'email': return compare(a.email, b.email, isAsc);
        case 'load': return compare(+a.load, +b.load, isAsc);
        default: return 0;
      }
    });
  }

  get filter() { return this._filter.value }
  set filter(filter) { this._filter.next(filter); }

  private  _filterData(data) {
        // If there is a filter string, filter out data that does not contain it.
        // Each data object is converted to a string using the function defined by filterTermAccessor.
        // May be overridden for customization.
        this.filteredKadro =
            !this.filter ? data : data.filter(obj => this.filterPredicate(obj, this.filter));
        console.log('this.filteredKadro', this.filteredKadro)
        return this.filteredKadro;
    }


}




/** Simple sort comparator for columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
