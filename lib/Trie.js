import Node from './Node';

export default class Trie {
  constructor() {
    this.root = new Node();
    this.completed = 0;
  }

  get count() {
    return this.completed;
  }

  delete(data) {
    let node = this.find(data);

    node.isCompleted = false;
  }

  find(data) {
    let letters = [...data.toLowerCase()];
    let current = this.root;

    for (let i = 0; i < letters.length; i++) {
      let letter = letters[i];

      if (!current.children[letter]) {
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

    this.createNode(letters, current, data);

  }

  createNode(array, current, data) {
    let letter = array.shift();

    if(array.length <= 0) {
      current.children[letter] = new Node(letter);
      current.children[letter].isCompleted = true;
      current.children[letter].word = data;
      return;
    }

    if(!current.children[letter]) {
      current.children[letter] = new Node(letter);
    }

    current = current.children[letter];

    this.createNode(array, current, data);
  }

  populate(dict) {
    dict.forEach( string => {
      this.insert(string);
    });
  }

  select(data) {
    let current = this.find(data);

    if (current === null) {
      return null;
    } else {
      current.timesSelected++;
    }
  }

  sort(suggestArr) {

    let arrToSort = suggestArr.map( word => {
      return this.find(word);
    }).sort(function (nodeBefore, nodeAfter) {
      return nodeAfter.timesSelected - nodeBefore.timesSelected;
    });

    return arrToSort.map(node => node.word);
  }

  suggest(data) {
    let current = this.find(data);
    let suggestion = this.findAllSuggestions(current, data);

    if(!suggestion.length) {
      return null;
    }

    return this.sort(suggestion);
  }  

  findAllSuggestions(current, data) {
    let suggestArr = [];

    if(!current) {
      return [];
    }

    if(current.isCompleted === true) {
      suggestArr.push(data);
    }

    Object.keys(current.children).forEach(key => {
      suggestArr = [...suggestArr, 
      ...this.findAllSuggestions(current.children[key], (data + key))]
    })

    return suggestArr
  }
}