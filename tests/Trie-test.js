import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

const text = "/usr/share/dict/words";
const dictionary = fs.readFileSync(text).toString().trim().split('\n');


describe('Trie', function() {
  let trie;

  beforeEach(() => {
    trie = new Trie;
  });

  it('should exist', () => {
    let node = new Node();
    expect(node).to.exist
    expect(trie).to.exist
  });

  describe('insert', () => {

    it('should insert a word', () => {
      trie.insert('ardvark');
      expect(trie.root.children.a.data).to.equal('a');
      expect(trie.root.children.a.children.r.data).to.equal('r')
      expect(trie.root.children.a.children.r.children.d.data).to.equal('d');
      expect(trie.root.children.a.children.r.children.d.children.v.children.a.children.r.children.k.data).to.equal('k');
      expect(trie.root.children.a.children.r.children.d.children.v.children.a.children.r.children.k.isCompleted).to.equal(true);
    });

    it('should insert multiple words, flag isComplete property, increase completed count', () => {
      trie.insert('platypus');
      trie.insert('capybara');
      expect(trie.root.children.p.children.l.children.a.children.t.children.y.children.p.children.u.children.s.data).to.equal('s');
      expect(trie.root.children.p.children.l.children.a.children.t.children.y.children.p.children.u.children.s.isCompleted).to.equal(true);
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
      expect(trie.root.children.a.children.n.children.t.children.e.children.a.children.t.children.e.children.r.isCompleted).to.equal(true);
    });
  });

  describe('suggest', () => {
    it('should suggest an array of one word that match the word you put in', () => {
      trie.insert('pizza');
      expect(trie.suggest('pi')).to.deep.equal(["pizza"]);
    });

    it('should suggest an array of words that match the words you are putting in', () => {
      trie.insert('manatee');
      trie.insert('mangabey');
      trie.insert('mantaray');
      expect(trie.suggest('ma')).to.deep.equal(["manatee", "mangabey", "mantaray"]);
    });

    it('should not suggest a word that does not start with the snippet', () => {
      trie.insert('manatee');
      trie.insert('mangabey');
      trie.insert('mantaray');
      trie.insert('macaw')
      expect(trie.suggest('man')).to.deep.equal(["manatee", "mangabey", "mantaray"]);
    });

  });

  describe('populate', () => {

    it('should take in a massive amount of words', () => {
      const completion = new Trie();

      completion.populate(dictionary);
      
      expect(completion.count).to.equal(235886);
      expect(completion.suggest('piz')).to.deep.equal(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"]);
    })

  });

  describe('select' , () => {

    it('should exist', () => {
      expect(trie.select).to.exist;
    })

    it('should select stuff', () => {
      trie.populate(dictionary);

      trie.select('yak');

      expect(trie.root.children.y.children.a.children.k.timesSelected).to.equal(1);

      trie.select('pizza');
      trie.select('pizza');
      trie.select('pizzeria');
      trie.select('pize');

      expect(trie.sort(["pize", "pizza", "pizzeria", "pizzicato", "pizzle"])).to.deep.equal(["pizza", "pize", "pizzeria", "pizzicato", "pizzle"]);

    })
  });

  describe('delete', () => {

    it('should exist', () => {
      expect(trie.delete).to.exist;
    })

    it('should delete a word that the user does not want', () => {
      trie.populate(dictionary);

      trie.delete('pizzle');
      trie.select('pizzle')

      expect(trie.suggest('piz')).to.deep.equal(["pize", "pizza", "pizzeria", "pizzicato"]);
      expect(trie.root.children.p.children.i.children.z.children.z.children.l.children.e.isCompleted).to.equal(false);
    });
  })

  describe('sad path', () => {

    it('should not be able to take a data type that is not a string', () => {
      expect(trie.insert(12312)).to.equal(null);
      expect(trie.insert(['pangolin', 'slow loris', 'axoltol'])).to.equal(null);
      expect(trie.insert({'bearded vulture': 'bird'})).to.equal(null);
    });

    it('should return null if selecting or suggesting a string that is not a word', () => {
      trie.populate(dictionary);

      expect(trie.select('adsaweasdasdf')).to.equal(null);
      expect(trie.suggest('adsaw')).to.equal(null);
    });

    it('can find words with upper case letters', () => {
      trie.populate(dictionary);

      expect(trie.find('YAk')).to.deep.equal(trie.root.children.y.children.a.children.k);
    })

  })



});