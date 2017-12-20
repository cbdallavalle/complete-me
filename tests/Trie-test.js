import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

describe.only('Trie', function() {
  let trie;

  beforeEach(() => {
    trie = new Trie;
  });

  it('should exist', () => {
    let node = new Node();
    expect(node).to.exist
    expect(trie).to.exist
  });

  it('should be have a default root of null', () => {
    expect(trie.root.data).to.equal(null);
  });

  it('should insert a word', () => {
    trie.insert('ardvark');
    expect(trie.root.children.a.data).to.equal('a');
    expect(trie.root.children.a.children.r.data).to.equal('r')
    expect(trie.root.children.a.children.r.children.d.data).to.equal('d');
    expect(trie.root.children.a.children.r.children.d.children.v.children.a.children.r.children.k.data).to.equal('k');
    expect(trie.root.children.a.children.r.children.d.children.v.children.a.children.r.children.k.isCompleted).to.equal(true);
  });

  it('should insert multiple words and increase completed count', () => {
    trie.insert('platypus');
    trie.insert('capybara');
// console.log( JSON.stringify(trie, null, 4) );
    expect(trie.root.children.p.children.l.children.a.children.t.children.y.children.p.children.u.children.s.data).to.equal('s');
    expect(trie.root.children.p.children.l.children.a.children.t.children.y.children.p.children.u.children.s.isCompleted).to.equal(true);
  
    expect(trie.root.children.c.children.a.children.p.children.y.children.b.children.a.children.r.children.a.data).to.equal('a');
    expect(trie.root.children.c.children.a.children.p.children.y.children.b.children.a.children.r.children.a.isCompleted).to.equal(true);
  
    expect(trie.completed).to.be.equal(2);

  });

  it('should insert several words that start with the same letter and not create new nodes', () => {
    trie.insert('armadillo');
    trie.insert('ardvark');
    trie.insert('anteater');
    expect(trie.root.children.a.children.r.data).to.equal('r');
    expect(trie.root.children.a.children.r.children.m.data).to.equal('m');
    expect(trie.root.children.a.children.r.children.d.data).to.equal('d');
    expect(trie.root.children.a.children.n.data).to.equal('n');
  });

  it('should suggest an array of one word that match the word you put in', () => {
    trie.insert('pizza');
    expect(trie.suggest('pi')).to.deep.equal(["pizza"]);
  });

  it('should suggest an array of words that match the words you are putting in', () => {
    trie.insert('manatee');
    trie.insert('mangabey');
    trie.insert('mantaray');
    // console.log( JSON.stringify(trie, null, 4) );
    expect(trie.suggest('ma')).to.deep.equal(["manatee", "mangabey", "mantaray"]);
  });

  it('should take in a massive amount of words', () => {
    const text = "/usr/share/dict/words"
    const dictionary = fs.readFileSync(text).toString().trim().split('\n')
    const completion = new Trie()

    completion.populate(dictionary)
    
    expect(completion.count()).to.equal(235886);
    expect(completion.suggest('piz')).to.deep.equal(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
  })





})