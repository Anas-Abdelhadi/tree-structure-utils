import { ITree, ITreeManager } from './meta/i-tree'
import { isReactive, reactive, shallowReactive } from 'vue'

const updateIndices = <T>(node: TreeManager<T>, start = 0) => {
  ;(node.children as unknown as TreeManager<T>[])?.forEach((x, i) => {
    i > start && (x.index = i)
  })
}
const setDepth = <T>(node: TreeManager<T>) => {
  node.depth = node.parent ? node.parent.depth + 1 : 0
  ;(node.children as []).forEach(setDepth)
}
const toJSON = <T>(node: TreeManager<T>): ITree<T> => ({ ...node.data, children: node.children.map(toJSON) })

export class TreeManager<T> implements ITreeManager<T> {
  data: T
  children: TreeManager<T>[] = shallowReactive([])
  private _parent: undefined | TreeManager<T>
  private _depth = 0
  index: number = 0

  get parent(): undefined | TreeManager<T> {
    return this._parent
  }
  set parent(p: TreeManager<T> | undefined) {
    this._parent = p
    setDepth(this)
  }
  get depth() {
    return this._depth
  }
  set depth(v: number) {
    this._depth = v
  }

  constructor({ children, ...data } = { children: [] } as ITree<T>) {
    this.data = isReactive(data) ? data : reactive(data as any)
    children?.forEach((x, index) => this.addNode(x, index, true))
  }

  addNode(data: ITree<T> | ITreeManager<T>, index = -1, isInit = false) {
    const newNode = data instanceof TreeManager ? data: new TreeManager<T>(data as ITree<T>)

    if (index >= 0) {
      // if this is an insert update siblings at higher indices..
      newNode.index = index

      this.children?.splice(index, isInit ? 1 : 0, newNode as any)
      !isInit && updateIndices(this, index)
    } else if (index === -1) {
      newNode.index = this.children!.length
      !isInit && this.children?.push(newNode)
    }
    newNode.parent = this
    return newNode
  }

  addNodes(data: (ITree<T>| ITreeManager<T>)[]) {
    return data.map((x, i) => this.addNode(x, i))
  }
  removeNodes(data: TreeManager<T>[]) {
    return data.map(this.remove)
  }

  remove(node: TreeManager<T> = this) {
    const [removed] = node.parent?.children?.splice(node.index, 1) as TreeManager<T>[]
    if (!removed) return undefined
    node.parent && updateIndices(node.parent, removed?.index)
    removed.parent = undefined
    removed.index = 0
    return removed
  }

  //---------------------- Return tree data in JSON format ------------------

  toJSON(node = this) {
    return toJSON(node)
  }
  getParentChain() {
    const p = [] as any[]
    if (!this.parent) return p
    p.push(...this.parent.getParentChain(), this.parent)
    return p
  }
}
