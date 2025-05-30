<template>
  <TreeView :treeManager v-slot="{ node, data }" class="tree" :subtreeAttrs="{ id: 'children' }">
    <div class="tree-content">
      <span> {{ data.title }} [{{ node.children.length }}] </span>
      <div>
        <button @click="move(node)">MOVE</button>
        <button @click="add(node)">+</button>
      </div>
    </div>
  </TreeView>
</template>

<script setup lang="ts">
import TreeView from './components/tree.vue'
import { TreeManager } from './domain/tree'

const treeManager = new TreeManager({
  title: 'ROOT',
  children: [{ title: 'UAE', children: [{ title: 'DUBAI' }, { title: 'ABU DHABI' }] }]
})

const move = (node: typeof treeManager) => {
  const bb = node.remove()
  bb && treeManager.addNode(bb)
}

const add = (node: typeof treeManager) => {
  node.addNode({ title: `${Math.random()}` })
  console.log(treeManager)
}
</script>
