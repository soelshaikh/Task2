import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  NgIterable,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  AdaptiveDialogEventArgs,
  BatchAddArgs,
  BatchCancelArgs,
  BatchDeleteArgs,
  BeforeAutoFillEventArgs,
  BeforeBatchAddArgs,
  BeforeBatchDeleteArgs,
  BeforeBatchSaveArgs,
  BeforeCopyEventArgs,
  BeforeDataBoundArgs,
  BeforePasteEventArgs,
  BeginEditArgs,
  CellDeselectEventArgs,
  Column,
  ColumnChooserEventArgs,
  ColumnChooserService,
  ColumnDragEventArgs,
  ColumnMenuClickEventArgs,
  ColumnMenuOpenEventArgs,
  ColumnMenuService,
  ColumnModel,
  ColumnSelectEventArgs,
  ColumnSelectingEventArgs,
  ContextMenuItem,
  ContextMenuService,
  DataSourceChangedEventArgs,
  DataStateChangeEventArgs,
  EditService,
  EditSettingsModel,
  ExcelExportService,
  FailureEventArgs,
  FilterService,
  FilterSettingsModel,
  GridComponent,
  GridModule,
  GroupService,
  GroupSettingsModel,
  IEditCell,
  KeyboardEventArgs,
  PageEventArgs,
  PageService,
  PdfExportService,
  PrintEventArgs,
  QueryCellInfoEventArgs,
  RecordClickEventArgs,
  RecordDoubleClickEventArgs,
  ReorderService,
  ResizeArgs,
  ResizeService,
  RowDataBoundEventArgs,
  RowDeselectEventArgs,
  RowDeselectingEventArgs,
  RowDragEventArgs,
  RowSelectEventArgs,
  RowSelectingEventArgs,
  SelectionSettingsModel,
  SortService,
  ToolbarService,
} from '@syncfusion/ej2-angular-grids';
import { FormioCustomComponent } from '../custom-lib/elements.common';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ApiService } from '../../../Services/Api.service';
import { ClickEventArgs } from '@syncfusion/ej2-angular-navigations';
import { CommonModule } from '@angular/common';
import { employeeData } from './data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'sync-grids-old',
  standalone: true,
  imports: [GridModule, CommonModule],
  providers: [
    EditService,
    PageService,
    SortService,
    FilterService,
    GroupService,
    ReorderService,
    ResizeService,
    ColumnMenuService,
    ToolbarService,
    ColumnChooserService,
    PageService,
    PdfExportService,
    ExcelExportService,
    ContextMenuService,
  ],

  templateUrl: './sync-grids-old.component.html',
  styleUrls: ['sync-grids-old.component.css'],
})
// {
//   public data: Object[];

//   @ViewChild('grid')
//   public grid: GridComponent;

//   ngOnInit(): void {
//       this.data = employeeData;
//   }

// }
export class SyncGridsComponentOld
  implements AfterViewInit, OnChanges, OnInit, FormioCustomComponent<object>
{
  public contextMenuItems: ContextMenuItem[];
  public editSettings?: EditSettingsModel;
  public dataSource!: object;
  public client: HttpClient = inject(HttpClient);
  public pageSettings?: PageSettingsModel;
  public Record: Object;
  apiService: ApiService = inject(ApiService);
  public groupOptions: GroupSettingsModel;
  public filterSettings: Object;
  public toolbar: Object[];
  public state?: GridComponent;
  public message?: string;
  public columns?: NgIterable<ColumnModel> | null | undefined;
  public persistedGridSettings?: object;
  public dynamicColumns?: any;

  public selectionOptions?: SelectionSettingsModel = {
    mode: 'Row',
    type: 'Single',
  };
  public idRules: Object = {};
  public titleRules: Object = {};
  public priceRules: Object = {};
  public dropdownparams?: IEditCell;
  @Output() valueChange = new EventEmitter<object>();
  @Input() disabled!: boolean;
  @ViewChild('grid', { static: true }) grid: GridComponent;
  http: HttpClient = inject(HttpClient);
  private apiSubscription: Subscription | undefined;

  stateLoaded = false;

  constructor() {
    this.pageSettings = { pageSize: 10, pageCount: 3 };
  }
  @Input()
  value: any;

  ngOnInit(): void {
    console.log('init');
    this.editSettings = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: 'Normal',
    };
    this.groupOptions = { showGroupedColumn: true };
    this.filterSettings = { type: 'Menu' };
    this.toolbar = [
      'ColumnChooser',
      'Search',
      'PdfExport',
      'ExcelExport',
      'Add',
      'Edit',
      'Delete',
      'Update',
      'Cancel',
      {
        prefixIcon: 'e-small-icon',
        id: 'big',
        align: 'Right',
        tooltipText: 'Row-height-big',
      },
      {
        prefixIcon: 'e-medium-icon',
        id: 'medium',
        align: 'Right',
        tooltipText: 'Row-height-medium',
      },
      {
        prefixIcon: 'e-big-icon',
        id: 'small',
        align: 'Right',
        tooltipText: 'Row-height-small',
      },
    ];
    this.contextMenuItems = [
      'AutoFit',
      'AutoFitAll',
      'SortAscending',
      'SortDescending',
      'Copy',
      'Edit',
      'Delete',
      'Save',
      'Cancel',
      'PdfExport',
      'ExcelExport',
      'CsvExport',
      'FirstPage',
      'PrevPage',
      'LastPage',
      'NextPage',
    ];
    // this.idRules = { required: true, number: true };
    // this.titleRules = { required: true };
    // this.priceRules = { min: 1, max: 1000 };
    this.dropdownparams = {
      params: {
        showClearButton: true,
        popupHeight: 120,
      },
    };
  }

  /**
   * Performs an API call based on provided URL and ID in 'value' or 'gridComponent'.
   * Retrieves data from the API response and assigns it to 'dataSource'.
   */
  getApiCall(): void {
    // Check if 'ApiUrl' and 'ApiId' are provided in 'value', and trigger API call if present
    if (this.value?.ApiUrl && this.value?.ApiId) {
      this.apiSubscription = this.apiService
        .get(this.value.ApiUrl)
        .subscribe((res) => {
          this.dataSource = res[this.value.ApiId];
          this.createDynamicColumns();
        });
    }
    // Check if 'gridComponent' exists and has 'ApiUrl', and trigger API call if present
    else if (this.value?.gridComponent?.ApiUrl) {
      this.apiSubscription = this.apiService
        .get(this.value.gridComponent.ApiUrl)
        .subscribe((res) => {
          this.dataSource = res[this.value.gridComponent.ApiId];
          this.createDynamicColumns();
        });
    }
  }

  ngOnDestroy(): void {
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }
  createDynamicColumns() {
    const columnNames = Object.keys(this.dataSource[0]);
    this.dynamicColumns = columnNames.map((key, index) => ({
      field: key,
      headerText: key.charAt(0).toUpperCase() + key.slice(1),
      visible: index <= 4,
      isPrimaryKey: key === 'OrderID' ? true : undefined,
      editType:
        key === 'CustomerName'
          ? 'stringedit'
          : key === 'Freight'
          ? 'numericedit'
          : key === 'ShipCountry'
          ? 'dropdownedit'
          : key === 'OrderDate'
          ? 'datepickeredit'
          : key === 'OrderTime'
          ? 'datetimepickeredit'
          : key === 'Verified'
          ? 'booleanedit'
          : undefined,

      // validationRules:
      //   key === 'price'
      //     ? this.priceRules
      //     : key === 'title'
      //     ? this.titleRules
      //     : undefined,
      edit: key === 'ShipCountry' ? this.dropdownparams : undefined,
    }));
    this.columns = this.dynamicColumns;
  }

  save() {
    var persistData = (this.grid as GridComponent).getPersistData(); // Grid persistData
    localStorage.setItem('gridData', persistData);
    this.message = 'Grid state saved. !!!';
  }

  loadGridState() {
    console.log('load');

    let value: string = localStorage.getItem('gridData') as string;
    this.state = JSON.parse(value);
    if (this.state) {
      this.updateHeaderForColumns();
      (this.grid as GridComponent).setProperties(this.state);
      this.message = 'Previous grid state restored.';
    } else {
      this.message = 'No saved state found.';
    }
  }

  updateHeaderForColumns() {
    const minLen: number = Math.min(
      this.dynamicColumns?.length,
      this.state.columns?.length
    );
    this.state.columns = this.state.columns.map((col: any, index: any) => ({
      ...col,
      headerText:
        index < minLen ? this.dynamicColumns[index].headerText : col.headerText,
    }));
  }

  /**
   * Detects changes to input properties.
   * If 'ApiUrl' and 'ApiId' are provided in 'value', or if 'gridComponent' exists and has 'ApiUrl', triggers an API call.
   */
  ngOnChanges(): void {
    // Check if 'ApiUrl' and 'ApiId' are provided in 'value', and trigger API call if present

    console.log('Sohil :', this.value);

    console.log('this.value?.ApiUrl ::::::::::::', this.value?.ApiUrl);

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

  // Triggers when Grid actions such as sorting, filtering, paging, grouping etc., starts.
  actionBegin(args: PageEventArgs) {
    this.message = '';
    console.log('actionBegin :', args.requestType);
    (this.grid as GridComponent).editSettings.showDeleteConfirmDialog = true;
  }

  // Triggers when Grid actions such as sorting, filtering, paging, grouping etc. are completed.
  actionComplete(args: PageEventArgs) {
    console.log('actionComplete :', args);
    if (args.requestType == 'refresh') {
      if (!this.stateLoaded) {
        this.loadGridState();
        this.stateLoaded = true; // Set the flag to true after loading the state
      }
    }
  }

  // Triggers when any Grid action failed to achieve the desired results.
  actionFailure(args: FailureEventArgs) {
    console.log('actionComplete :', args);
  }

  // Triggers when records are added in batch mode.
  batchAdd(args: BatchAddArgs) {
    console.log('batchAdd :', args);
  }

  // Triggers when cancel the batch edit changes batch mode.
  batchCancel(args: BatchCancelArgs) {
    console.log('batchCancel :', args);
  }
  // Triggers when records are deleted in batch mode.
  batchDelete(args: BatchDeleteArgs) {
    console.log('batchDelete :', args);
  }

  // Triggers before Grid autoFill action.
  beforeAutoFill(args: BeforeAutoFillEventArgs) {
    console.log('beforeAutoFill :', args);
  }

  // Triggers before records are added in batch mode.
  beforeBatchAdd(args: BeforeBatchAddArgs) {
    console.log('beforeBatchAdd :', args);
  }

  // Triggers before records are deleted in batch mode.
  beforeBatchDelete(args: BeforeBatchDeleteArgs) {
    console.log('beforeBatchDelete :', args);
  }

  // Triggers before records are saved in batch mode.
  beforeBatchSave(args: BeforeBatchSaveArgs) {
    console.log('beforeBatchSave :', args);
  }

  // Triggers before Grid copy action.
  beforeCopy(args: BeforeCopyEventArgs) {
    console.log('beforeCopy :', args);
  }

  // Triggers before data is bound to Grid.
  beforeDataBound(args: BeforeDataBoundArgs) {
    console.log('beforeDataBound :', args);
  }

  // Triggers before Grid data is exported to Excel file.
  beforeExcelExport(args: Object) {
    console.log('beforeExcelExport :', args);
  }

  // Triggers before adaptive filter and sort dialogs open.
  beforeOpenAdaptiveDialog(args: AdaptiveDialogEventArgs) {
    console.log('beforeOpenAdaptiveDialog :', args);
  }

  // Triggers before the columnChooser open.
  beforeOpenColumnChooser(args: ColumnChooserEventArgs) {
    console.log('beforeOpenColumnChooser :', args);
  }

  // Triggers before Grid paste action.
  beforePaste(args: BeforePasteEventArgs) {
    console.log('beforePaste :', args);
  }

  // Triggers before Grid data is exported to PDF document.
  beforePdfExport(args: Object) {
    console.log('beforePdfExport :', args);
  }

  // Triggers before the print action starts.
  beforePrint(args: PrintEventArgs) {
    console.log('beforePrint :', args);
  }

  // Triggers before the record is to be edit.
  beginEdit(args: BeginEditArgs) {
    console.log('beginEdit :', args);
  }
  // Triggers when a particular selected cell is deselected.
  cellDeselected(args: CellDeselectEventArgs) {
    console.log('cellDeselected :', args);
  }

  // Triggers when column header element is dragged (moved) continuously.
  columnDrag(args: ColumnDragEventArgs) {
    console.log('columnDrag :', args);
  }

  // Triggers when a column header element is dropped on the target column.
  columnDrop(args: ColumnDragEventArgs) {
    console.log('columnDrop :', args);
  }

  // Triggers when column header element drag (move) starts.
  columnDragStart(args: ColumnDragEventArgs) {
    console.log('columnDragStart :', args);
  }

  // Triggers when click on column menu.
  columnMenuClick(args: ColumnMenuClickEventArgs) {
    console.log('columnMenuClick :', args);
  }

  // Triggers before column menu opens.
  columnMenuOpen(args: ColumnMenuOpenEventArgs) {
    console.log('columnMenuOpen :', args);
  }

  // Triggers before column selection occurs.
  columnSelecting(args: ColumnSelectingEventArgs) {
    console.log('columnSelecting :', args);
  }

  // Triggers after a column is selected.
  columnSelected(args: ColumnSelectEventArgs) {
    console.log('columnSelected :', args);
  }

  // Triggers when the component is created.
  created(event: Object) {
    console.log('created :', event);
  }

  /**
   * Triggers when the grid data is added, deleted and updated.
   * Invoke the done method from the argument to start render after edit operation.
   */
  dataSourceChange(args: DataSourceChangedEventArgs) {
    console.log('dataSourceChange :', args);
  }

  /**
   * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
   * In this event, the current view data and total record count should be assigned to the dataSource based on the action performed.
   */
  dataStateChange(args: DataStateChangeEventArgs) {
    console.log('dataStateChange :', args);
  }

  // Triggers when data source is populated in the Grid.
  dataBound(event: Object) {
    console.log('dataBound :', event);
  }

  // Triggers when the component is destroyed.
  destroyed(event: Object) {
    console.log('destroyed :', event);
  }

  // Triggers when record is double clicked.
  recordDoubleClick(args: RecordDoubleClickEventArgs) {
    console.log('recordDoubleClick :', args);
  }

  // Triggers when record is clicked.
  recordClick(args: RecordClickEventArgs) {
    console.log('recordClick :', args);
  }

  /** Triggered every time a request is made to access cell information, element, or data.
   * This will be triggered before the cell element is appended to the Grid element.
   */
  queryCellInfo(args: QueryCellInfoEventArgs) {
    // console.log('queryCellInfo :', args);
  }

  // Triggers when any keyboard keys are pressed inside the grid.
  keyPressed(args: KeyboardEventArgs) {
    console.log('KeyPressed :', args);
  }

  // Triggers on column resizing.
  resizing(args: ResizeArgs) {
    console.log('Resize :', args);
  }

  // Triggers when column resize starts.
  resizeStart(args: ResizeArgs) {
    console.log('resizeStart :', args);
  }

  // Triggers when column resize ends.
  resizeStop(args: ResizeArgs) {
    console.log('resizeStop :', args);
  }

  /** Triggered every time a request is made to access row information, element, or data.
   * This will be triggered before the row element is appended to the Grid element.
   */
  rowDataBound(args: RowDataBoundEventArgs) {
    // console.log('rowDataBound :', args);
  }

  // Triggers when a selected row is deselected.
  rowDeselected(args: RowDeselectEventArgs) {
    console.log('rowDeselected :', args);
  }

  // Triggers before deselecting the selected row.
  rowDeselecting(args: RowDeselectingEventArgs) {
    console.log('rowDeselecting', args);
  }

  // Triggers when row elements are dropped on the target row.
  rowDrop(args: RowDragEventArgs) {
    console.log('rowDrop :', args);
  }

  // Triggers before row selection occurs.
  rowSelecting(args: RowSelectingEventArgs) {
    console.log('rowSelecting :', args);
  }

  /**
   * Handles the selection of rows in a grid component.
   * Updates the 'value' property to contain the grid instance and the selected row's data.
   * Emits the updated 'value' using 'valueChange.emit()'.
   * @param args The event arguments containing information about the selected row.
   */
  rowSelected(args: RowSelectEventArgs): void {
    console.log('rowSelected :', args);
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

  toolbarClick(args: ClickEventArgs): void {
    console.log(args.item.id);

    if (args.item.id === 'small') {
      this.grid.rowHeight = 20;
    }
    if (args.item.id === 'medium') {
      this.grid.rowHeight = 40;
    }
    if (args.item.id === 'big') {
      this.grid.rowHeight = 60;
    }
    if (args.item.id === 'grid_529239938_0_pdfexport') {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      (this.grid as GridComponent).pdfExport();
    }
    if (args.item.id === 'grid_529239938_0_excelexport') {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      (this.grid as GridComponent).excelExport();
    } else if (args.item.id === 'grid_529239938_0_csvexport') {
      // 'Grid_csvexport' -> Grid component id + _ + toolbar item name
      (this.grid as GridComponent).csvExport();
    }
  }
}

// Add this line in state configuration Data section custom logic accroding to your component Name
// component.ApiUrl = "http://localhost/api/getState?country="+data.countryData.gridValue['Country']  data.labelName
// component.ApiUrl = "http://localhost/api/getCity?country="+data.countryData.gridValue['Country']+"&state="+data.stateData.gridValue['State']

// Api id = Body

// and Also Pass Redraw On
