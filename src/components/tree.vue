<template>
  <component :is="tag" class="tree-node" v-bind="resolveNodeAttrs(treeManager)">
    <slot :node="treeManager"></slot>
    <component :is="childrenWrapperTag" v-bind="childrenWrapperAttrs">
      <Tree v-for="(child, index) in treeManager.children" :treeManager="child" :nodeAttrs :childrenWrapperTag :childrenWrapperAttrs :tag :key="index" v-bind="attrs">
        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>
      </Tree>
    </component>
  </component>
</template>

<script setup lang="ts" generic="T">
import { TreeManager } from '../domain/tree'
import { useAttrs } from 'vue'

const props = withDefaults(
  defineProps<{
    childrenWrapperTag?: string
    childrenWrapperAttrs?: Record<string, any>
    tag?: string
    treeManager: TreeManager<T>
    nodeAttrs?: (manager: TreeManager<T>, attrs: any, props: any) => Record<string, any>
  }>(),
  { tag: 'div', childrenWrapperTag: 'div', childrenWrapperAttrs: () => ({ id: 'children' }), nodeAttrs: () => () => ({}) }
)

// Infer the actual data type fromTreeManager
type TreeDataType = typeof props.treeManager extends TreeManager<infer T> ? T : never

defineSlots<{
  default(props: { node: TreeManager<TreeDataType> }): any
}>()
const attrs = useAttrs()
console.log('attrs', attrs)

const resolveNodeAttrs = (manager: TreeManager<T>) => {
  return { ...attrs, ...(props.nodeAttrs?.(manager, attrs, props) || {}) }
}
</script>
<style scoped>
.tree-node {
  padding-left: 10px;
}
</style>
