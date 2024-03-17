import { Injector } from '@angular/core';
import { FormioCustomComponentInfo } from '../custom-lib/elements.common';
import { registerCustomFormioComponent } from '../custom-lib/register-custom-component';
import { SyncGridsComponentOld } from './sync-grids-old.component';
import { Components } from 'formiojs';

let editForm = () => {
  // Call the editForm method of the superclass to get the base form structure.
  const listComp = Components.components.textfield.editForm();
  // console.log(listComp);

  // Add a custom text field component to the form's components array.
  listComp.components[0]['components'].push({
    key: 'setting',
    components: [
      {
        weight: 70,
        type: 'textfield',
        input: true,
        key: 'ApiUrl',
        label: 'Api Url',
        placeholder: 'Enter Api Url',
        validate: { required: true },
      },
      {
        weight: 140,
        type: 'textfield',
        input: true,
        key: 'ApiId',
        label: 'Api Id',
        placeholder: 'Enter Api Id',
        validate: { required: true },
      },
    ],
    label: 'Setting', // Label for the custom section
  });
  // Return the modified form structure.
  return listComp;
};
const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'syncgridsold',
  selector: 'sync-grids-old',
  title: 'Sync Grids Old',
  group: 'custom',
  icon: 'table',
  editForm: editForm,
};

export function registerSyncGridOldComponent(injector: Injector) {
  registerCustomFormioComponent(
    COMPONENT_OPTIONS,
    SyncGridsComponentOld,
    injector
  );
}
