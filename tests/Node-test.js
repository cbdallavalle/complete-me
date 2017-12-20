import { expect } from 'chai';
import Node from '../lib/Node';

describe('Node', function() {
  let node;

  beforeEach(() => {
    node = new Node();
  });

  it('should be a thing', () => {
    expect(node).to.exist
  });

  it('should accept data', () => {
    node = new Node('apple')
    expect(node.data).to.equal('apple');
  });

  it('should have a default of an empty object for the child', () => {
    expect(node.children).to.deep.equal({});
  });

  it('it should have a default of false for isCompleted', () => {
    expect(node.isCompleted).to.equal(false);
  })

  it('should have a default of 0 for timesSelected', () => {
    expect(node.timesSelected).to.equal(0);
  })

})