import Node from './Node';

export default class Trie {
  constructor() {
    this.root = new Node();
    this.completed = 0;
  }

  count() {
    return this.completed;
  }

  createNodes(array) {

  }

  delete(data) {
    let node = this.find(data);
    node.isCompleted = false;
  }

  find(data) {
    let letters = [...data];
    let current = this.root;

    for(let i = 0; i < letters.length; i++) {
      let letter = letters[i];
      if(!current.children[letter]) {
        return null;
      } else {
        current = current.children[letter];
      }
    }

    return current;
  }

  insert(data) {
    let letters = [...data];
    let current = this.root;

    this.completed++;

    if(typeof data !== 'string') {
      return null;
    }

    function createNodes(array) {
      
      if(array.length <= 1) {
        let letter = letters.shift();
        current.children[letter] = new Node(letter);
        current.children[letter].isCompleted = true;
        current.children[letter].word = data;
        return;
      }

      let letter = letters.shift();

      if(!current.children[letter]) {
        current.children[letter] = new Node(letter);
      }
      
      current = current.children[letter];

      createNodes(array);
    }

    createNodes(letters);
  }


  populate(dict) {
    dict.forEach( string => {
      this.insert(string)
    })
  }

  select(data) {
    let current = this.find(data);
    if(current === null) {
      return null;
    } else {
      current.timesSelected++;
    }
  }

  sort(suggestArr) {

    let arrToSort = suggestArr.map( word => {
      return this.find(word);
    }).sort(function (beforeNode, afterNode) {
      return afterNode.timesSelected - beforeNode.timesSelected;
    });

    return arrToSort.map(node => node.word)
  }

  suggest(data) {
    let letters = [...data];
    let current = this.find(data);
  
    return findAll(current, data);

    function findAll(current, data) {
      let suggestArr = [];
      
      if(!current) {
        return [];
      }
      
      let keys = Object.keys(current.children);
      let string = data;

      if(current.isCompleted === true) {
        suggestArr.push(data);
      }

      keys.forEach(key => {
          suggestArr = [...suggestArr, ...findAll(current.children[key], (string + key))];
        });

      return suggestArr;
    }
  }  
}