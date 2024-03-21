import { AfterViewInit, Component, Input, Output } from '@angular/core';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { EventEmitter } from 'formiojs/types/eventEmitter';
import { FormioCustomComponent } from '../custom-lib/elements.common';

@Component({
  selector: 'app-sync-tree-grid',
  standalone: true,
  imports: [TreeGridModule],
  templateUrl: './sync-tree-grid.component.html',
})
export class SyncTreeGridComponent implements AfterViewInit {
  //   @Output() valueChange = new EventEmitter();

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
}
