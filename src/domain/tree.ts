import { Base } from './base'
import { ITree } from './i-tree'
import { shallowReactive } from 'vue'

const updateIndices = <T>(node: TreeManager<T>, start = 0) => node.children?.forEach((x, i) => i >= start && (x.index = i))

const setDepth = <T>(node: TreeManager<T>) => {
  node.depth = node.parent ? node.parent.depth + 1 : 0
  node.children?.forEach(setDepth)
}

const toJSON = <T>(node:  TreeManager<T>): ITree<T> =>  ({ ...node.state.value, children: node.children?.map(toJSON) })

const addNode = <T>(owner: TreeManager<T>, data: ITree<T> | TreeManager<T>, index = -1, isInit = false): TreeManager<T> => {
  const newNode = data instanceof TreeManager ? data : new TreeManager<T>(data)
  if (index >= 0) {
    // if this is an insert update siblings at higher indices..
    newNode.index = index

    owner.update(p => {
      p.children === undefined && (p.children=[])
      p.children?.splice(index, isInit ? 1 : 0, newNode.state.value)
    })
    owner.children.splice(index, isInit ? 1 : 0, newNode )

    !isInit && updateIndices(owner, index)
  } else if (index === -1) {
    newNode.index = owner.state.value.children?.length || 0
    if (!isInit) {
      owner.update(p => {
        p.children === undefined && (p.children=[])
        p.children!.push(newNode.state.value)
      })
      owner.children.push(newNode )
    }
  }
  newNode.parent = owner as any
  return newNode
}

const remove = <T>(node: TreeManager<T>): TreeManager<T> | undefined => {
  node.parent?.update(p => {
    p.children?.splice(node.index, 1)
  })
  const removed = node.parent?.children?.splice(node.index, 1)
  if (!removed) return undefined
  node.parent && updateIndices(node.parent as any, removed[0].index)
  removed[0].parent = undefined
  removed[0].index = 0
  return removed[0]
}

const getParentChain = <T>(owner:  TreeManager<T>) => {
  const p = [] as any[]
  if (!owner.parent) return p
  p.push(...getParentChain(owner.parent), owner.parent)
  return p
}
 

export class TreeManager<T> extends Base<ITree<T>> {
  private _depth = 0
  private _index = 0
  private _parent: undefined | TreeManager<T>
  private _children = shallowReactive([]) as TreeManager<T>[]
  get parent(): undefined | TreeManager<T> {
    return this._parent
  }
  set parent(parent: TreeManager<T> | undefined) {
    this._parent = parent
    setDepth(this)
  }
  get index() {
    return this._index
  }
  set index(v: number) {
    this._index = v
  }
  get data(){
    const {children, ...rest} = this.state.value
    return rest
  }
  get children() {
    return this._children
  }
  get depth() {
    return this._depth
  }
  set depth(v: number) {
    this._depth = v
  }

  constructor(initState = { children: [] } as ITree<T>) {
    super(initState)
    debugger
    initState.children?.forEach((x, index) => this.addNode(x, index, true))
  }

  addNode(data: ITree<T> | TreeManager<T>, index = -1, isInit = false):  TreeManager<T> {
    return addNode(this, data, index, isInit)
  }

  addNodes(data: (ITree<T> | TreeManager<T>)[]): TreeManager<T>[] {
    return data.map((x, i) => this.addNode(x, i))
  }

  removeNodes(data: TreeManager<T>[]): (TreeManager<T> | undefined)[] {
    return data.map(this.remove)
  }

  remove(node: TreeManager<T> = this as any): TreeManager<T> | undefined {
    return remove(node as any)
  }

  toJSON(node = this as any):  ITree<T>  {
    return toJSON(node)
  }

  getParentChain() {
    return getParentChain(this as any)
  }
}
