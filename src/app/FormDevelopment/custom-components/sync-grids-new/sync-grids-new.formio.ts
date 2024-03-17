import { Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { Formio } from 'formiojs';
import { SyncGridsComponent } from './sync-grids-new.component';
import { Components } from 'formiojs';

export function registerSyncGridNewComponent(injector: Injector) {
  /**
   *  Use the createCustomElement() function to convert a component into a class that can be registered with the browser as a custom element.
   */
  const complexCustomComponent = createCustomElement(SyncGridsComponent, {
    injector,
  });

  /**
   * Use the built-in customElements.define() function to register the configured constructor and its associated custom-element tag with the browser's CustomElementRegistry.
   */
  customElements.define('sync-grid-new', complexCustomComponent);

  /**
   * Once these components are created as a module, they can then easily be added to the renderer using the Formio.use method as follows.
   */
  Formio.use({
    components: {
      syncgridnew: createCustomSyncGridComponent(),
    },
  });
}

const BaseComp = Components.components.textfield;
/**
 * Dynamically creates a custom Angular component.
 * @returns A custom Angular component class extending a base component.
 */
function createCustomSyncGridComponent() {
  return class customComponent extends BaseComp {
    /**
     * This is the default schema of your custom component. It will "derive"
     * from the base class "schema" and extend it with its default JSON schema
     * properties. The most important are "type" which will be your component
     * type when defining new components.
     */
    static override schema() {
      // Extend the existing form component by adding a custom text field component.
      this.editForm = () => {
        // Call the editForm method of the superclass to get the base form structure.
        const listComp = super.editForm();
        // Add a custom text field component to the form's components array.
        listComp.components[0]['components'].push({
          key: 'custom',
          components: [
            {
              weight: 70,
              type: 'textfield',
              input: true,
              key: 'label',
              label: 'Label',
              placeholder: 'Field Label',
              tooltip: 'The label for this field that will appear next to it.',
            },
          ],
          label: 'Custom', // Label for the custom section
        });
        // Return the modified form structure.
        return listComp;
      };

      return super.schema({
        type: 'syncgridnew',
        label: '',
        key: 'sync-grid-new',
        selector: 'sync-grid-new',
      });
    }

    /**
     * This is the Form Builder information on how this component should show
     * up within the form builder. The "title" is the label that will be given
     * to the button to drag-and-drop on the builder. The "icon" is the font awesome
     * icon that will show next to it, the "group" is the component group where
     * this component will show up, and the weight is the position within that
     * group where it will be shown. The "schema" field is used as the default
     * JSON schema of the component when it is dragged onto the form.
     */
    static get builderInfo() {
      return {
        title: 'Sync Grid New',
        icon: 'table',
        group: 'custom',
        schema: this.schema(),
      };
    }

    /**
     * Overrides the rendering of an element with custom information.
     * This method prepares rendering information, sets the type to 'sync-grid',
     * and renders a template with the updated information.
     * @returns Rendered template with custom information.
     */
    override renderElement() {
      const info = this.elementInfo();
      info.type = 'sync-grid-new';
      return this.renderTemplate('input', {
        input: info,
      });
    }

    // Get the value of the component from the dom elements.
    // override getValue() {}

    /**
     * Set the value of the component into the dom elements.
     * @returns {boolean}
     * */
    // override setValue(value: any, flags: any): boolean {
    //   console.log(value);
    //   return super.setValue(value, flags);
    // }

    override getValue() {
      return super.getValue();
    }

    override setValue(value, flags = {}) {
      console.log('new');
      value = this.component;
      console.log(value);
      return super.setValue(value, flags);
    }
  };
}
