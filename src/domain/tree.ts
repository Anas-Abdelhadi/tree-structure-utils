import { isReactive, reactive } from 'vue'

import { ITree } from './meta/i-tree'

const updateIndices = <T>(node:TreeManager<T>, start = 0) => {
  ;(node.data.children as unknown as TreeManager<T>[])?.forEach((x, i) => {
    i > start && (x.index = i)
  })
}
const setDepth = <T>(node:TreeManager<T>) => {
  node.depth = node.parent ? node.parent.depth + 1 : 0
  ;(node.data.children as []).forEach(setDepth)
}
export class TreeManager<T> {
  data: ITree<T>
  private _parent: undefined |TreeManager<T>
  private _depth = 0
  index: number = 0

  get parent(): undefined |TreeManager<T> {
    return this._parent
  }
  set parent(p:TreeManager<T> | undefined) {
    this._parent = p
    setDepth(this)
  }
  get depth() {
    return this._depth
  }
  set depth(v: number) {
    this._depth = v
  }

  constructor(data = { children: [] } as ITree<T>) {
    this.data = (isReactive(data) ? data : reactive(data as any)) as ITree<T>
    !data.children && (this.data.children = [])
    data.children!.forEach((x, index) => this.addNode(x,index, true))
  }

  addNode(data: ITree<T>, index = -1, isInit = false) {
    const newNode = new TreeManager<T>(data)

    if (index >= 0) {
      // if this is an insert update siblings at higher indices..
      newNode.index = index
     
        this.data.children?.splice(index, isInit ?1:0, newNode as any)
         !isInit  &&  updateIndices(this, index)
       
    } else if (index === -1) {
      newNode.index = this.data.children!.length
       !isInit    && this.data.children?.push(newNode as unknown as ITree<T>)
    }
    newNode.parent = this
    return newNode
  }

  addNodes(data: ITree<T>[]) {
    return data.map((x,i)=> this.addNode(x,i))
  }
  removeNodes(data:TreeManager<T>[]) {
    return data.map(this.remove)
  }

  remove(node:TreeManager<T> = this) {
    const removed = node.parent?.data.children?.splice(node.index, 1) as unknown as undefined |TreeManager<T>
    if (!removed) return undefined
    node.parent && updateIndices(node.parent, removed?.index)
    removed.parent = undefined
    removed.index = 0
    return removed
  }

  //---------------------- Return tree data in JSON format ------------------
  toJSONFormat(): any {
    return {
      ...this.data,
      children: this.data?.children?.map(child => child?.toJSONFormat?.())
    }
  }
  getParentChain() {
    const p = [] as any[]
    if (!this.parent) return p
    p.push(...this.parent.getParentChain(), this.parent)
    return p
  }
}
