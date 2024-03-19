import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { FormioForm, FormioModule, FormioUtils } from '@formio/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../Services/Api.service';

@Component({
  selector: 'app-builder',
  standalone: true,
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss',
  imports: [FormioModule, CommonModule, FormsModule],
})
export class BuilderComponent {
  public formTemplates!: FormioForm[];
  public selectedFormIndex: number;
  public form!: any;
  public formMode: any = 'form';
  public builderOption!: {};
  /**
   * Initializes the form object with an empty title and an empty array of components.
   * Initializes the options for the form with sanitization configurations and builder settings.
   */
  constructor() {
    this.loadFromLocal();
    this.builderOption = {
      sanitize: true,
      sanitizeConfig: {
        allowedTags: ['', 'sync-grids-old', 'sync-grid-new'], // Specify allowed tags for sanitization
        addTags: ['', 'sync-grids-old', 'sync-grid-new'], // Specify additional tags to add during sanitization
      },
      builder: {
        basic: {
          default: false,
          weight: 1,
        },
        custom: {
          // Specify custom groups
          title: 'Custom Components',
          default: true,
          weight: 0,
        },
      },
    };
    this.selectedFormIndex = -1;
    this.form = { title: '', display: this.formMode, components: [] };
    // this.setForm();
  }

  changeMode(event: any) {
    this.formMode = event.target.value;
    this.selectedFormIndex = -1;
    this.setForm();
  }

  renderTemplate(event: any) {
    if (event.target.value == -1) {
      this.selectedFormIndex = -1;
      this.setForm();
    } else {
      this.selectedFormIndex = event.target.value;
      this.formMode = this.formTemplates[this.selectedFormIndex].display;
      this.setForm(this.formTemplates[this.selectedFormIndex]);
    }
  }

  setForm(form: any = { title: '', display: this.formMode, components: [] }) {
    this.form = form;
  }

  loadFromLocal() {
    let existingData = localStorage.getItem('formData');
    if (existingData !== null) {
      this.formTemplates = JSON.parse(existingData);
    }
  }

  onChange(event: any): void {
    //Removing Syncfusion premium dialogs
    if (
      event.type === 'updateComponent' &&
      event.component.type === 'syncgrid'
    ) {
      document
        .querySelectorAll('div[style*="background-color: rgba(0, 0, 0, 0.5)"]')
        .forEach((e) => {
          e.remove();
        });

      document
        .querySelectorAll('div[style*="z-index: 999999999"]')
        .forEach((e) => {
          e.remove();
        });
    }
  }

  /**
   * Function to handle form submission.
   * - Updates the form object with the current screen title and components.
   * - Checks if form data exists in localStorage.
   *   - If not, creates a new array with the current form and stores it in localStorage.
   *   - If yes, updates the existing form data with the current form or adds a new form if it doesn't already exist.
   * - Clears the screen title input and displays an alert confirming the submission.
   */
  onSaveForm() {
    let existingData = localStorage.getItem('formData');

    if (existingData === null) {
      this.form.id = Math.floor(Math.random() * (999999 - 100000)) + 100000;
      localStorage.setItem('formData', JSON.stringify([this.form]));
    } else {
      let formsJson = JSON.parse(existingData);
      let alradyExistForm: boolean = false;
      let alradyExistFormIndex: number = -1;

      formsJson.forEach((form: FormioForm, index: number) => {
        if (form.title === this.form.title) {
          alradyExistForm = true;
          alradyExistFormIndex = index;
        }
      });

      if (alradyExistForm) {
        formsJson[alradyExistFormIndex] = this.form;
      } else {
        this.form.id = Math.floor(Math.random() * (999999 - 100000)) + 100000;
        formsJson.push(this.form);
      }
      localStorage.setItem('formData', JSON.stringify(formsJson));
    }
    this.selectedFormIndex = -1;
    this.setForm();
    this.loadFromLocal();
  }
}
