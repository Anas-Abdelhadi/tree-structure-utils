type ITree<T> = {
  children?: ITree<T>[]
} & T

export type { ITree }
