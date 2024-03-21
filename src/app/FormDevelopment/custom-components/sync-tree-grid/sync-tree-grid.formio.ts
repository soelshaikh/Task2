import { Injector } from '@angular/core';
import { registerCustomFormioComponent } from '../custom-lib/register-custom-component';
import { FormioCustomComponentInfo } from '../custom-lib/elements.common';
import { SyncTreeGridComponent } from './sync-tree-grid.component';
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
      },
      {
        weight: 140,
        type: 'textfield',
        input: true,
        key: 'ApiId',
        label: 'Api Id',
        placeholder: 'Enter Api Id',
      },
    ],
    label: 'Setting', // Label for the custom section
  });
  // Return the modified form structure.
  return listComp;
};
const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'synctreegrid',
  selector: 'sync-tree-grid',
  title: 'Sync Tree Grid',
  group: 'custom',
  icon: 'flag',
  editForm: editForm,
};
export function registerSyncGridTreeComponent(injector: Injector) {
  registerCustomFormioComponent(
    COMPONENT_OPTIONS,
    SyncTreeGridComponent,
    injector
  );
}
