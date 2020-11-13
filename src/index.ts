/**
 * ツリー構造の型
 */
export interface ITree<T extends ITree<T>> {
  children: T[]
}

export type ITreeSearchOrder = 'depth-first' | 'breadth-first'

/** 自身と子要素に対して再帰的に処理を実行します。 */
function forEach<T extends ITree<T>>(root: T, predicate: (arg: T) => void): void {
  predicate(root)
  for (const child of root.children) forEach(child, predicate)
}

// --------------

/** 別のツリー構造オブジェクトに変換します。 */
function map<TSource extends ITree<TSource>, TResult extends ITree<TResult>>(root: TSource, predicate: (arg: TSource) => TResult): TResult {
  const result = predicate(root)
  for (const child of root.children) result.children.push(map(child, predicate))
  return result
}

// --------------

/** 自身または子要素のいずれかが指定の条件を満たしているかを調べます。 */
function some<T extends ITree<T>>(root: T, predicate: (arg: T) => boolean): boolean {
  return predicate(root) || root.children.some(child => some(child, predicate))
}
/** 自身および子要素の全てが指定の条件を満たしているかを調べます。 */
function every<T extends ITree<T>>(root: T, predicate: (arg: T) => boolean): boolean {
  return predicate(root) && root.children.every(child => every(child, predicate))
}

// --------------

/** 指定された条件を満たす最初の要素を返します。 */
function findOne<T extends ITree<T>>(source: T[], predicate: (arg: T) => boolean, order: ITreeSearchOrder): T | undefined {
  const iterator = enumerate(source, order)
  for (const item of iterator) if (predicate(item)) return item
}

// --------------

/** 指定した要素の親を取得します。 */
function findParent<T extends ITree<T>>(source: T[], child: T): T | undefined {
  return findOne(source, t => t.children.includes(child), 'depth-first')
}

// --------------

/** 指定した要素を削除します。 */
function remove<T extends ITree<T>>(source: T[], target: T) {
  const index = source.indexOf(target)
  if (index !== -1) {
    source.splice(index, 1)
  } else {
    const parent = findParent(source, target)
    if (!parent) return;
    parent.children = parent.children.filter(x => x !== target)
  }
}

// --------------

/** 指定した要素の次の要素を取得します。 */
function nextOf<T extends ITree<T>>(source: T[], target: T, order: ITreeSearchOrder): T | undefined {
  const iterator = enumerate(source, order)
  for (const item of iterator) if (item === target) return iterator.next().value
}

/** 指定した要素の前の要素を取得します。 */
function prevOf<T extends ITree<T>>(source: T[], target: T, order: ITreeSearchOrder): T | undefined {
  const iterator = enumerateReverse(source, order)
  for (const item of iterator) if (item === target) return iterator.next().value
}

// --------------

/** ツリー内の要素を前から順に列挙します。 */
function* enumerate<T extends ITree<T>>(source: T[], order: ITreeSearchOrder): IterableIterator<T> {
  if (order === 'depth-first') {
    for (let i = 0; i < source.length; i++) {
      const item = source[i]
      yield item
      yield* enumerate(item.children, order)
    }
  } else {
    for (let i = 0; i < source.length; i++) yield source[i]
    for (let i = 0; i < source.length; i++) yield* enumerate(source[i].children, order)
  }
}

/** ツリー内の要素を後ろから順に列挙します。 */
function* enumerateReverse<T extends ITree<T>>(source: T[], order: ITreeSearchOrder): IterableIterator<T> {
  if (order === 'depth-first') {
    for (let i = source.length - 1; i >= 0; i--) {
      const item = source[i]
      yield* enumerateReverse(item.children, order)
      yield item
    }
  } else {
    for (let i = source.length - 1; i >= 0; i--) yield source[i]
    for (let i = source.length - 1; i >= 0; i--) yield* enumerateReverse(source[i].children, order)
  }
}


export default {
  forEach,
  map,
  every,
  some,
  enumerate,
  enumerateReverse,
  prevOf,
  nextOf,
  remove,
}
