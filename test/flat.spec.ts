import Tree, { ITree } from '../src'

class Sample implements ITree<Sample> {
  constructor(text: string, children: Sample[]) {
    this.text = text
    this.children = children
  }
  readonly text: string
  readonly children: Sample[]
}

test('flat', () => {
  const grandChild = new Sample('GRAND CHILD', [])
  const child1 = new Sample('CHILD 1', [grandChild])
  const child2 = new Sample('CHILD 2', [])
  const parent = new Sample('PARENT', [child1, child2])

  const result = Tree.flat(parent, item => item.text)
  expect(result[0]).toBe('PARENT')
  expect(result[1]).toBe('CHILD 1')
  expect(result[2]).toBe('GRAND CHILD')
  expect(result[3]).toBe('CHILD 2')
})
