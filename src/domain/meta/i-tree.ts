type ITree<T> = {
  children?: ITree<T>[]
} & T

interface ITreeManager<T>{
  data:T
  children:ITreeManager<T>[]
}
export type { ITree , ITreeManager}
