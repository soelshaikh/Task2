import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FilterService,
  GridComponent,
  GridModule,
  GroupService,
  PageService,
  RowSelectEventArgs,
  SelectionSettingsModel,
  SortService,
} from '@syncfusion/ej2-angular-grids';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { HttpClient } from '@angular/common/http';
import { FormioEvent } from '../custom-lib/elements.common';

@Component({
  selector: 'sync-grid-new',
  templateUrl: './sync-grids-new.component.html',
  standalone: true,
  imports: [GridModule],
  providers: [PageService, SortService, FilterService, GroupService],
})
export class SyncGridsComponent implements AfterViewInit {
  public dataSource: any;
  public dataArray: any;
  public Record: Object;
  public pageSettings?: PageSettingsModel;
  public url = 'https://dummyjson.com/products';
  @ViewChild('grid', { static: true }) grid: GridComponent;
  @Input() value: object;
  @Output() valueChange = new EventEmitter<object>();
  @Output() FormioEvent = new EventEmitter<FormioEvent>();
  @Input() disabled!: boolean;

  /**
   * Optional property that defines the selection options for a component.
   * It specifies the mode and type of selection to be used.
   * Default mode is 'Row' and type is 'Single'.
   */
  public selectionOptions?: SelectionSettingsModel = {
    mode: 'Row',
    type: 'Single',
  };

  /**
   * Constructs the ProductService with HttpClient dependency injection.
   * Makes an HTTP GET request to fetch product data from the specified URL and populates the dataSource property.
   * @param http The HttpClient service for making HTTP requests.
   */
  constructor(private http: HttpClient) {
    // Make an HTTP GET request to fetch product data
    this.http.get(this.url).subscribe((res: any) => {
      // Populate the dataSource property with the products obtained from the response
      this.dataSource = res.products;
      this.pageSettings = { pageSize: 15 };
    });
    this.getDataRows();
    console.log(this.value);
    this.valueChange.subscribe((res) => {
      console.log(res);
    });
    this.FormioEvent.subscribe((res) => {
      console.log(res);
    });
  }

  ngonInit(): void {
    //Removing Syncfusion premium dialog after 2 seconds
    setTimeout(() => {
      const els = document.querySelectorAll('div[style*="z-index: 999999999"]');
      els.forEach((e) => {
        e.remove();
      });
    }, 2000);
  }
  ngAfterViewInit() {
    // Ensure that the grid instance is available before calling getDataRows
    if (this.grid) {
      setTimeout(() => {
        this.getDataRows();
      }, 1000);
    }
  }

  rowSelected(args: RowSelectEventArgs): void {
    // Assigning the data from the row selection event to the Record property
    this.Record = args.data;
    console.log(this.Record);
    // Displaying an alert with the Order ID retrieved from the Record object
    alert(`Order ID : ${this.Record['id']}`);
  }

  getDataRows(): any {
    if (this.grid) {
      // console.log(this.grid.dataSource);
      this.dataArray = this.grid.dataSource;
    }
  }
}
