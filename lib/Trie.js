import Node from './Node';

export default class Trie {
  constructor() {
    this.root = new Node();
    this.completed = 0;
  }

  count() {
    return this.completed;
  }

  populate(dict) {
    dict.forEach( string => {
      this.insert(string)
    })
  }

  insert(data) {
    let letters = [...data];
    let current = this.root;
    this.completed++;

    function createNodes(array) {
      
      if(array.length <= 1) {
        let letter = letters.shift();
        current.children[letter] = new Node(letter);
        current.children[letter].isCompleted = true;
        return;
      }

      let letter = letters.shift();

      if(!current.children[letter]) {
        current.children[letter] = new Node(letter);
      }
      
      current = current.children[letter];
      // console.log(current)

      createNodes(array);
    }

    createNodes(letters);
  }

  suggest(data) {
    let letters = [...data];
    let current = this.root;
    
    for(let i = 0; i < letters.length; i++) {
      let letter = letters[i];
      current = current.children[letter];
    }

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

      return suggestArr
    }
  }  
}