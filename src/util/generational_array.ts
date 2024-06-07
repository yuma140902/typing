export type GenerationalId = {
  gen: number;
  index: number;
};

export type GenerationalEntry<T> = {
  gen: number;
  value: T | undefined;
};

/**
 * 要素の追加、削除、参照を高速に行うことができる配列。
 *
 * {@link GenerationalId}で要素を追跡することができる。
 */
export type GenerationalArray<T> = {
  add: (value: T) => GenerationalId;
  get: (id: GenerationalId) => T | undefined;
  remove: (id: GenerationalId) => T | undefined;
  clear: () => void;
  forEach: (callback: (value: T, id: GenerationalId) => void) => void;
};

export const createGenerationalArray = <T>(): GenerationalArray<T> => {
  let array: GenerationalEntry<T>[] = [];
  let emptyIndices: number[] = [];

  const add = (value: T): GenerationalId => {
    const index = emptyIndices.pop() ?? array.length;
    if (!array[index]) {
      array[index] = { gen: 1, value: undefined };
    }
    array[index].value = value;
    return { gen: array[index].gen, index };
  };

  const get = (id: GenerationalId): T | undefined => {
    const entry = array[id.index];
    return entry && entry.gen === id.gen ? entry.value : undefined;
  };

  const remove = (id: GenerationalId): T | undefined => {
    const entry = array[id.index];
    if (entry && entry.gen === id.gen) {
      emptyIndices.push(id.index);
      // 世代を進めることで要素を無効化する
      entry.gen++;
      const value = entry.value;
      entry.value = undefined;
      return value;
    }
    return undefined;
  };

  const forEach = (callback: (value: T, id: GenerationalId) => void) => {
    array.forEach((entry, index) => {
      if (entry.value) {
        callback(entry.value, { gen: entry.gen, index });
      }
    });
  };

  const clear = () => {
    let removeList: GenerationalId[] = [];
    forEach((_, index) => {
      removeList.push(index);
    });
    removeList.forEach((id) => {
      remove(id);
    });
  };

  return {
    add,
    get,
    remove,
    clear,
    forEach,
  };
};
