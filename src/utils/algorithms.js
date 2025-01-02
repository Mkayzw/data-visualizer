// Helper function to create visualization steps
const createStep = (activeNodes = [], highlightedNodes = [], comparisons = [], description = '') => ({
  activeNodes,
  highlightedNodes,
  comparisons,
  description
});

// Array Algorithms
const bubbleSort = (array) => {
  const steps = [];
  const arr = [...array];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.push(createStep(
        [j, j + 1],
        [],
        [j, j + 1],
        `Comparing ${arr[j]} and ${arr[j + 1]}`
      ));
      
      if (arr[j] > arr[j + 1]) {
        steps.push(createStep(
          [j, j + 1],
          [],
          [],
          `Swapping ${arr[j]} and ${arr[j + 1]}`
        ));
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
    steps.push(createStep(
      [],
      [arr.length - i - 1],
      [],
      `Element ${arr[arr.length - i - 1]} is in its final position`
    ));
  }
  
  return steps;
};

const quickSort = (array) => {
  const steps = [];
  const arr = [...array];
  
  const partition = (low, high) => {
    const pivot = arr[high];
    steps.push(createStep(
      [high],
      [],
      [],
      `Choosing pivot: ${pivot}`
    ));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      steps.push(createStep(
        [j],
        [high],
        [j, high],
        `Comparing ${arr[j]} with pivot ${pivot}`
      ));
      
      if (arr[j] <= pivot) {
        i++;
        steps.push(createStep(
          [i, j],
          [high],
          [],
          `Swapping ${arr[i]} and ${arr[j]}`
        ));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    
    steps.push(createStep(
      [i + 1, high],
      [],
      [],
      `Placing pivot in its final position`
    ));
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1;
  };
  
  const quickSortHelper = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };
  
  quickSortHelper(0, arr.length - 1);
  return steps;
};

const binarySearch = (array, target) => {
  const steps = [];
  let left = 0;
  let right = array.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push(createStep(
      [mid],
      [left, right],
      [],
      `Checking middle element: ${array[mid]}`
    ));
    
    if (array[mid] === target) {
      steps.push(createStep(
        [mid],
        [],
        [],
        `Found target ${target} at index ${mid}`
      ));
      return steps;
    }
    
    if (array[mid] < target) {
      steps.push(createStep(
        [],
        [mid + 1, right],
        [],
        `Target ${target} is in the right half`
      ));
      left = mid + 1;
    } else {
      steps.push(createStep(
        [],
        [left, mid - 1],
        [],
        `Target ${target} is in the left half`
      ));
      right = mid - 1;
    }
  }
  
  steps.push(createStep(
    [],
    [],
    [],
    `Target ${target} not found in the array`
  ));
  return steps;
};

// Linked List Algorithms
const traverse = (list) => {
  const steps = [];
  
  for (let i = 0; i < list.length; i++) {
    steps.push(createStep(
      [i],
      i > 0 ? [i - 1] : [],
      [],
      `Visiting node with value ${list[i]}`
    ));
  }
  
  return steps;
};

const reverse = (list) => {
  const steps = [];
  const arr = [...list];
  
  for (let i = 0; i < Math.floor(arr.length / 2); i++) {
    steps.push(createStep(
      [i, arr.length - 1 - i],
      [],
      [i, arr.length - 1 - i],
      `Swapping ${arr[i]} and ${arr[arr.length - 1 - i]}`
    ));
    [arr[i], arr[arr.length - 1 - i]] = [arr[arr.length - 1 - i], arr[i]];
  }
  
  return steps;
};

// Tree Algorithms
const inorder = (tree) => {
  const steps = [];
  
  const inorderHelper = (index) => {
    if (index >= tree.length || tree[index] === null) return;
    
    // Visit left child
    inorderHelper(2 * index + 1);
    
    // Visit current node
    steps.push(createStep(
      [index],
      [],
      [],
      `Visiting node ${tree[index]}`
    ));
    
    // Visit right child
    inorderHelper(2 * index + 2);
  };
  
  inorderHelper(0);
  return steps;
};

const preorder = (tree) => {
  const steps = [];
  
  const preorderHelper = (index) => {
    if (index >= tree.length || tree[index] === null) return;
    
    // Visit current node
    steps.push(createStep(
      [index],
      [],
      [],
      `Visiting node ${tree[index]}`
    ));
    
    // Visit left child
    preorderHelper(2 * index + 1);
    
    // Visit right child
    preorderHelper(2 * index + 2);
  };
  
  preorderHelper(0);
  return steps;
};

const postorder = (tree) => {
  const steps = [];
  
  const postorderHelper = (index) => {
    if (index >= tree.length || tree[index] === null) return;
    
    // Visit left child
    postorderHelper(2 * index + 1);
    
    // Visit right child
    postorderHelper(2 * index + 2);
    
    // Visit current node
    steps.push(createStep(
      [index],
      [],
      [],
      `Visiting node ${tree[index]}`
    ));
  };
  
  postorderHelper(0);
  return steps;
};

// Graph Algorithms
const bfs = (graph) => {
  const steps = [];
  const visited = new Set();
  const queue = [0];
  
  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;
    
    steps.push(createStep(
      [node],
      Array.from(visited),
      [],
      `Visiting node ${graph[node].value}`
    ));
    
    visited.add(node);
    
    for (const neighbor of graph[node].connections) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        steps.push(createStep(
          [node],
          Array.from(visited),
          [neighbor],
          `Adding neighbor ${graph[neighbor].value} to queue`
        ));
      }
    }
  }
  
  return steps;
};

const dfs = (graph) => {
  const steps = [];
  const visited = new Set();
  
  const dfsHelper = (node) => {
    steps.push(createStep(
      [node],
      Array.from(visited),
      [],
      `Visiting node ${graph[node].value}`
    ));
    
    visited.add(node);
    
    for (const neighbor of graph[node].connections) {
      if (!visited.has(neighbor)) {
        steps.push(createStep(
          [node],
          Array.from(visited),
          [neighbor],
          `Exploring neighbor ${graph[neighbor].value}`
        ));
        dfsHelper(neighbor);
      }
    }
  };
  
  dfsHelper(0);
  return steps;
};

// Node Modifications
const insertNode = (data, value, index) => {
  const newData = [...data];
  newData.splice(index, 0, value);
  return newData;
};

const deleteNode = (data, index) => {
  const newData = [...data];
  newData.splice(index, 1);
  return newData;
};

export const algorithms = {
  array: {
    bubbleSort,
    quickSort,
    binarySearch
  },
  linkedList: {
    traverse,
    reverse
  },
  tree: {
    inorder,
    preorder,
    postorder
  },
  graph: {
    bfs,
    dfs
  }
};

export const modifications = {
  insertNode,
  deleteNode
}; 