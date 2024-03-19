import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  inject,
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
import {
  FormioCustomComponent,
  FormioEvent,
} from '../custom-lib/elements.common';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ApiService } from '../../../Services/Api.service';

@Component({
  selector: 'sync-grids-old',
  standalone: true,
  imports: [GridModule],
  providers: [PageService, SortService, FilterService, GroupService],
  templateUrl: './sync-grids-old.component.html',
})
export class SyncGridsComponentOld
  implements AfterViewInit, OnChanges, FormioCustomComponent<object>
{
  public dataSource!: object;
  public client: HttpClient = inject(HttpClient);
  public pageSettings?: PageSettingsModel;
  public Record: Object;
  apiService: ApiService = inject(ApiService);
  public selectionOptions?: SelectionSettingsModel = {
    mode: 'Row',
    type: 'Single',
  };
  @Output() valueChange = new EventEmitter<object>();
  @Input() disabled!: boolean;
  @ViewChild('grid', { static: true }) grid: GridComponent;
  http: HttpClient = inject(HttpClient);
  // value: any = {};

  constructor() {
    this.pageSettings = { pageSize: 15 };
  }
  @Input()
  value: any;

  /**
   * Performs an API call based on provided URL and ID in 'value' or 'gridComponent'.
   * Retrieves data from the API response and assigns it to 'dataSource'.
   */
  getApiCall(): void {
    // Check if 'ApiUrl' and 'ApiId' are provided in 'value', and trigger API call if present
    if (this.value?.ApiUrl && this.value?.ApiId) {
      this.apiService.get(this.value.ApiUrl).subscribe((res) => {
        this.dataSource = res[this.value.ApiId];
      });
    }
    // Check if 'gridComponent' exists and has 'ApiUrl', and trigger API call if present
    else if (this.value?.gridComponent?.ApiUrl) {
      this.apiService.get(this.value.gridComponent.ApiUrl).subscribe((res) => {
        this.dataSource = res[this.value.gridComponent.ApiId];
      });
    }
  }

  /**
   * Detects changes to input properties.
   * If 'ApiUrl' and 'ApiId' are provided in 'value', or if 'gridComponent' exists and has 'ApiUrl', triggers an API call.
   */
  ngOnChanges(): void {
    // Check if 'ApiUrl' and 'ApiId' are provided in 'value', and trigger API call if present
    if (this.value?.ApiUrl && this.value?.ApiId) {
      this.getApiCall();
    }
    // Check if 'gridComponent' exists and has 'ApiUrl', and trigger API call if present
    else if (this.value?.gridComponent?.ApiUrl) {
      this.getApiCall();
    }
  }

  ngAfterViewInit(): void {
    // Removing POP Syncfusion dialog after 2 seconds
    setTimeout(() => {
      const els = document.querySelectorAll(
        'div[style*="background-color: rgba(0, 0, 0, 0.5)"]'
      );
      els.forEach((e) => {
        e.remove();
      });
    }, 200);
  }

  /**
   * Handles the selection of rows in a grid component.
   * Updates the 'value' property to contain the grid instance and the selected row's data.
   * Emits the updated 'value' using 'valueChange.emit()'.
   * @param args The event arguments containing information about the selected row.
   */
  rowSelected(args: RowSelectEventArgs): void {
    // Create a 'gridInstance' object with the 'gridComponent' and selected row's data
    const gridInstance = {
      gridComponent:
        'gridComponent' in this.value ? this.value.gridComponent : this.value,
      gridValue: args.data as any,
    };
    // Update the 'value' property with 'gridInstance'
    this.value = gridInstance;
    // Emit the updated 'value' to notify external components of the change
    this.valueChange.emit(this.value);
  }
}

// Add this line in state configuration Data section custom logic accroding to your component Name
// component.ApiUrl = "http://localhost/api/getState?country="+data.countryData.gridValue['Country']
// component.ApiUrl = "http://localhost/api/getCity?country="+data.countryData.gridValue['Country']+"&state="+data.stateData.gridValue['State']

//Api id = Body
// and Also Pass Redraw On
