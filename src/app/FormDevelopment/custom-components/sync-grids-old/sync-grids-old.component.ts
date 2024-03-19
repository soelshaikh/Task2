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

  getApiCall() {
    this.apiService.get(this.value?.ApiUrl).subscribe((res) => {
      // console.log(res);
      this.dataSource = res[this.value?.ApiId];
    });
  }

  ngOnChanges(): void {
    console.log(this.value);
    // console.log(this.);
    if (this.value?.ApiUrl && this.value?.ApiId) {
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

  rowSelected(args: RowSelectEventArgs): void {
    this.value = args.data as any;
    // console.log(this.value);
    this.valueChange.emit(this.value);
  }
}
