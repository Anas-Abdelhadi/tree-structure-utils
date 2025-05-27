export type { ITree  } from './domain/meta/i-tree'

import { App, defineAsyncComponent } from 'vue'

import { TreeManager } from './domain/tree'

const install = (app:App<Element>)=>{
    app.component('VTree',defineAsyncComponent(()=>import('./components/tree.vue')))
}
    
export {TreeManager  , install}
