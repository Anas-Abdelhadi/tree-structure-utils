import { ShallowRef } from "vue";

export type TUpdater<T> = (updater:TUpdateState<T>)=>ReturnType<TSetState<T>>
export type TUpdateState<T> =(draft: T) => void
export type TSetState<T> = (updater:TUpdateState<T>, onChange?: (prev: T, next: T) => void) => {
    prev: T;
    next: T;
}
export interface IBase<T>{
    state : ShallowRef<T>
    setState :TSetState<T>
    update :TUpdater<T>
}