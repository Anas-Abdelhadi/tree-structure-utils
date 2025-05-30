export type ITree<T> =  {
  children?:ITree<T>[]
} & T

// interface ITreeManager<T> extends IBase<T> {
//   parent?: ITreeManager<T>
//   depth: number
//   index: number
//   children?: ITreeManager<T>[]
//   addNode(data: ITreeManager<T>, index?: number, isInit?: boolean): void
//   addNodes(data: ITreeManager<T>[]): ITreeManager<T>[]
//   removeNodes(data: ITreeManager<T>[]): (ITreeManager<T>|undefined)[]
//   remove(node?: ITreeManager<T>): ITreeManager<T>|undefined
//   toJSON(node?: ITreeManager<T>): TDeepPartial<ITreeManager<T>>
//   getParentChain(): ITreeManager<T>[]
// }
// export type { ITreeManager }
