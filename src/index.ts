/**
 * ツリー構造の型
 */
export interface ITree<T extends ITree<T>> {
  children: T[]
}

export type ITreeSearchOrder = 'depth-first' | 'breadth-first'

export namespace Tree {

  /** 自身と子要素に対して再帰的に処理を実行します。 */
  export function forEach<T extends ITree<T>>(root: T, predicate: (arg: T) => void): void {
    predicate(root)
    for (const child of root.children) Tree.forEach(child, predicate)
  }

  // --------------

  /** 別のツリー構造オブジェクトに変換します。 */
  export function map<TSource extends ITree<TSource>, TResult extends ITree<TResult>>(root: TSource, predicate: (arg: TSource) => TResult): TResult {
    const result = predicate(root)
    for (const child of root.children) result.children.push(Tree.map(child, predicate))
    return result
  }

  // --------------

  /** 自身または子要素のいずれかが指定の条件を満たしているかを調べます。 */
  export function some<T extends ITree<T>>(root: T, predicate: (arg: T) => boolean): boolean {
    return predicate(root) || root.children.some(child => Tree.some(child, predicate))
  }
  /** 自身および子要素の全てが指定の条件を満たしているかを調べます。 */
  export function every<T extends ITree<T>>(root: T, predicate: (arg: T) => boolean): boolean {
    return predicate(root) && root.children.every(child => Tree.every(child, predicate))
  }

  // --------------

  /** 指定された条件を満たす最初の要素を返します。 */
  export function findOne<T extends ITree<T>>(source: T[], predicate: (arg: T) => boolean, order: ITreeSearchOrder): T | undefined {
    const iterator = Tree.enumerate(source, order)
    for (const item of iterator) if (predicate(item)) return item
  }

  // --------------

  /** 指定した要素の親を取得します。 */
  export function findParent<T extends ITree<T>>(source: T[], child: T): T | undefined {
    return Tree.findOne(source, t => t.children.includes(child), 'depth-first')
  }

  // --------------

  /** 指定した要素を削除します。 */
  export function remove<T extends ITree<T>>(source: T[], target: T) {
    const index = source.indexOf(target)
    if (index !== -1) {
      source.splice(index, 1)
    } else {
      const parent = Tree.findParent(source, target)
      if (!parent) return;
      parent.children = parent.children.filter(x => x !== target)
    }
  }

  // --------------

  /** 指定した要素の次の要素を取得します。 */
  export function nextOf<T extends ITree<T>>(source: T[], target: T, order: ITreeSearchOrder): T | undefined {
    const iterator = Tree.enumerate(source, order)
    for (const item of iterator) if (item === target) return iterator.next().value
  }

  /** 指定した要素の前の要素を取得します。 */
  export function prevOf<T extends ITree<T>>(source: T[], target: T, order: ITreeSearchOrder): T | undefined {
    const iterator = Tree.enumerateReverse(source, order)
    for (const item of iterator) if (item === target) return iterator.next().value
  }

  // --------------

  /** ツリー内の要素を前から順に列挙します。 */
  export function* enumerate<T extends ITree<T>>(source: T[], order: ITreeSearchOrder): IterableIterator<T> {
    if (order === 'depth-first') {
      for (let i = 0; i < source.length; i++) {
        const item = source[i]
        yield item
        yield* Tree.enumerate(item.children, order)
      }
    } else {
      for (let i = 0; i < source.length; i++) yield source[i]
      for (let i = 0; i < source.length; i++) yield* Tree.enumerate(source[i].children, order)
    }
  }

  /** ツリー内の要素を後ろから順に列挙します。 */
  export function* enumerateReverse<T extends ITree<T>>(source: T[], order: ITreeSearchOrder): IterableIterator<T> {
    if (order === 'depth-first') {
      for (let i = source.length - 1; i >= 0; i--) {
        const item = source[i]
        yield* Tree.enumerateReverse(item.children, order)
        yield item
      }
    } else {
      for (let i = source.length - 1; i >= 0; i--) yield source[i]
      for (let i = source.length - 1; i >= 0; i--) yield* Tree.enumerateReverse(source[i].children, order)
    }
  }

}
