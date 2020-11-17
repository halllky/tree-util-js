import Tree, { ITree } from '../src'

class Sample implements ITree<Sample> {
  children: Sample[] = []
}

test('replaceOnlyItself: 親子孫のうち子を置き換える', () => {
  const parent = new Sample()
  const child = new Sample()
  const mago1 = new Sample()
  const mago2 = new Sample()

  parent.children.push(child)
  child.children.push(mago1, mago2)

  const replacer = new Sample()
  replacer.children.push(mago2)

  Tree.replaceOnlyItself([parent], child, replacer)

  expect(parent.children.length).toBe(1)
  expect(parent.children[0] === replacer).toBe(true)

  expect(parent.children[0].children.length).toBe(2)
  expect(parent.children[0].children[0] === mago1).toBe(true)
  expect(parent.children[0].children[1] === mago2).toBe(true)
})

test('replaceOnlyItself: ルート配列上にある要素を置き換える', () => {
  const parent = new Sample()
  const child = new Sample()
  const mago1 = new Sample()
  const mago2 = new Sample()

  parent.children.push(child)
  child.children.push(mago1, mago2)

  const replacer = new Sample()
  replacer.children.push(mago2)

  const source = [parent]

  Tree.replaceOnlyItself(source, parent, replacer)

  expect(source.length).toBe(1)
  expect(source[0] === replacer).toBe(true)

  expect(source[0].children.length).toBe(1)
  expect(source[0].children[0] === child).toBe(true)

  expect(source[0].children[0].children.length).toBe(2)
  expect(source[0].children[0].children[0] === mago1).toBe(true)
  expect(source[0].children[0].children[1] === mago2).toBe(true)
})
