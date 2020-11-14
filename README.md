## 概要 How about

JavaScript でツリー構造のデータを取り扱うときに便利な機能を提供します。

Provides features for working with tree structure data in JavaScript.


## 使い方 Usage

オブジェクトに `ITree<T>` 型を実装させることで、 `Tree` 下にある各種関数を利用できるようになります。

An object implementing `ITree<T>` interface can use functions in `Tree`.

```ts
import Tree, { ITree } from 'tree-util-js'

class MyTreeClass implements ITree<MyTreeClass> {
  someProperty: string = ''
  children: MyTreeClass[] = []
}

const a: MyTreeClass = {
  someProperty: 'aaa',
  children: [
    {
      someProperty: 'bbb',
      children: [
        { someProperty: 'ccc', children: [] },
        { someProperty: 'ddd', children: [] },
      ]
    }
  ]
}

for (const x of Tree.enumerateReverse([a], 'depth-first')) {
  console.log(x.someProperty) // 'ddd' => 'ccc' => 'bbb' => 'aaa'
}

```
