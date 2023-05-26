import { curry } from '_';

// recursive map 
function hasChildren(node) {
  return (typeof node === 'object') && (typeof node.chidren !== 'undefined') && (node.children.length > 0);
};

const Tree = {
  map: curry(function map (mapFn, node) {
    const newNode = mapFn(node);
    if (hasChildren(node)) {
      return newNode;
    }
    newNode.children = node.children.map(Tree.map(mapFn));
    return newNode;
  })
};