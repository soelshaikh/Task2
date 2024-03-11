import {
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormioForm, FormioModule } from '@formio/angular';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-builder',
  standalone: true,
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss',
  imports: [FormioModule, CommonModule, FormsModule],
})
export class BuilderComponent implements OnInit {
  ScreenTitleInput: string = ''; //The input for the screen title.
  @ViewChild('json', { static: true }) jsonElement?: ElementRef; // Reference to the JSON element in the template.
  form: any; //The form object.
  option: any; //The options for the form.

  /**
   * Initializes the form object with an empty title and an empty array of components.
   * Initializes the options for the form with sanitization configurations and builder settings.
   */
  constructor() {
    // Initialize the form with an empty title and an empty array of components
    this.form = { title: this.ScreenTitleInput, components: [] };

    // Initialize the options for the form with sanitization configurations and builder settings
    this.option = {
      sanitizeConfig: {
        allowedTags: ['', 'sync-grid-new'], // Specify allowed tags for sanitization
        addTags: ['', 'sync-grid-new'], // Specify additional tags to add during sanitization
      },
      builder: {
        custom: {
          title: 'Custom', //The title displayed for the custom component in the form builder.
          default: true, //Indicates whether the custom component is set as the default component.
          weight: 0, //Specifies the weight or priority of the custom component compared to other components.
        },
        basic: {
          default: false,
        },
      },
    };
  }

  ngOnInit() {
    //Removing Syncfusion premium dialog after 2 seconds
    setTimeout(() => {
      const els = document.querySelectorAll('div[style*="z-index: 999999999"]');
      els.forEach((e) => {
        e.remove();
      });
    }, 2000);
  }

  /**
   * Function to handle form changes.
   * - Checks if the event type is 'updateComponent' and the component type is 'syncgrid'.
   *   - If true, removes elements with specific background color and z-index attributes.
   * - Clears the JSON element and displays the updated JSON representation of the form.
   * @param event The event object containing information about the form change.
   */
  onChange(event: any) {
    if (
      event.type === 'updateComponent' &&
      event.component.type === 'syncgrid'
    ) {
      // Remove elements with specific background color
      document
        .querySelectorAll('div[style*="background-color: rgba(0, 0, 0, 0.5)"]')
        .forEach((e) => {
          e.remove();
        });

      // Remove elements with specific z-index
      document
        .querySelectorAll('div[style*="z-index: 999999999"]')
        .forEach((e) => {
          e.remove();
        });
    }
    // Clear the JSON element and display the updated JSON representation of the form
    this.jsonElement.nativeElement.innerHTML = '';
    this.jsonElement.nativeElement.appendChild(
      document.createTextNode(JSON.stringify(event.form, null, 4))
    );
  }

  /**
   * Function to handle form submission.
   * - Updates the form object with the current screen title and components.
   * - Checks if form data exists in localStorage.
   *   - If not, creates a new array with the current form and stores it in localStorage.
   *   - If yes, updates the existing form data with the current form or adds a new form if it doesn't already exist.
   * - Clears the screen title input and displays an alert confirming the submission.
   */
  onSubmit() {
    // Update the form object with the current screen title and components
    this.form = {
      title: this.ScreenTitleInput,
      components: this.form.components,
    };

    // Check if form data exists in localStorage
    let existingData = localStorage.getItem('formData');

    if (existingData === null) {
      // If not, create a new array with the current form and store it in localStorage
      localStorage.setItem('formData', JSON.stringify([this.form]));
    } else {
      // If yes, update the existing form data with the current form or add a new form if it doesn't already exist
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
        formsJson.push(this.form);
      }
      localStorage.setItem('formData', JSON.stringify(formsJson));
      this.ScreenTitleInput = '';
      alert('Done');
    }
  }
}
