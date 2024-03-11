import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Formio, FormioForm } from '@formio/angular';

@Component({
  selector: 'app-renderer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './renderer.component.html',
  styleUrl: './renderer.component.css',
})
export class RendererComponent implements OnInit {
  public formTemplates!: FormioForm[]; // Array containing form templates retrieved from localstorage.
  public selectedTemplate!: any; // The selected template for rendering.
  public submitedTemplate!: {}; // The submitted template data.
  public isTemplateSelected: boolean = false; // A boolean flag indicating whether a template is selected. Default value is false.
  public isDataSubmited: boolean = false; //A boolean flag indicating whether data has been submitted. Default value is false.
  form: any;

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
            allowedTags: ['sync-grid-new'], // Allowed tags for sanitization
            addTags: ['sync-grid-new'], // Additional tags to allow
          },
        }
      ).then((form) => {
        form.on('submit', function () {
          console.log(form);
          console.log(form.submission.data);
          this.isDataSubmited = true;
          // Store the submitted form data
          this.submitedTemplate = form.submission.data;
          
        });
      });
    }
  }

  /**
   * Handles form submission.
   * - Sets the isDataSubmited flag to true.
   * - Stores the submitted form data.
   * @param formJson The JSON object containing the submitted form data.
   */
  onSubmitForm(formJson: any) {
    // Set flag indicating data submission
    console.log(formJson.data);
    this.isDataSubmited = true;

    // Store the submitted form data
    this.submitedTemplate = formJson.data;
  }
}
