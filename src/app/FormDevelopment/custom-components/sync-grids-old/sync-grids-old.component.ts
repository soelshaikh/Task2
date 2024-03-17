import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  DoCheck,
  EventEmitter,
  Input,
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
  implements AfterViewInit, FormioCustomComponent<object>
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
  //@Input() value: object;
  @Output() valueChange = new EventEmitter<object>();
  @Output() FormioEvent = new EventEmitter<FormioEvent>();
  @Input() disabled!: boolean;
  @ViewChild('grid', { static: true }) grid: GridComponent;

  ApiData: any;
  http: HttpClient = inject(HttpClient);
  ApiIdArray: any = [];
  UrlStored: any = '';
  _value: any;
  gridInstance: any = {};
  dataSrc = [];

  constructor() {
    console.log('constructor');
    this.pageSettings = { pageSize: 15 };
  }
  @Input()
  public set value(v: any) {
    console.log('set value');
    if (v && v != null) {
      this._value = v;
      // console.log(this.gridInstance);
      if (this.gridInstance !== this._value) {
        this.gridInstance = this._value;
      }
      // console.log(this.gridInstance);
      // const ApiData = {
      //   ApiId: this.gridInstance.ApiId,
      //   ApiUrl: this.gridInstance.ApiUrl,
      // };
      // this.apiService.get(ApiData);
    }
  }
  // public get value(): any {
  //   let abc = JSON.stringify(this.gridInstance);
  //   return JSON.parse(abc);
  // }
  getApiCall() {
    if (
      this.gridInstance?.ApiId != undefined &&
      this.gridInstance?.ApiUrl != undefined
    ) {
      const ApiData = {
        ApiId: this.gridInstance?.ApiId,
        ApiUrl: this.gridInstance?.ApiUrl,
        // GridId: this.gridInstance.id,
      };
      // console.log(ApiData);

      this.apiService.get(ApiData);
    }
  }
  ngOnInit(): void {
    this.apiService.urlEmitter.subscribe((resData: any) => {
      // console.log(resData.res[resData.UrlKey]);
      // this.dataSource = resData.res[resData.UrlKey];
      if (!Object.hasOwn(this.dataSrc, this.gridInstance.id)) {
        // Object.defineProperty(this.dataSrc,this.gridInstance.id,);
        // this.dataSource = {
        //   key: this.gridInstance.id,
        //   ds: resData.res[resData.UrlKey],
        // };
        console.log(this.gridInstance.id);

        this.dataSrc.push({
          key: this.gridInstance.id,
          val: resData.res[resData.UrlKey],
        });
        // this.dataSource['datasrc']=resData.res[resData.UrlKey];
        console.log(this.dataSrc);
        this.SetDataToHtml();
        // console.log(this.dataSource[this.gridInstance.id]);
      }
    });
  }
  SetDataToHtml() {
    console.log('abcd');

    this.dataSrc.forEach((data) => {
      if (data.key === this.gridInstance.id) {
        this.dataSource = data.val;
      }
    });
  }
  ngOnChanges(): void {
    //  console.log(this.value);
    console.log('NGchanges');
    this.getApiCall();
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

    if (this.grid) {
      setTimeout(() => {
        this.getDataRows();
      }, 2000);
    }
  }

  rowSelected(args: RowSelectEventArgs): void {
    this.Record = args.data;
    console.log(this.Record);

    alert(`Order ID : ${this?.Record['id']}`);
    this.value = this.Record;
    this.valueChange.emit(this.Record);
  }

  getDataRows(): any {
    if (this.grid) {
      // console.log(this.grid.dataSource);
    }
  }
}
