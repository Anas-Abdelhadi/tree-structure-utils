import { TSetState, TUpdateState, TUpdater } from './i-base';

import { ShallowRef } from 'vue';
import { useState } from '../common/state';

export abstract class Base<T> {
  state!: ShallowRef<T>
  setState!:TSetState<T>
  update!:TUpdater<T>
  constructor(initState: T) {
    const [s,u] = useState(initState)
    this.state = s
    this.setState = u
    this.update = (updater:TUpdateState<T>)=>this.setState(updater)
  }
}
