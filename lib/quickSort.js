export default function quickSort(array) {

  if(array.length <= 1) {
    return array
  }

  let pivot = array.pop();
  let arrayLess = [];
  let arrayMore = [];
  
  array.forEach( (node) => {
    node.timesSelected < pivot.timesSelected ? arrayLess.push(node) : arrayMore.push(node);
  })

  return [ ...quickSort(arrayMore), pivot, ...quickSort(arrayLess) ]
};