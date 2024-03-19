import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import {
  Formio,
  FormioComponent,
  FormioForm,
  FormioUtils,
} from '@formio/angular';
import { ApiService } from '../../Services/Api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.css',
})
export class RendererComponent implements OnInit {
  @ViewChild(FormioComponent) formioComponent: FormioComponent;
  public formTemplates!: FormioForm[]; // Array containing form templates retrieved from localstorage.
  public selectedTemplate!: any; // The selected template for rendering.
  public submitedTemplate!: {}; // The submitted template data.
  public isTemplateSelected: boolean = false; // A boolean flag indicating whether a template is selected. Default value is false.
  public isDataSubmited: boolean = false; //A boolean flag indicating whether data has been submitted. Default value is false.
  form: Formio;
  apiService: ApiService = inject(ApiService);
  /**
   * Initializes the component.
   * - Removes Syncfusion premium dialog after 2 seconds to prevent UI interference.
   * - Retrieves form templates from localStorage if they exist.
   */
  ngOnInit(): void {
    // Removing Syncfusion premium dialog after 2 seconds
    setTimeout(() => {
      const els = document.querySelectorAll('div[style*="z-index: 999999999"]');
      els.forEach((e) => {
        e.remove();
      });
    }, 2000);
    // Retrieve form templates from localStorage if they exist
    let existingData = localStorage.getItem('formData');
    if (existingData !== null) {
      this.formTemplates = JSON.parse(existingData);
    }
  }

  /**
   * Renders the selected template based on the event value.
   * - If the value is -1, sets the isTemplateSelected flag to false.
   * - Otherwise, sets the isTemplateSelected flag to true, resets the isDataSubmited flag,
   *   and renders the selected template using Formio.createForm.
   * @param event The event object containing the target value.
   */
  renderTemplate(event: any) {
    if (event.target.value == -1) {
      // No template selected
      this.isTemplateSelected = false;
    } else {
      // Template selected
      this.isTemplateSelected = true;
      this.isDataSubmited = false; // Reset submission flag
      // Retrieve selected template
      this.selectedTemplate = this.formTemplates[event.target.value];
      // Render the selected template using Formio.createForm
      Formio.createForm(
        document.getElementById('formio'), // Formio container element
        this.selectedTemplate, // Selected template
        {
          sanitize: true,
          sanitizeConfig: {
            allowedTags: ['sync-grid-new', 'sync-grids-old'], // Allowed tags for sanitization
            addTags: ['sync-grid-new', 'sync-grids-old'], // Additional tags to allow
          },
        }
      ).then((form: any) => {
        form.on('submit', (submission: any) => {
          console.log(submission);
          this.isDataSubmited = true;
          this.submitedTemplate = submission.data;
        });
      });
    }
  }
}
