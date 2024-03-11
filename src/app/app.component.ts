import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, Injector, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { registerSyncGridNewComponent } from './FormDevelopment/custom-components/sync-grids-new/sync-grids-new.formio';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  constructor(injector: Injector) {
    // Registers the SyncGridNewComponent using the provided Injector.
    registerSyncGridNewComponent(injector);
  }

  ngOnInit(): void {
    //Removing Syncfusion premium dialog after 2 seconds
    setTimeout(() => {
      const els = document.querySelectorAll('div[style*="z-index: 999999999"]');
      els.forEach((e) => {
        e.remove();
      });
    }, 2000);
  }
}
