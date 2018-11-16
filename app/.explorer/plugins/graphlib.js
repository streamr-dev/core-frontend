import _lodash from './lodash.js';

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var components = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g) {
  var visited = {};
  var cmpts = [];
  var cmpt;

  function dfs(v) {
    if (_lodash2.default.has(visited, v)) return;
    visited[v] = true;
    cmpt.push(v);
    _lodash2.default.each(g.successors(v), dfs);
    _lodash2.default.each(g.predecessors(v), dfs);
  }

  _lodash2.default.each(g.nodes(), function (v) {
    cmpt = [];
    dfs(v);
    if (cmpt.length) {
      cmpts.push(cmpt);
    }
  });

  return cmpts;
};



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var components$1 = unwrapExports(components);

var components$2 = /*#__PURE__*/Object.freeze({
	default: components$1,
	__moduleExports: components
});

var priorityQueue = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A min-priority queue data structure. This algorithm is derived from Cormen,
 * et al., "Introduction to Algorithms". The basic idea of a min-priority
 * queue is that you can efficiently (in O(1) time) get the smallest key in
 * the queue. Adding and removing elements takes O(log n) time. A key can
 * have its priority decreased in O(log n) time.
 */
function PriorityQueue() {
  this._arr = [];
  this._keyIndices = {};
}

/**
 * Returns the number of elements in the queue. Takes `O(1)` time.
 */
PriorityQueue.prototype.size = function () {
  return this._arr.length;
};

/**
 * Returns the keys that are in the queue. Takes `O(n)` time.
 */
PriorityQueue.prototype.keys = function () {
  return this._arr.map(function (x) {
    return x.key;
  });
};

/**
 * Returns `true` if **key** is in the queue and `false` if not.
 */
PriorityQueue.prototype.has = function (key) {
  return _lodash2.default.has(this._keyIndices, key);
};

/**
 * Returns the priority for **key**. If **key** is not present in the queue
 * then this function returns `undefined`. Takes `O(1)` time.
 *
 * @param {Object} key
 */
PriorityQueue.prototype.priority = function (key) {
  var index = this._keyIndices[key];
  if (index !== undefined) {
    return this._arr[index].priority;
  }
};

/**
 * Returns the key for the minimum element in this queue. If the queue is
 * empty this function throws an Error. Takes `O(1)` time.
 */
PriorityQueue.prototype.min = function () {
  if (this.size() === 0) {
    throw new Error('Queue underflow');
  }
  return this._arr[0].key;
};

/**
 * Inserts a new key into the priority queue. If the key already exists in
 * the queue this function returns `false`; otherwise it will return `true`.
 * Takes `O(n)` time.
 *
 * @param {Object} key the key to add
 * @param {Number} priority the initial priority for the key
 */
PriorityQueue.prototype.add = function (key, priority) {
  var keyIndices = this._keyIndices;
  key = String(key);
  if (!_lodash2.default.has(keyIndices, key)) {
    var arr = this._arr;
    var index = arr.length;
    keyIndices[key] = index;
    arr.push({ key: key, priority: priority });
    this._decrease(index);
    return true;
  }
  return false;
};

/**
 * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
 */
PriorityQueue.prototype.removeMin = function () {
  this._swap(0, this._arr.length - 1);
  var min = this._arr.pop();
  delete this._keyIndices[min.key];
  this._heapify(0);
  return min.key;
};

/**
 * Decreases the priority for **key** to **priority**. If the new priority is
 * greater than the previous priority, this function will throw an Error.
 *
 * @param {Object} key the key for which to raise priority
 * @param {Number} priority the new priority for the key
 */
PriorityQueue.prototype.decrease = function (key, priority) {
  var index = this._keyIndices[key];
  if (priority > this._arr[index].priority) {
    throw new Error('New priority is greater than current priority. ' + 'Key: ' + key + ' Old: ' + this._arr[index].priority + ' New: ' + priority);
  }
  this._arr[index].priority = priority;
  this._decrease(index);
};

PriorityQueue.prototype._heapify = function (i) {
  var arr = this._arr;
  var l = 2 * i;
  var r = l + 1;
  var largest = i;
  if (l < arr.length) {
    largest = arr[l].priority < arr[largest].priority ? l : largest;
    if (r < arr.length) {
      largest = arr[r].priority < arr[largest].priority ? r : largest;
    }
    if (largest !== i) {
      this._swap(i, largest);
      this._heapify(largest);
    }
  }
};

PriorityQueue.prototype._decrease = function (index) {
  var arr = this._arr;
  var priority = arr[index].priority;
  var parent;
  while (index !== 0) {
    parent = index >> 1;
    if (arr[parent].priority < priority) {
      break;
    }
    this._swap(index, parent);
    index = parent;
  }
};

PriorityQueue.prototype._swap = function (i, j) {
  var arr = this._arr;
  var keyIndices = this._keyIndices;
  var origArrI = arr[i];
  var origArrJ = arr[j];
  arr[i] = origArrJ;
  arr[j] = origArrI;
  keyIndices[origArrJ.key] = i;
  keyIndices[origArrI.key] = j;
};

exports.default = PriorityQueue;
module.exports = exports['default'];
});

var priorityQueue$1 = unwrapExports(priorityQueue);

var priorityQueue$2 = /*#__PURE__*/Object.freeze({
	default: priorityQueue$1,
	__moduleExports: priorityQueue
});

var _priorityQueue = ( priorityQueue$2 && priorityQueue$1 ) || priorityQueue$2;

var dijkstra = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, source, weightFn, edgeFn) {
  weightFn = weightFn || DEFAULT_WEIGHT_FUNC;
  edgeFn = edgeFn || function (v) {
    return g.outEdges(v);
  };
  return runDijkstra(g, String(source), weightFn, edgeFn);
};



var _lodash2 = _interopRequireDefault(_lodash);



var _priorityQueue2 = _interopRequireDefault(_priorityQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_WEIGHT_FUNC = _lodash2.default.constant(1);

function runDijkstra(g, source, weightFn, edgeFn) {
  var results = {};
  var pq = new _priorityQueue2.default();
  var v, vEntry;

  var updateNeighbors = function updateNeighbors(edge) {
    var w = edge.v !== v ? edge.v : edge.w;
    var wEntry = results[w];
    var weight = weightFn(edge);
    var distance = vEntry.distance + weight;

    if (weight < 0) {
      throw new Error('dijkstra does not allow negative edge weights. ' + 'Bad edge: ' + edge + ' Weight: ' + weight);
    }

    if (distance < wEntry.distance) {
      wEntry.distance = distance;
      wEntry.predecessor = v;
      pq.decrease(w, distance);
    }
  };

  g.nodes().forEach(function (v) {
    var distance = v === source ? 0 : Number.POSITIVE_INFINITY;
    results[v] = { distance: distance };
    pq.add(v, distance);
  });

  while (pq.size() > 0) {
    v = pq.removeMin();
    vEntry = results[v];
    if (vEntry.distance === Number.POSITIVE_INFINITY) {
      break;
    }

    edgeFn(v).forEach(updateNeighbors);
  }

  return results;
}

module.exports = exports['default'];
});

var dijkstra$1 = unwrapExports(dijkstra);

var dijkstra$2 = /*#__PURE__*/Object.freeze({
	default: dijkstra$1,
	__moduleExports: dijkstra
});

var _dijkstra = ( dijkstra$2 && dijkstra$1 ) || dijkstra$2;

var dijkstraAll = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, weightFunc, edgeFunc) {
  return _lodash2.default.transform(g.nodes(), function (acc, v) {
    acc[v] = (0, _dijkstra2.default)(g, v, weightFunc, edgeFunc);
  }, {});
};



var _lodash2 = _interopRequireDefault(_lodash);



var _dijkstra2 = _interopRequireDefault(_dijkstra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var dijkstraAll$1 = unwrapExports(dijkstraAll);

var dijkstraAll$2 = /*#__PURE__*/Object.freeze({
	default: dijkstraAll$1,
	__moduleExports: dijkstraAll
});

var tarjan = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g) {
  var index = 0;
  var stack = [];
  var visited = {}; // node id -> { onStack, lowlink, index }
  var results = [];

  function dfs(v) {
    var entry = visited[v] = {
      onStack: true,
      lowlink: index,
      index: index++
    };
    stack.push(v);

    g.successors(v).forEach(function (w) {
      if (!_lodash2.default.has(visited, w)) {
        dfs(w);
        entry.lowlink = Math.min(entry.lowlink, visited[w].lowlink);
      } else if (visited[w].onStack) {
        entry.lowlink = Math.min(entry.lowlink, visited[w].index);
      }
    });

    if (entry.lowlink === entry.index) {
      var cmpt = [];
      var w;
      do {
        w = stack.pop();
        visited[w].onStack = false;
        cmpt.push(w);
      } while (v !== w);
      results.push(cmpt);
    }
  }

  g.nodes().forEach(function (v) {
    if (!_lodash2.default.has(visited, v)) {
      dfs(v);
    }
  });

  return results;
};



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var tarjan$1 = unwrapExports(tarjan);

var tarjan$2 = /*#__PURE__*/Object.freeze({
	default: tarjan$1,
	__moduleExports: tarjan
});

var _tarjan = ( tarjan$2 && tarjan$1 ) || tarjan$2;

var findCycles = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g) {
  return _lodash2.default.filter((0, _tarjan2.default)(g), function (cmpt) {
    return cmpt.length > 1 || cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0]);
  });
};



var _lodash2 = _interopRequireDefault(_lodash);



var _tarjan2 = _interopRequireDefault(_tarjan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var findCycles$1 = unwrapExports(findCycles);

var findCycles$2 = /*#__PURE__*/Object.freeze({
	default: findCycles$1,
	__moduleExports: findCycles
});

var floydWarshall = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, weightFn, edgeFn) {
  weightFn = weightFn || DEFAULT_WEIGHT_FUNC;
  edgeFn = edgeFn || function (v) {
    return g.outEdges(v);
  };
  return runFloydWarshall(g, weightFn, edgeFn);
};



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_WEIGHT_FUNC = _lodash2.default.constant(1);

function runFloydWarshall(g, weightFn, edgeFn) {
  var results = {};
  var nodes = g.nodes();

  nodes.forEach(function (v) {
    results[v] = {};
    results[v][v] = { distance: 0 };
    nodes.forEach(function (w) {
      if (v !== w) {
        results[v][w] = { distance: Number.POSITIVE_INFINITY };
      }
    });
    edgeFn(v).forEach(function (edge) {
      var w = edge.v === v ? edge.w : edge.v;
      var d = weightFn(edge);
      results[v][w] = { distance: d, predecessor: v };
    });
  });

  nodes.forEach(function (k) {
    var rowK = results[k];
    nodes.forEach(function (i) {
      var rowI = results[i];
      nodes.forEach(function (j) {
        var ik = rowI[k];
        var kj = rowK[j];
        var ij = rowI[j];
        var altDistance = ik.distance + kj.distance;
        if (altDistance < ij.distance) {
          ij.distance = altDistance;
          ij.predecessor = kj.predecessor;
        }
      });
    });
  });

  return results;
}

module.exports = exports['default'];
});

var floydWarshall$1 = unwrapExports(floydWarshall);

var floydWarshall$2 = /*#__PURE__*/Object.freeze({
	default: floydWarshall$1,
	__moduleExports: floydWarshall
});

var topsort_1 = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function CycleException() {}

function topsort(g) {
  var visited = {};
  var stack = {};
  var results = [];

  function visit(node) {
    if (_lodash2.default.has(stack, node)) {
      throw new CycleException();
    }

    if (!_lodash2.default.has(visited, node)) {
      stack[node] = true;
      visited[node] = true;
      _lodash2.default.each(g.predecessors(node), visit);
      delete stack[node];
      results.push(node);
    }
  }

  _lodash2.default.each(g.sinks(), visit);

  if (_lodash2.default.size(visited) !== g.nodeCount()) {
    throw new CycleException();
  }

  return results;
}

topsort.CycleException = CycleException;

exports.default = topsort;
module.exports = exports['default'];
});

var topsort = unwrapExports(topsort_1);

var topsort$1 = /*#__PURE__*/Object.freeze({
	default: topsort,
	__moduleExports: topsort_1
});

var _topsort = ( topsort$1 && topsort ) || topsort$1;

var isAcyclic = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g) {
  try {
    (0, _topsort2.default)(g);
  } catch (e) {
    if (e instanceof _topsort2.default.CycleException) {
      return false;
    }
    throw e;
  }
  return true;
};



var _topsort2 = _interopRequireDefault(_topsort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var isAcyclic$1 = unwrapExports(isAcyclic);

var isAcyclic$2 = /*#__PURE__*/Object.freeze({
	default: isAcyclic$1,
	__moduleExports: isAcyclic
});

var dfs = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, vs, order) {
  if (!_lodash2.default.isArray(vs)) {
    vs = [vs];
  }

  var navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);

  var acc = [];
  var visited = {};
  _lodash2.default.each(vs, function (v) {
    if (!g.hasNode(v)) {
      throw new Error('Graph does not have node: ' + v);
    }

    doDfs(g, v, order === 'post', visited, navigation, acc);
  });
  return acc;
};



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doDfs(g, v, postorder, visited, navigation, acc) {
  if (!_lodash2.default.has(visited, v)) {
    visited[v] = true;

    if (!postorder) {
      acc.push(v);
    }
    _lodash2.default.each(navigation(v), function (w) {
      doDfs(g, w, postorder, visited, navigation, acc);
    });
    if (postorder) {
      acc.push(v);
    }
  }
}

/*
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
module.exports = exports['default'];
});

var dfs$1 = unwrapExports(dfs);

var dfs$2 = /*#__PURE__*/Object.freeze({
	default: dfs$1,
	__moduleExports: dfs
});

var _dfs = ( dfs$2 && dfs$1 ) || dfs$2;

var postorder = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, vs) {
  return (0, _dfs2.default)(g, vs, 'post');
};



var _dfs2 = _interopRequireDefault(_dfs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var postorder$1 = unwrapExports(postorder);

var postorder$2 = /*#__PURE__*/Object.freeze({
	default: postorder$1,
	__moduleExports: postorder
});

var preorder = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, vs) {
  return (0, _dfs2.default)(g, vs, 'pre');
};



var _dfs2 = _interopRequireDefault(_dfs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var preorder$1 = unwrapExports(preorder);

var preorder$2 = /*#__PURE__*/Object.freeze({
	default: preorder$1,
	__moduleExports: preorder
});

var graph = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_EDGE_NAME = '\x00';
var GRAPH_NODE = '\x00';
var EDGE_KEY_DELIM = '\x01';

// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.

function Graph(opts) {
  this._isDirected = _lodash2.default.has(opts, 'directed') ? opts.directed : true;
  this._isMultigraph = _lodash2.default.has(opts, 'multigraph') ? opts.multigraph : false;
  this._isCompound = _lodash2.default.has(opts, 'compound') ? opts.compound : false;

  // Label for the graph itself
  this._label = undefined;

  // Defaults to be set when creating a new node
  this._defaultNodeLabelFn = _lodash2.default.constant(undefined);

  // Defaults to be set when creating a new edge
  this._defaultEdgeLabelFn = _lodash2.default.constant(undefined);

  // v -> label
  this._nodes = {};

  if (this._isCompound) {
    // v -> parent
    this._parent = {};

    // v -> children
    this._children = {};
    this._children[GRAPH_NODE] = {};
  }

  // v -> edgeObj
  this._in = {};

  // u -> v -> Number
  this._preds = {};

  // v -> edgeObj
  this._out = {};

  // v -> w -> Number
  this._sucs = {};

  // e -> edgeObj
  this._edgeObjs = {};

  // e -> label
  this._edgeLabels = {};
}

/* Number of nodes in the graph. Should only be changed by the implementation. */
Graph.prototype._nodeCount = 0;

/* Number of edges in the graph. Should only be changed by the implementation. */
Graph.prototype._edgeCount = 0;

/* === Graph functions ========= */

Graph.prototype.isDirected = function () {
  return this._isDirected;
};

Graph.prototype.isMultigraph = function () {
  return this._isMultigraph;
};

Graph.prototype.isCompound = function () {
  return this._isCompound;
};

Graph.prototype.setGraph = function (label) {
  this._label = label;
  return this;
};

Graph.prototype.graph = function () {
  return this._label;
};

/* === Node functions ========== */

Graph.prototype.setDefaultNodeLabel = function (newDefault) {
  if (!_lodash2.default.isFunction(newDefault)) {
    newDefault = _lodash2.default.constant(newDefault);
  }
  this._defaultNodeLabelFn = newDefault;
  return this;
};

Graph.prototype.nodeCount = function () {
  return this._nodeCount;
};

Graph.prototype.nodes = function () {
  return _lodash2.default.keys(this._nodes);
};

Graph.prototype.sources = function () {
  return _lodash2.default.filter(this.nodes(), _lodash2.default.bind(function (v) {
    return _lodash2.default.isEmpty(this._in[v]);
  }, this));
};

Graph.prototype.sinks = function () {
  return _lodash2.default.filter(this.nodes(), _lodash2.default.bind(function (v) {
    return _lodash2.default.isEmpty(this._out[v]);
  }, this));
};

Graph.prototype.setNodes = function (vs, value) {
  var args = arguments;
  _lodash2.default.each(vs, _lodash2.default.bind(function (v) {
    if (args.length > 1) {
      this.setNode(v, value);
    } else {
      this.setNode(v);
    }
  }, this));
  return this;
};

Graph.prototype.setNode = function (v, value) {
  if (_lodash2.default.has(this._nodes, v)) {
    if (arguments.length > 1) {
      this._nodes[v] = value;
    }
    return this;
  }

  this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
  if (this._isCompound) {
    this._parent[v] = GRAPH_NODE;
    this._children[v] = {};
    this._children[GRAPH_NODE][v] = true;
  }
  this._in[v] = {};
  this._preds[v] = {};
  this._out[v] = {};
  this._sucs[v] = {};
  ++this._nodeCount;
  return this;
};

Graph.prototype.node = function (v) {
  return this._nodes[v];
};

Graph.prototype.hasNode = function (v) {
  return _lodash2.default.has(this._nodes, v);
};

Graph.prototype.removeNode = function (v) {
  var self = this;
  if (_lodash2.default.has(this._nodes, v)) {
    var removeEdge = function removeEdge(e) {
      self.removeEdge(self._edgeObjs[e]);
    };
    delete this._nodes[v];
    if (this._isCompound) {
      this._removeFromParentsChildList(v);
      delete this._parent[v];
      _lodash2.default.each(this.children(v), _lodash2.default.bind(function (child) {
        this.setParent(child);
      }, this));
      delete this._children[v];
    }
    _lodash2.default.each(_lodash2.default.keys(this._in[v]), removeEdge);
    delete this._in[v];
    delete this._preds[v];
    _lodash2.default.each(_lodash2.default.keys(this._out[v]), removeEdge);
    delete this._out[v];
    delete this._sucs[v];
    --this._nodeCount;
  }
  return this;
};

Graph.prototype.setParent = function (v, parent) {
  if (!this._isCompound) {
    throw new Error('Cannot set parent in a non-compound graph');
  }

  if (_lodash2.default.isUndefined(parent)) {
    parent = GRAPH_NODE;
  } else {
    // Coerce parent to string
    parent += '';
    for (var ancestor = parent; !_lodash2.default.isUndefined(ancestor); ancestor = this.parent(ancestor)) {
      if (ancestor === v) {
        throw new Error('Setting ' + parent + ' as parent of ' + v + ' would create create a cycle');
      }
    }

    this.setNode(parent);
  }

  this.setNode(v);
  this._removeFromParentsChildList(v);
  this._parent[v] = parent;
  this._children[parent][v] = true;
  return this;
};

Graph.prototype._removeFromParentsChildList = function (v) {
  delete this._children[this._parent[v]][v];
};

Graph.prototype.parent = function (v) {
  if (this._isCompound) {
    var parent = this._parent[v];
    if (parent !== GRAPH_NODE) {
      return parent;
    }
  }
};

Graph.prototype.children = function (v) {
  if (_lodash2.default.isUndefined(v)) {
    v = GRAPH_NODE;
  }

  if (this._isCompound) {
    var children = this._children[v];
    if (children) {
      return _lodash2.default.keys(children);
    }
  } else if (v === GRAPH_NODE) {
    return this.nodes();
  } else if (this.hasNode(v)) {
    return [];
  }
};

Graph.prototype.predecessors = function (v) {
  var predsV = this._preds[v];
  if (predsV) {
    return _lodash2.default.keys(predsV);
  }
};

Graph.prototype.successors = function (v) {
  var sucsV = this._sucs[v];
  if (sucsV) {
    return _lodash2.default.keys(sucsV);
  }
};

Graph.prototype.neighbors = function (v) {
  var preds = this.predecessors(v);
  if (preds) {
    return _lodash2.default.union(preds, this.successors(v));
  }
};

Graph.prototype.filterNodes = function (filter) {
  var copy = new this.constructor({
    directed: this._isDirected,
    multigraph: this._isMultigraph,
    compound: this._isCompound
  });

  copy.setGraph(this.graph());

  _lodash2.default.each(this._nodes, _lodash2.default.bind(function (value, v) {
    if (filter(v)) {
      copy.setNode(v, value);
    }
  }, this));

  _lodash2.default.each(this._edgeObjs, _lodash2.default.bind(function (e) {
    if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
      copy.setEdge(e, this.edge(e));
    }
  }, this));

  var self = this;
  var parents = {};
  function findParent(v) {
    var parent = self.parent(v);
    if (parent === undefined || copy.hasNode(parent)) {
      parents[v] = parent;
      return parent;
    } else if (parent in parents) {
      return parents[parent];
    } else {
      return findParent(parent);
    }
  }

  if (this._isCompound) {
    _lodash2.default.each(copy.nodes(), function (v) {
      copy.setParent(v, findParent(v));
    });
  }

  return copy;
};

/* === Edge functions ========== */

Graph.prototype.setDefaultEdgeLabel = function (newDefault) {
  if (!_lodash2.default.isFunction(newDefault)) {
    newDefault = _lodash2.default.constant(newDefault);
  }
  this._defaultEdgeLabelFn = newDefault;
  return this;
};

Graph.prototype.edgeCount = function () {
  return this._edgeCount;
};

Graph.prototype.edges = function () {
  return _lodash2.default.values(this._edgeObjs);
};

Graph.prototype.setPath = function (vs, value) {
  var self = this;
  var args = arguments;
  _lodash2.default.reduce(vs, function (v, w) {
    if (args.length > 1) {
      self.setEdge(v, w, value);
    } else {
      self.setEdge(v, w);
    }
    return w;
  });
  return this;
};

/*
 * setEdge(v, w, [value, [name]])
 * setEdge({ v, w, [name] }, [value])
 */
Graph.prototype.setEdge = function () {
  var v, w, name, value;
  var valueSpecified = false;
  var arg0 = arguments[0];

  if ((typeof arg0 === 'undefined' ? 'undefined' : _typeof(arg0)) === 'object' && arg0 !== null && 'v' in arg0) {
    v = arg0.v;
    w = arg0.w;
    name = arg0.name;
    if (arguments.length === 2) {
      value = arguments[1];
      valueSpecified = true;
    }
  } else {
    v = arg0;
    w = arguments[1];
    name = arguments[3];
    if (arguments.length > 2) {
      value = arguments[2];
      valueSpecified = true;
    }
  }

  v = '' + v;
  w = '' + w;
  if (!_lodash2.default.isUndefined(name)) {
    name = '' + name;
  }

  var e = edgeArgsToId(this._isDirected, v, w, name);
  if (_lodash2.default.has(this._edgeLabels, e)) {
    if (valueSpecified) {
      this._edgeLabels[e] = value;
    }
    return this;
  }

  if (!_lodash2.default.isUndefined(name) && !this._isMultigraph) {
    throw new Error('Cannot set a named edge when isMultigraph = false');
  }

  // It didn't exist, so we need to create it.
  // First ensure the nodes exist.
  this.setNode(v);
  this.setNode(w);

  this._edgeLabels[e] = valueSpecified ? value : this._defaultEdgeLabelFn(v, w, name);

  var edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
  // Ensure we add undirected edges in a consistent way.
  v = edgeObj.v;
  w = edgeObj.w;

  Object.freeze(edgeObj);
  this._edgeObjs[e] = edgeObj;
  incrementOrInitEntry(this._preds[w], v);
  incrementOrInitEntry(this._sucs[v], w);
  this._in[w][e] = edgeObj;
  this._out[v][e] = edgeObj;
  this._edgeCount++;
  return this;
};

Graph.prototype.edge = function (v, w, name) {
  var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
  return this._edgeLabels[e];
};

Graph.prototype.hasEdge = function (v, w, name) {
  var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
  return _lodash2.default.has(this._edgeLabels, e);
};

Graph.prototype.removeEdge = function (v, w, name) {
  var e = arguments.length === 1 ? edgeObjToId(this._isDirected, arguments[0]) : edgeArgsToId(this._isDirected, v, w, name);
  var edge = this._edgeObjs[e];
  if (edge) {
    v = edge.v;
    w = edge.w;
    delete this._edgeLabels[e];
    delete this._edgeObjs[e];
    decrementOrRemoveEntry(this._preds[w], v);
    decrementOrRemoveEntry(this._sucs[v], w);
    delete this._in[w][e];
    delete this._out[v][e];
    this._edgeCount--;
  }
  return this;
};

Graph.prototype.inEdges = function (v, u) {
  var inV = this._in[v];
  if (inV) {
    var edges = _lodash2.default.values(inV);
    if (!u) {
      return edges;
    }
    return _lodash2.default.filter(edges, function (edge) {
      return edge.v === u;
    });
  }
};

Graph.prototype.outEdges = function (v, w) {
  var outV = this._out[v];
  if (outV) {
    var edges = _lodash2.default.values(outV);
    if (!w) {
      return edges;
    }
    return _lodash2.default.filter(edges, function (edge) {
      return edge.w === w;
    });
  }
};

Graph.prototype.nodeEdges = function (v, w) {
  var inEdges = this.inEdges(v, w);
  if (inEdges) {
    return inEdges.concat(this.outEdges(v, w));
  }
};

function incrementOrInitEntry(map, k) {
  if (map[k]) {
    map[k]++;
  } else {
    map[k] = 1;
  }
}

function decrementOrRemoveEntry(map, k) {
  if (! --map[k]) {
    delete map[k];
  }
}

function edgeArgsToId(isDirected, v_, w_, name) {
  var v = '' + v_;
  var w = '' + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return v + EDGE_KEY_DELIM + w + EDGE_KEY_DELIM + (_lodash2.default.isUndefined(name) ? DEFAULT_EDGE_NAME : name);
}

function edgeArgsToObj(isDirected, v_, w_, name) {
  var v = '' + v_;
  var w = '' + w_;
  if (!isDirected && v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  var edgeObj = { v: v, w: w };
  if (name) {
    edgeObj.name = name;
  }
  return edgeObj;
}

function edgeObjToId(isDirected, edgeObj) {
  return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}

exports.default = Graph;
module.exports = exports['default'];
});

var graph$1 = unwrapExports(graph);

var graph$2 = /*#__PURE__*/Object.freeze({
	default: graph$1,
	__moduleExports: graph
});

var _graph = ( graph$2 && graph$1 ) || graph$2;

var prim = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (g, weightFunc) {
  var result = new _graph2.default();
  var parents = {};
  var pq = new _priorityQueue2.default();
  var v;

  function updateNeighbors(edge) {
    var w = edge.v === v ? edge.w : edge.v;
    var pri = pq.priority(w);
    if (pri !== undefined) {
      var edgeWeight = weightFunc(edge);
      if (edgeWeight < pri) {
        parents[w] = v;
        pq.decrease(w, edgeWeight);
      }
    }
  }

  if (g.nodeCount() === 0) {
    return result;
  }

  _lodash2.default.each(g.nodes(), function (v) {
    pq.add(v, Number.POSITIVE_INFINITY);
    result.setNode(v);
  });

  // Start from an arbitrary node
  pq.decrease(g.nodes()[0], 0);

  var init = false;
  while (pq.size() > 0) {
    v = pq.removeMin();
    if (_lodash2.default.has(parents, v)) {
      result.setEdge(v, parents[v]);
    } else if (init) {
      throw new Error('Input graph is not connected: ' + g);
    } else {
      init = true;
    }

    g.nodeEdges(v).forEach(updateNeighbors);
  }

  return result;
};



var _lodash2 = _interopRequireDefault(_lodash);



var _graph2 = _interopRequireDefault(_graph);



var _priorityQueue2 = _interopRequireDefault(_priorityQueue);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];
});

var prim$1 = unwrapExports(prim);

var prim$2 = /*#__PURE__*/Object.freeze({
	default: prim$1,
	__moduleExports: prim
});

var _components = ( components$2 && components$1 ) || components$2;

var _dijkstraAll = ( dijkstraAll$2 && dijkstraAll$1 ) || dijkstraAll$2;

var _findCycles = ( findCycles$2 && findCycles$1 ) || findCycles$2;

var _floydWarshall = ( floydWarshall$2 && floydWarshall$1 ) || floydWarshall$2;

var _isAcyclic = ( isAcyclic$2 && isAcyclic$1 ) || isAcyclic$2;

var _postorder = ( postorder$2 && postorder$1 ) || postorder$2;

var _preorder = ( preorder$2 && preorder$1 ) || preorder$2;

var _prim = ( prim$2 && prim$1 ) || prim$2;

var alg = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topsort = exports.tarjan = exports.prim = exports.preorder = exports.postorder = exports.isAcyclic = exports.floydWarshall = exports.findCycles = exports.dijkstraAll = exports.dijkstra = exports.components = undefined;



var _components2 = _interopRequireDefault(_components);



var _dijkstra2 = _interopRequireDefault(_dijkstra);



var _dijkstraAll2 = _interopRequireDefault(_dijkstraAll);



var _findCycles2 = _interopRequireDefault(_findCycles);



var _floydWarshall2 = _interopRequireDefault(_floydWarshall);



var _isAcyclic2 = _interopRequireDefault(_isAcyclic);



var _postorder2 = _interopRequireDefault(_postorder);



var _preorder2 = _interopRequireDefault(_preorder);



var _prim2 = _interopRequireDefault(_prim);



var _tarjan2 = _interopRequireDefault(_tarjan);



var _topsort2 = _interopRequireDefault(_topsort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.components = _components2.default;
exports.dijkstra = _dijkstra2.default;
exports.dijkstraAll = _dijkstraAll2.default;
exports.findCycles = _findCycles2.default;
exports.floydWarshall = _floydWarshall2.default;
exports.isAcyclic = _isAcyclic2.default;
exports.postorder = _postorder2.default;
exports.preorder = _preorder2.default;
exports.prim = _prim2.default;
exports.tarjan = _tarjan2.default;
exports.topsort = _topsort2.default;
exports.default = {
  components: _components2.default,
  dijkstra: _dijkstra2.default,
  dijkstraAll: _dijkstraAll2.default,
  findCycles: _findCycles2.default,
  floydWarshall: _floydWarshall2.default,
  isAcyclic: _isAcyclic2.default,
  postorder: _postorder2.default,
  preorder: _preorder2.default,
  prim: _prim2.default,
  tarjan: _tarjan2.default,
  topsort: _topsort2.default
};
});

var index = unwrapExports(alg);
var alg_1 = alg.topsort;
var alg_2 = alg.tarjan;
var alg_3 = alg.prim;
var alg_4 = alg.preorder;
var alg_5 = alg.postorder;
var alg_6 = alg.isAcyclic;
var alg_7 = alg.floydWarshall;
var alg_8 = alg.findCycles;
var alg_9 = alg.dijkstraAll;
var alg_10 = alg.dijkstra;
var alg_11 = alg.components;

var alg$1 = /*#__PURE__*/Object.freeze({
	default: index,
	__moduleExports: alg,
	topsort: alg_1,
	tarjan: alg_2,
	prim: alg_3,
	preorder: alg_4,
	postorder: alg_5,
	isAcyclic: alg_6,
	floydWarshall: alg_7,
	findCycles: alg_8,
	dijkstraAll: alg_9,
	dijkstra: alg_10,
	components: alg_11
});

var json = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.read = read;
exports.write = write;



var _lodash2 = _interopRequireDefault(_lodash);



var _graph2 = _interopRequireDefault(_graph);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function writeNodes(g) {
  return _lodash2.default.map(g.nodes(), function (v) {
    var nodeValue = g.node(v);
    var parent = g.parent(v);
    var node = { v: v };
    if (!_lodash2.default.isUndefined(nodeValue)) {
      node.value = nodeValue;
    }
    if (!_lodash2.default.isUndefined(parent)) {
      node.parent = parent;
    }
    return node;
  });
}

function writeEdges(g) {
  return _lodash2.default.map(g.edges(), function (e) {
    var edgeValue = g.edge(e);
    var edge = { v: e.v, w: e.w };
    if (!_lodash2.default.isUndefined(e.name)) {
      edge.name = e.name;
    }
    if (!_lodash2.default.isUndefined(edgeValue)) {
      edge.value = edgeValue;
    }
    return edge;
  });
}

function read(json) {
  var g = new _graph2.default(json.options).setGraph(json.value);
  _lodash2.default.each(json.nodes, function (entry) {
    g.setNode(entry.v, entry.value);
    if (entry.parent) {
      g.setParent(entry.v, entry.parent);
    }
  });
  _lodash2.default.each(json.edges, function (entry) {
    g.setEdge({ v: entry.v, w: entry.w, name: entry.name }, entry.value);
  });
  return g;
}

function write(g) {
  var json = {
    options: {
      directed: g.isDirected(),
      multigraph: g.isMultigraph(),
      compound: g.isCompound()
    },
    nodes: writeNodes(g),
    edges: writeEdges(g)
  };
  if (!_lodash2.default.isUndefined(g.graph())) {
    json.value = _lodash2.default.clone(g.graph());
  }
  return json;
}

exports.default = {
  write: write,
  read: read
};
});

var json$1 = unwrapExports(json);
var json_1 = json.read;
var json_2 = json.write;

var json$2 = /*#__PURE__*/Object.freeze({
	default: json$1,
	__moduleExports: json,
	read: json_1,
	write: json_2
});

var alg$2 = ( alg$1 && index ) || alg$1;

var json$3 = ( json$2 && json$1 ) || json$2;

/**
 * Copyright (c) 2014, Chris Pettitt
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

 
 
 

 var cienaGraphlib = {
   alg: alg$2,
   Graph: _graph,
   json: json$3
 };
var cienaGraphlib_1 = cienaGraphlib.alg;
var cienaGraphlib_2 = cienaGraphlib.Graph;

export { cienaGraphlib_2 as Graph, cienaGraphlib_1 as alg };
