<template>
  <TreeView :treeManager v-slot="{ node }" tag="ul">
    <span>
      {{ node.data.title }}
    </span>
  </TreeView>
</template>

<script setup lang="ts">
import TreeView from './components/tree.vue'
import { TreeManager } from './domain/tree'

const treeManager = new TreeManager({
  title: 'ROOT',
  children: [{ title: 'CHILD 1 0' }, { title: 'CHILD 0', children: [{ title: 'CHILD 0 0' }, { title: 'CHILD 0 1' }] }, { title: 'CHILD 1', children: [{ title: 'CHILD 1 0' }, { title: 'CHILD 1 1' }] }]
})
</script>
