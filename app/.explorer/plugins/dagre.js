import _ from './lodash.js';
import { Graph, alg } from './graphlib.js';

/*
 * Adds a dummy node to the graph and return v.
 */
function addDummyNode (g, type, attrs, name) {
  var v;
  do {
    v = _.uniqueId(name);
  } while (g.hasNode(v))

  attrs.dummy = type;
  g.setNode(v, attrs);
  return v
}

/*
 * Returns a new graph with only simple edges. Handles aggregation of data
 * associated with multi-edges.
 */
function simplify (g) {
  var simplified = new Graph().setGraph(g.graph());
  _.forEach(g.nodes(), function (v) { simplified.setNode(v, g.node(v)); });
  _.forEach(g.edges(), function (e) {
    var simpleLabel = simplified.edge(e.v, e.w) || { weight: 0, minlen: 1 };
    var label = g.edge(e);
    simplified.setEdge(e.v, e.w, {
      weight: simpleLabel.weight + label.weight,
      minlen: Math.max(simpleLabel.minlen, label.minlen)
    });
  });
  return simplified
}

function asNonCompoundGraph (g) {
  var simplified = new Graph({ multigraph: g.isMultigraph() }).setGraph(g.graph());
  _.forEach(g.nodes(), function (v) {
    if (!g.children(v).length) {
      simplified.setNode(v, g.node(v));
    }
  });
  _.forEach(g.edges(), function (e) {
    simplified.setEdge(e, g.edge(e));
  });
  return simplified
}

/*
 * Finds where a line starting at point ({x, y}) would intersect a rectangle
 * ({x, y, width, height}) if it were pointing at the rectangle's center.
 */
function intersectRect (rect, point) {
  var x = rect.x;
  var y = rect.y;

  // Rectangle intersection algorithm from:
  // http://math.stackexchange.com/questions/108113/find-edge-between-two-boxes
  var dx = point.x - x;
  var dy = point.y - y;
  var w = rect.width / 2;
  var h = rect.height / 2;

  if (!dx && !dy) {
    throw new Error('Not possible to find intersection inside of the rectangle')
  }

  var sx, sy;
  if (Math.abs(dy) * w > Math.abs(dx) * h) {
    // Intersection is top or bottom of rect.
    if (dy < 0) {
      h = -h;
    }
    sx = h * dx / dy;
    sy = h;
  } else {
    // Intersection is left or right of rect.
    if (dx < 0) {
      w = -w;
    }
    sx = w;
    sy = w * dy / dx;
  }

  return { x: x + sx, y: y + sy }
}

/*
 * Given a DAG with each node assigned "rank" and "order" properties, this
 * function will produce a matrix with the ids of each node.
 */
function buildLayerMatrix (g) {
  var layering = _.map(_.range(maxRank(g) + 1), function () { return [] });
  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    var rank = node.rank;
    if (!_.isUndefined(rank)) {
      layering[rank][node.order] = v;
    }
  });
  return layering
}

/*
 * Adjusts the ranks for all nodes in the graph such that all nodes v have
 * rank(v) >= 0 and at least one node w has rank(w) = 0.
 */
function normalizeRanks (g) {
  var min = _.min(_.map(g.nodes(), function (v) { return g.node(v).rank }));
  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    if (_.has(node, 'rank')) {
      node.rank -= min;
    }
  });
}

function removeEmptyRanks (g) {
  // Ranks may not start at 0, so we need to offset them
  var offset = _.min(_.map(g.nodes(), function (v) { return g.node(v).rank }));

  var layers = [];
  _.forEach(g.nodes(), function (v) {
    var rank = g.node(v).rank - offset;
    if (!layers[rank]) {
      layers[rank] = [];
    }
    layers[rank].push(v);
  });

  var delta = 0;
  var nodeRankFactor = g.graph().nodeRankFactor;
  _.forEach(layers, function (vs, i) {
    if (_.isUndefined(vs) && i % nodeRankFactor !== 0) {
      --delta;
    } else if (delta) {
      _.forEach(vs, function (v) { g.node(v).rank += delta; });
    }
  });
}

function addBorderNode (g, prefix, rank, order) {
  var node = {
    width: 0,
    height: 0
  };
  if (arguments.length >= 4) {
    node.rank = rank;
    node.order = order;
  }
  return addDummyNode(g, 'border', node, prefix)
}

function maxRank (g) {
  return _.max(_.map(g.nodes(), function (v) {
    var rank = g.node(v).rank;
    if (!_.isUndefined(rank)) {
      return rank
    }
  }))
}

/*
 * Partition a collection into two groups: `lhs` and `rhs`. If the supplied
 * function returns true for an entry it goes into `lhs`. Otherwise it goes
 * into `rhs.
 */
function partition (collection, fn) {
  var result = { lhs: [], rhs: [] };
  _.forEach(collection, function (value) {
    if (fn(value)) {
      result.lhs.push(value);
    } else {
      result.rhs.push(value);
    }
  });
  return result
}

/*
 * Returns a new function that wraps `fn` with a timer. The wrapper logs the
 * time it takes to execute the function.
 */
function time (name, fn) {
  var start = _.now();
  try {
    return fn()
  } finally {
    console.log(name + ' time: ' + (_.now() - start) + 'ms');
  }
}

function notime (name, fn) {
  return fn()
}

/*
 * Simple doubly linked list implementation derived from Cormen, et al.,
 * "Introduction to Algorithms".
 */

function List () {
  var sentinel = {};
  sentinel._next = sentinel._prev = sentinel;
  this._sentinel = sentinel;
}

List.prototype.dequeue = function () {
  var sentinel = this._sentinel;
  var entry = sentinel._prev;
  if (entry !== sentinel) {
    unlink(entry);
    return entry
  }
};

List.prototype.enqueue = function (entry) {
  var sentinel = this._sentinel;
  if (entry._prev && entry._next) {
    unlink(entry);
  }
  entry._next = sentinel._next;
  sentinel._next._prev = entry;
  sentinel._next = entry;
  entry._prev = sentinel;
};

List.prototype.toString = function () {
  var strs = [];
  var sentinel = this._sentinel;
  var curr = sentinel._prev;
  while (curr !== sentinel) {
    strs.push(JSON.stringify(curr, filterOutLinks));
    curr = curr._prev;
  }
  return '[' + strs.join(', ') + ']'
};

function unlink (entry) {
  entry._prev._next = entry._next;
  entry._next._prev = entry._prev;
  delete entry._next;
  delete entry._prev;
}

function filterOutLinks (k, v) {
  if (k !== '_next' && k !== '_prev') {
    return v
  }
}

var DEFAULT_WEIGHT_FN = _.constant(1);

function doGreedyFAS (g, buckets, zeroIdx) {
  var results = [];
  var sources = buckets[buckets.length - 1];
  var sinks = buckets[0];

  var entry;
  while (g.nodeCount()) {
    while ((entry = sinks.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
    while ((entry = sources.dequeue())) { removeNode(g, buckets, zeroIdx, entry); }
    if (g.nodeCount()) {
      for (var i = buckets.length - 2; i > 0; --i) {
        entry = buckets[i].dequeue();
        if (entry) {
          results = results.concat(removeNode(g, buckets, zeroIdx, entry, true));
          break
        }
      }
    }
  }

  return results
}

function removeNode (g, buckets, zeroIdx, entry, collectPredecessors) {
  var results = collectPredecessors ? [] : undefined;

  _.forEach(g.inEdges(entry.v), function (edge) {
    var weight = g.edge(edge);
    var uEntry = g.node(edge.v);

    if (collectPredecessors) {
      results.push({ v: edge.v, w: edge.w });
    }

    uEntry.out -= weight;
    assignBucket(buckets, zeroIdx, uEntry);
  });

  _.forEach(g.outEdges(entry.v), function (edge) {
    var weight = g.edge(edge);
    var w = edge.w;
    var wEntry = g.node(w);
    wEntry['in'] -= weight;
    assignBucket(buckets, zeroIdx, wEntry);
  });

  g.removeNode(entry.v);

  return results
}

function buildState (g, weightFn) {
  var fasGraph = new Graph();
  var maxIn = 0;
  var maxOut = 0;

  _.forEach(g.nodes(), function (v) {
    fasGraph.setNode(v, { v: v, 'in': 0, out: 0 });
  });

  // Aggregate weights on nodes, but also sum the weights across multi-edges
  // into a single edge for the fasGraph.
  _.forEach(g.edges(), function (e) {
    var prevWeight = fasGraph.edge(e.v, e.w) || 0;
    var weight = weightFn(e);
    var edgeWeight = prevWeight + weight;
    fasGraph.setEdge(e.v, e.w, edgeWeight);
    maxOut = Math.max(maxOut, fasGraph.node(e.v).out += weight);
    maxIn = Math.max(maxIn, fasGraph.node(e.w)['in'] += weight);
  });

  var buckets = _.range(maxOut + maxIn + 3).map(function () { return new List() });
  var zeroIdx = maxIn + 1;

  _.forEach(fasGraph.nodes(), function (v) {
    assignBucket(buckets, zeroIdx, fasGraph.node(v));
  });

  return { graph: fasGraph, buckets: buckets, zeroIdx: zeroIdx }
}

function assignBucket (buckets, zeroIdx, entry) {
  if (!entry.out) {
    buckets[0].enqueue(entry);
  } else if (!entry['in']) {
    buckets[buckets.length - 1].enqueue(entry);
  } else {
    buckets[entry.out - entry['in'] + zeroIdx].enqueue(entry);
  }
}

/*
 * A greedy heuristic for finding a feedback arc set for a graph. A feedback
 * arc set is a set of edges that can be removed to make a graph acyclic.
 * The algorithm comes from: P. Eades, X. Lin, and W. F. Smyth, "A fast and
 * effective heuristic for the feedback arc set problem." This implementation
 * adjusts that from the paper to allow for weighted edges.
 */
function greedyFAS (g, weightFn) {
  if (g.nodeCount() <= 1) {
    return []
  }
  var state = buildState(g, weightFn || DEFAULT_WEIGHT_FN);
  var results = doGreedyFAS(state.graph, state.buckets, state.zeroIdx);

  // Expand multi-edges
  return _.flatten(_.map(results, function (e) {
    return g.outEdges(e.v, e.w)
  }), true)
}

function dfsFAS (g) {
  var fas = [];
  var stack = {};
  var visited = {};

  function dfs (v) {
    if (_.has(visited, v)) {
      return
    }
    visited[v] = true;
    stack[v] = true;
    _.forEach(g.outEdges(v), function (e) {
      if (_.has(stack, e.w)) {
        fas.push(e);
      } else {
        dfs(e.w);
      }
    });
    delete stack[v];
  }

  _.forEach(g.nodes(), dfs);
  return fas
}

function undo (g) {
  _.forEach(g.edges(), function (e) {
    var label = g.edge(e);
    if (label.reversed) {
      g.removeEdge(e);

      var forwardName = label.forwardName;
      delete label.reversed;
      delete label.forwardName;
      g.setEdge(e.w, e.v, label, forwardName);
    }
  });
}

function run (g) {
  var fas = (g.graph().acyclicer === 'greedy'
                ? greedyFAS(g, weightFn(g))
                : dfsFAS(g));
  _.forEach(fas, function (e) {
    var label = g.edge(e);
    g.removeEdge(e);
    label.forwardName = e.name;
    label.reversed = true;
    g.setEdge(e.w, e.v, label, _.uniqueId('rev'));
  });

  function weightFn (g) {
    return function (e) {
      return g.edge(e).weight
    }
  }
}

function normalizeEdge (g, e) {
  var v = e.v;
  var vRank = g.node(v).rank;
  var w = e.w;
  var wRank = g.node(w).rank;
  var name = e.name;
  var edgeLabel = g.edge(e);
  var labelRank = edgeLabel.labelRank;

  if (wRank === vRank + 1) return

  g.removeEdge(e);

  var dummy, attrs, i;
  for (i = 0, ++vRank; vRank < wRank; ++i, ++vRank) {
    edgeLabel.points = [];
    attrs = {
      width: 0,
      height: 0,
      edgeLabel: edgeLabel,
      edgeObj: e,
      rank: vRank
    };
    dummy = addDummyNode(g, 'edge', attrs, '_d');
    if (vRank === labelRank) {
      attrs.width = edgeLabel.width;
      attrs.height = edgeLabel.height;
      attrs.dummy = 'edge-label';
      attrs.labelpos = edgeLabel.labelpos;
    }
    g.setEdge(v, dummy, { weight: edgeLabel.weight }, name);
    if (i === 0) {
      g.graph().dummyChains.push(dummy);
    }
    v = dummy;
  }

  g.setEdge(v, w, { weight: edgeLabel.weight }, name);
}

/*
 * Breaks any long edges in the graph into short segments that span 1 layer
 * each. This operation is undoable with the denormalize function.
 *
 * Pre-conditions:
 *
 *    1. The input graph is a DAG.
 *    2. Each node in the graph has a "rank" property.
 *
 * Post-condition:
 *
 *    1. All edges in the graph have a length of 1.
 *    2. Dummy nodes are added where edges have been split into segments.
 *    3. The graph is augmented with a "dummyChains" attribute which contains
 *       the first dummy in each chain of dummy nodes produced.
 */
function run$1 (g) {
  g.graph().dummyChains = [];
  _.forEach(g.edges(), function (edge) { normalizeEdge(g, edge); });
}

function undo$1 (g) {
  _.forEach(g.graph().dummyChains, function (v) {
    var node = g.node(v);
    var origLabel = node.edgeLabel;
    var w;
    g.setEdge(node.edgeObj, origLabel);
    while (node.dummy) {
      w = g.successors(v)[0];
      g.removeNode(v);
      origLabel.points.push({ x: node.x, y: node.y });
      if (node.dummy === 'edge-label') {
        origLabel.x = node.x;
        origLabel.y = node.y;
        origLabel.width = node.width;
        origLabel.height = node.height;
      }
      v = w;
      node = g.node(v);
    }
  });
}

/*
 * Initializes ranks for the input graph using the longest path algorithm. This
 * algorithm scales well and is fast in practice, it yields rather poor
 * solutions. Nodes are pushed to the lowest layer possible, leaving the bottom
 * ranks wide and leaving edges longer than necessary. However, due to its
 * speed, this algorithm is good for getting an initial ranking that can be fed
 * into other algorithms.
 *
 * This algorithm does not normalize layers because it will be used by other
 * algorithms in most cases. If using this algorithm directly, be sure to
 * run normalize at the end.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG.
 *    2. Input graph node labels can be assigned properties.
 *
 * Post-conditions:
 *
 *    1. Each node will be assign an (unnormalized) "rank" property.
 */
function longestPath (g) {
  var visited = {};

  function dfs (v) {
    var label = g.node(v);
    if (_.has(visited, v)) {
      return label.rank
    }
    visited[v] = true;

    var rank = _.min(_.map(g.outEdges(v), function (e) {
      return dfs(e.w) - g.edge(e).minlen
    }));

    if (
      rank === Number.POSITIVE_INFINITY || // return value of _.map([]) for Lodash 3
      rank === undefined || // return value of _.map([]) for Lodash 4
      rank === null // return value of _.map([null])
    ) {
      rank = 0;
    }

    return (label.rank = rank)
  }

  _.forEach(g.sources(), dfs);
}

/*
 * Returns the amount of slack for the given edge. The slack is defined as the
 * difference between the length of the edge and its minimum length.
 */
function slack (g, e) {
  return g.node(e.w).rank - g.node(e.v).rank - g.edge(e).minlen
}

/*
 * Finds a maximal tree of tight edges and returns the number of nodes in the
 * tree.
 */
function tightTree (t, g) {
  function dfs (v) {
    _.forEach(g.nodeEdges(v), function (e) {
      var edgeV = e.v;
      var w = (v === edgeV) ? e.w : edgeV;
      if (!t.hasNode(w) && !slack(g, e)) {
        t.setNode(w, {});
        t.setEdge(v, w, {});
        dfs(w);
      }
    });
  }

  _.forEach(t.nodes(), dfs);
  return t.nodeCount()
}

/*
 * Finds the edge with the smallest slack that is incident on tree and returns
 * it.
 */
function findMinSlackEdge (t, g) {
  return _.minBy(g.edges(), function (e) {
    if (t.hasNode(e.v) !== t.hasNode(e.w)) {
      return slack(g, e)
    }
  })
}

function shiftRanks (t, g, delta) {
  _.forEach(t.nodes(), function (v) {
    g.node(v).rank += delta;
  });
}

/*
 * Constructs a spanning tree with tight edges and adjusted the input node's
 * ranks to achieve this. A tight edge is one that is has a length that matches
 * its "minlen" attribute.
 *
 * The basic structure for this function is derived from Gansner, et al., "A
 * Technique for Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a DAG.
 *    2. Graph must be connected.
 *    3. Graph must have at least one node.
 *    5. Graph nodes must have been previously assigned a "rank" property that
 *       respects the "minlen" property of incident edges.
 *    6. Graph edges must have a "minlen" property.
 *
 * Post-conditions:
 *
 *    - Graph nodes will have their rank adjusted to ensure that all edges are
 *      tight.
 *
 * Returns a tree (undirected graph) that is constructed using only "tight"
 * edges.
 */
function feasibleTree (g) {
  var t = new Graph({ directed: false });

  // Choose arbitrary node from which to start our tree
  var start = g.nodes()[0];
  var size = g.nodeCount();
  t.setNode(start, {});

  var edge, delta;
  while (tightTree(t, g) < size) {
    edge = findMinSlackEdge(t, g);
    delta = t.hasNode(edge.v) ? slack(g, edge) : -slack(g, edge);
    shiftRanks(t, g, delta);
  }

  return t
}

const {preorder, postorder} = alg;

// Expose some internals for testing purposes
networkSimplex.initLowLimValues = initLowLimValues;
networkSimplex.initCutValues = initCutValues;
networkSimplex.calcCutValue = calcCutValue;
networkSimplex.leaveEdge = leaveEdge;
networkSimplex.enterEdge = enterEdge;
networkSimplex.exchangeEdges = exchangeEdges;

/*
 * Initializes cut values for all edges in the tree.
 */
function initCutValues (t, g) {
  var vs = postorder(t, t.nodes());
  vs = vs.slice(0, vs.length - 1);
  _.forEach(vs, function (v) {
    assignCutValue(t, g, v);
  });
}

function assignCutValue (t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  t.edge(child, parent).cutvalue = calcCutValue(t, g, child);
}

/*
 * Given the tight tree, its graph, and a child in the graph calculate and
 * return the cut value for the edge between the child and its parent.
 */
function calcCutValue (t, g, child) {
  var childLab = t.node(child);
  var parent = childLab.parent;
  // True if the child is on the tail end of the edge in the directed graph
  var childIsTail = true;
  // The graph's view of the tree edge we're inspecting
  var graphEdge = g.edge(child, parent);
  // The accumulated cut value for the edge between this node and its parent
  var cutValue = 0;

  if (!graphEdge) {
    childIsTail = false;
    graphEdge = g.edge(parent, child);
  }

  cutValue = graphEdge.weight;

  _.forEach(g.nodeEdges(child), function (e) {
    var isOutEdge = e.v === child;
    var other = isOutEdge ? e.w : e.v;

    if (other !== parent) {
      var pointsToHead = isOutEdge === childIsTail;
      var otherWeight = g.edge(e).weight;

      cutValue += pointsToHead ? otherWeight : -otherWeight;
      if (isTreeEdge(t, child, other)) {
        var otherCutValue = t.edge(child, other).cutvalue;
        cutValue += pointsToHead ? -otherCutValue : otherCutValue;
      }
    }
  });

  return cutValue
}

function initLowLimValues (tree, root) {
  if (arguments.length < 2) {
    root = tree.nodes()[0];
  }
  dfsAssignLowLim(tree, {}, 1, root);
}

function dfsAssignLowLim (tree, visited, nextLim, v, parent) {
  var low = nextLim;
  var label = tree.node(v);

  visited[v] = true;
  _.forEach(tree.neighbors(v), function (w) {
    if (!_.has(visited, w)) {
      nextLim = dfsAssignLowLim(tree, visited, nextLim, w, v);
    }
  });

  label.low = low;
  label.lim = nextLim++;
  if (parent) {
    label.parent = parent;
  } else {
    // TODO should be able to remove this when we incrementally update low lim
    delete label.parent;
  }

  return nextLim
}

function leaveEdge (tree) {
  return _.find(tree.edges(), function (e) {
    return tree.edge(e).cutvalue < 0
  })
}

function enterEdge (t, g, edge) {
  var v = edge.v;
  var w = edge.w;

  // For the rest of this function we assume that v is the tail and w is the
  // head, so if we don't have this edge in the graph we should flip it to
  // match the correct orientation.
  if (!g.hasEdge(v, w)) {
    v = edge.w;
    w = edge.v;
  }

  var vLabel = t.node(v);
  var wLabel = t.node(w);
  var tailLabel = vLabel;
  var flip = false;

  // If the root is in the tail of the edge then we need to flip the logic that
  // checks for the head and tail nodes in the candidates function below.
  if (vLabel.lim > wLabel.lim) {
    tailLabel = wLabel;
    flip = true;
  }

  var candidates = _.filter(g.edges(), function (edge) {
    return flip === isDescendant(t, t.node(edge.v), tailLabel) &&
           flip !== isDescendant(t, t.node(edge.w), tailLabel)
  });

  return _.minBy(candidates, function (edge) { return slack(g, edge) })
}

function exchangeEdges (t, g, e, f) {
  var v = e.v;
  var w = e.w;
  t.removeEdge(v, w);
  t.setEdge(f.v, f.w, {});
  initLowLimValues(t);
  initCutValues(t, g);
  updateRanks(t, g);
}

function updateRanks (t, g) {
  var root = _.find(t.nodes(), function (v) { return !g.node(v).parent });
  var vs = preorder(t, root);
  vs = vs.slice(1);
  _.forEach(vs, function (v) {
    var parent = t.node(v).parent;
    var edge = g.edge(v, parent);
    var flipped = false;

    if (!edge) {
      edge = g.edge(parent, v);
      flipped = true;
    }

    g.node(v).rank = g.node(parent).rank + (flipped ? edge.minlen : -edge.minlen);
  });
}

/*
 * Returns true if the edge is in the tree.
 */
function isTreeEdge (tree, u, v) {
  return tree.hasEdge(u, v)
}

/*
 * Returns true if the specified node is descendant of the root node per the
 * assigned low and lim attributes in the tree.
 */
function isDescendant (tree, vLabel, rootLabel) {
  return rootLabel.low <= vLabel.lim && vLabel.lim <= rootLabel.lim
}

/*
 * The network simplex algorithm assigns ranks to each node in the input graph
 * and iteratively improves the ranking to reduce the length of edges.
 *
 * Preconditions:
 *
 *    1. The input graph must be a DAG.
 *    2. All nodes in the graph must have an object value.
 *    3. All edges in the graph must have "minlen" and "weight" attributes.
 *
 * Postconditions:
 *
 *    1. All nodes in the graph will have an assigned "rank" attribute that has
 *       been optimized by the network simplex algorithm. Ranks start at 0.
 *
 *
 * A rough sketch of the algorithm is as follows:
 *
 *    1. Assign initial ranks to each node. We use the longest path algorithm,
 *       which assigns ranks to the lowest position possible. In general this
 *       leads to very wide bottom ranks and unnecessarily long edges.
 *    2. Construct a feasible tight tree. A tight tree is one such that all
 *       edges in the tree have no slack (difference between length of edge
 *       and minlen for the edge). This by itself greatly improves the assigned
 *       rankings by shorting edges.
 *    3. Iteratively find edges that have negative cut values. Generally a
 *       negative cut value indicates that the edge could be removed and a new
 *       tree edge could be added to produce a more compact graph.
 *
 * Much of the algorithms here are derived from Gansner, et al., "A Technique
 * for Drawing Directed Graphs." The structure of the file roughly follows the
 * structure of the overall algorithm.
 */
function networkSimplex (g) {
  g = simplify(g);
  longestPath(g);
  var t = feasibleTree(g);
  initLowLimValues(t);
  initCutValues(t, g);

  var e, f;
  while ((e = leaveEdge(t))) {
    f = enterEdge(t, g, e);
    exchangeEdges(t, g, e, f);
  }
}

// A fast and simple ranker, but results are far from optimal.
var longestPathRanker = longestPath;

function tightTreeRanker (g) {
  longestPath(g);
  feasibleTree(g);
}

function networkSimplexRanker (g) {
  networkSimplex(g);
}

/*
 * Assigns a rank to each node in the input graph that respects the "minlen"
 * constraint specified on edges between nodes.
 *
 * This basic structure is derived from Gansner, et al., "A Technique for
 * Drawing Directed Graphs."
 *
 * Pre-conditions:
 *
 *    1. Graph must be a connected DAG
 *    2. Graph nodes must be objects
 *    3. Graph edges must have "weight" and "minlen" attributes
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have a "rank" attribute based on the results of the
 *       algorithm. Ranks can start at any index (including negative), we'll
 *       fix them up later.
 */
function rank (g) {
  switch (g.graph().ranker) {
    case 'network-simplex': networkSimplexRanker(g); break
    case 'tight-tree': tightTreeRanker(g); break
    case 'longest-path': longestPathRanker(g); break
    default: networkSimplexRanker(g);
  }
}

// Find a path from v to w through the lowest common ancestor (LCA). Return the
// full path and the LCA.
function findPath (g, postorderNums, v, w) {
  var vPath = [];
  var wPath = [];
  var low = Math.min(postorderNums[v].low, postorderNums[w].low);
  var lim = Math.max(postorderNums[v].lim, postorderNums[w].lim);
  var parent;
  var lca;

  // Traverse up from v to find the LCA
  parent = v;
  do {
    parent = g.parent(parent);
    vPath.push(parent);
  } while (parent &&
           (postorderNums[parent].low > low || lim > postorderNums[parent].lim))
  lca = parent;

  // Traverse from w to LCA
  parent = w;
  while ((parent = g.parent(parent)) !== lca) {
    wPath.push(parent);
  }

  return { path: vPath.concat(wPath.reverse()), lca: lca }
}

function postorder$1 (g) {
  var result = {};
  var lim = 0;

  function dfs (v) {
    var low = lim;
    _.forEach(g.children(v), dfs);
    result[v] = { low: low, lim: lim++ };
  }
  _.forEach(g.children(), dfs);

  return result
}

function parentDummyChains (g) {
  var postorderNums = postorder$1(g);

  _.forEach(g.graph().dummyChains, function (v) {
    var node = g.node(v);
    var edgeObj = node.edgeObj;
    var pathData = findPath(g, postorderNums, edgeObj.v, edgeObj.w);
    var path = pathData.path;
    var lca = pathData.lca;
    var pathIdx = 0;
    var pathV = path[pathIdx];
    var ascending = true;

    while (v !== edgeObj.w) {
      node = g.node(v);

      if (ascending) {
        while ((pathV = path[pathIdx]) !== lca &&
               g.node(pathV).maxRank < node.rank) {
          pathIdx++;
        }

        if (pathV === lca) {
          ascending = false;
        }
      }

      if (!ascending) {
        while (pathIdx < path.length - 1 &&
               g.node(pathV = path[pathIdx + 1]).minRank <= node.rank) {
          pathIdx++;
        }
        pathV = path[pathIdx];
      }

      g.setParent(v, pathV);
      v = g.successors(v)[0];
    }
  });
}

function dfs (g, root, nodeSep, weight, height, depths, v) {
  var children = g.children(v);
  if (!children.length) {
    if (v !== root) {
      g.setEdge(root, v, { weight: 0, minlen: nodeSep });
    }
    return
  }

  var top = addBorderNode(g, '_bt');
  var bottom = addBorderNode(g, '_bb');
  var label = g.node(v);

  g.setParent(top, v);
  label.borderTop = top;
  g.setParent(bottom, v);
  label.borderBottom = bottom;

  _.forEach(children, function (child) {
    dfs(g, root, nodeSep, weight, height, depths, child);

    var childNode = g.node(child);
    var childTop = childNode.borderTop ? childNode.borderTop : child;
    var childBottom = childNode.borderBottom ? childNode.borderBottom : child;
    var thisWeight = childNode.borderTop ? weight : 2 * weight;
    var minlen = childTop !== childBottom ? 1 : height - depths[v] + 1;

    g.setEdge(top, childTop, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true
    });

    g.setEdge(childBottom, bottom, {
      weight: thisWeight,
      minlen: minlen,
      nestingEdge: true
    });
  });

  if (!g.parent(v)) {
    g.setEdge(root, top, { weight: 0, minlen: height + depths[v] });
  }
}

function sumWeights (g) {
  return _.reduce(g.edges(), function (acc, e) {
    return acc + g.edge(e).weight
  }, 0)
}

function treeDepths (g) {
  var depths = {};
  function dfs (v, depth) {
    var children = g.children(v);
    if (children && children.length) {
      _.forEach(children, function (child) {
        dfs(child, depth + 1);
      });
    }
    depths[v] = depth;
  }
  _.forEach(g.children(), function (v) { dfs(v, 1); });
  return depths
}

function cleanup (g) {
  var graphLabel = g.graph();
  g.removeNode(graphLabel.nestingRoot);
  delete graphLabel.nestingRoot;
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.nestingEdge) {
      g.removeEdge(e);
    }
  });
}

/*
 * A nesting graph creates dummy nodes for the tops and bottoms of subgraphs,
 * adds appropriate edges to ensure that all cluster nodes are placed between
 * these boundries, and ensures that the graph is connected.
 *
 * In addition we ensure, through the use of the minlen property, that nodes
 * and subgraph border nodes to not end up on the same rank.
 *
 * Preconditions:
 *
 *    1. Input graph is a DAG
 *    2. Nodes in the input graph has a minlen attribute
 *
 * Postconditions:
 *
 *    1. Input graph is connected.
 *    2. Dummy nodes are added for the tops and bottoms of subgraphs.
 *    3. The minlen attribute for nodes is adjusted to ensure nodes do not
 *       get placed on the same rank as subgraph border nodes.
 *
 * The nesting graph idea comes from Sander, "Layout of Compound Directed
 * Graphs."
 */
function run$2 (g) {
  var root = addDummyNode(g, 'root', {}, '_root');
  var depths = treeDepths(g);
  var height = _.max(_.values(depths)) - 1; // Note: depths is an Object not an array
  var nodeSep = 2 * height + 1;

  g.graph().nestingRoot = root;

  // Multiply minlen by nodeSep to align nodes on non-border ranks.
  _.forEach(g.edges(), function (e) { g.edge(e).minlen *= nodeSep; });

  // Calculate a weight that is sufficient to keep subgraphs vertically compact
  var weight = sumWeights(g) + 1;

  // Create border nodes and link them up
  _.forEach(g.children(), function (child) {
    dfs(g, root, nodeSep, weight, height, depths, child);
  });

  // Save the multiplier for node layers for later removal of empty border
  // layers.
  g.graph().nodeRankFactor = nodeSep;
}

function addBorderNode$1 (g, prop, prefix, sg, sgNode, rank) {
  var label = { width: 0, height: 0, rank: rank, borderType: prop };
  var prev = sgNode[prop][rank - 1];
  var curr = addDummyNode(g, 'border', label, prefix);
  sgNode[prop][rank] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, { weight: 1 });
  }
}

function addBorderSegments (g) {
  function dfs (v) {
    var children = g.children(v);
    var node = g.node(v);
    if (children.length) {
      _.forEach(children, dfs);
    }

    if (_.has(node, 'minRank')) {
      node.borderLeft = [];
      node.borderRight = [];
      for (var rank = node.minRank, maxRank$$1 = node.maxRank + 1;
           rank < maxRank$$1;
           ++rank) {
        addBorderNode$1(g, 'borderLeft', '_bl', v, node, rank);
        addBorderNode$1(g, 'borderRight', '_br', v, node, rank);
      }
    }
  }

  _.forEach(g.children(), dfs);
}

function swapWidthHeight (g) {
  _.forEach(g.nodes(), function (v) { swapWidthHeightOne(g.node(v)); });
  _.forEach(g.edges(), function (e) { swapWidthHeightOne(g.edge(e)); });
}

function swapWidthHeightOne (attrs) {
  var w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
}

function reverseY (g) {
  _.forEach(g.nodes(), function (v) { reverseYOne(g.node(v)); });

  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    _.forEach(edge.points, reverseYOne);
    if (_.has(edge, 'y')) {
      reverseYOne(edge);
    }
  });
}

function reverseYOne (attrs) {
  attrs.y = -attrs.y;
}

function swapXY (g) {
  _.forEach(g.nodes(), function (v) { swapXYOne(g.node(v)); });

  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    _.forEach(edge.points, swapXYOne);
    if (_.has(edge, 'x')) {
      swapXYOne(edge);
    }
  });
}

function swapXYOne (attrs) {
  var x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}

function adjust (g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === 'lr' || rankDir === 'rl') {
    swapWidthHeight(g);
  }
}

function undo$2 (g) {
  var rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === 'bt' || rankDir === 'rl') {
    reverseY(g);
  }

  if (rankDir === 'lr' || rankDir === 'rl') {
    swapXY(g);
    swapWidthHeight(g);
  }
}

/*
 * Assigns an initial order value for each node by performing a DFS search
 * starting from nodes in the first rank. Nodes are assigned an order in their
 * rank as they are first visited.
 *
 * This approach comes from Gansner, et al., "A Technique for Drawing Directed
 * Graphs."
 *
 * Returns a layering matrix with an array per layer and each layer sorted by
 * the order of its nodes.
 */
function initOrder (g) {
  var visited = {};
  var simpleNodes = _.filter(g.nodes(), function (v) {
    return !g.children(v).length
  });
  var maxRank = _.max(_.map(simpleNodes, function (v) { return g.node(v).rank }));
  var layers = _.map(_.range(maxRank + 1), function () { return [] });

  function dfs (v) {
    if (_.has(visited, v)) return
    visited[v] = true;
    var node = g.node(v);
    layers[node.rank].push(v);
    _.forEach(g.successors(v), dfs);
  }

  var orderedVs = _.sortBy(simpleNodes, function (v) { return g.node(v).rank });
  _.forEach(orderedVs, dfs);

  return layers
}

function twoLayerCrossCount (g, northLayer, southLayer) {
  // Sort all of the edges between the north and south layers by their position
  // in the north layer and then the south. Map these edges to the position of
  // their head in the south layer.
  var southPos = _.zipObject(southLayer,
                             _.map(southLayer, function (v, i) { return i }));
  var southEntries = _.flatten(_.map(northLayer, function (v) {
    // return _.chain(g.outEdges(v))
    //         .map(function (e) {
    //           return { pos: southPos[e.w], weight: g.edge(e).weight }
    //         })
    //         .sortBy('pos')
    //         .value()
    return _.sortBy(
      _.map(g.outEdges(v), function (e) {
        return { pos: southPos[e.w], weight: g.edge(e).weight }
      }), 'pos')
  }), true);

  // Build the accumulator tree
  var firstIndex = 1;
  while (firstIndex < southLayer.length) firstIndex <<= 1;
  var treeSize = 2 * firstIndex - 1;
  firstIndex -= 1;
  var tree = _.map(new Array(treeSize), function () { return 0 });

  // Calculate the weighted crossings
  var cc = 0;
  _.forEach(southEntries.forEach(function (entry) {
    var index = entry.pos + firstIndex;
    tree[index] += entry.weight;
    var weightSum = 0;
    while (index > 0) {
      if (index % 2) {
        weightSum += tree[index + 1];
      }
      index = (index - 1) >> 1;
      tree[index] += entry.weight;
    }
    cc += entry.weight * weightSum;
  }));

  return cc
}

/*
 * A function that takes a layering (an array of layers, each with an array of
 * ordererd nodes) and a graph and returns a weighted crossing count.
 *
 * Pre-conditions:
 *
 *    1. Input graph must be simple (not a multigraph), directed, and include
 *       only simple edges.
 *    2. Edges in the input graph must have assigned weights.
 *
 * Post-conditions:
 *
 *    1. The graph and layering matrix are left unchanged.
 *
 * This algorithm is derived from Barth, et al., "Bilayer Cross Counting."
 */
function crossCount (g, layering) {
  var cc = 0;
  for (var i = 1; i < layering.length; ++i) {
    cc += twoLayerCrossCount(g, layering[i - 1], layering[i]);
  }
  return cc
}

function barycenter (g, movable) {
  return _.map(movable, function (v) {
    var inV = g.inEdges(v);
    if (!inV.length) {
      return { v: v }
    } else {
      var result = _.reduce(inV, function (acc, e) {
        var edge = g.edge(e);
        var nodeU = g.node(e.v);
        return {
          sum: acc.sum + (edge.weight * nodeU.order),
          weight: acc.weight + edge.weight
        }
      }, { sum: 0, weight: 0 });

      return {
        v: v,
        barycenter: result.sum / result.weight,
        weight: result.weight
      }
    }
  })
}

function doResolveConflicts (sourceSet) {
  var entries = [];

  function handleIn (vEntry) {
    return function (uEntry) {
      if (uEntry.merged) {
        return
      }
      if (_.isUndefined(uEntry.barycenter) ||
          _.isUndefined(vEntry.barycenter) ||
          uEntry.barycenter >= vEntry.barycenter) {
        mergeEntries(vEntry, uEntry);
      }
    }
  }

  function handleOut (vEntry) {
    return function (wEntry) {
      wEntry['in'].push(vEntry);
      if (--wEntry.indegree === 0) {
        sourceSet.push(wEntry);
      }
    }
  }

  while (sourceSet.length) {
    var entry = sourceSet.pop();
    entries.push(entry);
    _.forEach(entry['in'].reverse(), handleIn(entry));
    _.forEach(entry.out, handleOut(entry));
  }

  // return _.chain(entries)
  //         .filter(function (entry) { return !entry.merged })
  //         .map(function (entry) {
  //           return _.pick(entry, ['vs', 'i', 'barycenter', 'weight'])
  //         })
  //         .value()
  return _.map(_.filter(entries, function (entry) { return !entry.merged }), function (entry) {
    return _.pick(entry, ['vs', 'i', 'barycenter', 'weight'])
  })
}

function mergeEntries (target, source) {
  var sum = 0;
  var weight = 0;

  if (target.weight) {
    sum += target.barycenter * target.weight;
    weight += target.weight;
  }

  if (source.weight) {
    sum += source.barycenter * source.weight;
    weight += source.weight;
  }

  target.vs = source.vs.concat(target.vs);
  target.barycenter = sum / weight;
  target.weight = weight;
  target.i = Math.min(source.i, target.i);
  source.merged = true;
}

/*
 * Given a list of entries of the form {v, barycenter, weight} and a
 * constraint graph this function will resolve any conflicts between the
 * constraint graph and the barycenters for the entries. If the barycenters for
 * an entry would violate a constraint in the constraint graph then we coalesce
 * the nodes in the conflict into a new node that respects the contraint and
 * aggregates barycenter and weight information.
 *
 * This implementation is based on the description in Forster, "A Fast and
 * Simple Hueristic for Constrained Two-Level Crossing Reduction," thought it
 * differs in some specific details.
 *
 * Pre-conditions:
 *
 *    1. Each entry has the form {v, barycenter, weight}, or if the node has
 *       no barycenter, then {v}.
 *
 * Returns:
 *
 *    A new list of entries of the form {vs, i, barycenter, weight}. The list
 *    `vs` may either be a singleton or it may be an aggregation of nodes
 *    ordered such that they do not violate constraints from the constraint
 *    graph. The property `i` is the lowest original index of any of the
 *    elements in `vs`.
 */
function resolveConflicts (entries, cg) {
  var mappedEntries = {};
  _.forEach(entries, function (entry, i) {
    var tmp = mappedEntries[entry.v] = {
      indegree: 0,
      'in': [],
      out: [],
      vs: [entry.v],
      i: i
    };
    if (!_.isUndefined(entry.barycenter)) {
      tmp.barycenter = entry.barycenter;
      tmp.weight = entry.weight;
    }
  });

  _.forEach(cg.edges(), function (e) {
    var entryV = mappedEntries[e.v];
    var entryW = mappedEntries[e.w];
    if (!_.isUndefined(entryV) && !_.isUndefined(entryW)) {
      entryW.indegree++;
      entryV.out.push(mappedEntries[e.w]);
    }
  });

  var sourceSet = _.filter(mappedEntries, function (entry) {
    return !entry.indegree
  });

  return doResolveConflicts(sourceSet)
}

function consumeUnsortable (vs, unsortable, index) {
  var last;
  while (unsortable.length && (last = _.last(unsortable)).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index
}

function compareWithBias (bias) {
  return function (entryV, entryW) {
    if (entryV.barycenter < entryW.barycenter) {
      return -1
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i
  }
}

function sort (entries, biasRight) {
  var parts = partition(entries, function (entry) {
    return _.has(entry, 'barycenter')
  });
  var sortable = parts.lhs;
  var unsortable = _.sortBy(parts.rhs, function (entry) { return -entry.i });
  var vs = [];
  var sum = 0;
  var weight = 0;
  var vsIndex = 0;

  sortable.sort(compareWithBias(!!biasRight));

  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  _.forEach(sortable, function (entry) {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });

  var result = { vs: _.flatten(vs, true) };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result
}

function expandSubgraphs (entries, subgraphs) {
  _.forEach(entries, function (entry) {
    entry.vs = _.flatten(entry.vs.map(function (v) {
      if (subgraphs[v]) {
        return subgraphs[v].vs
      }
      return v
    }), true);
  });
}

function mergeBarycenters (target, other) {
  if (!_.isUndefined(target.barycenter)) {
    target.barycenter = (target.barycenter * target.weight +
                         other.barycenter * other.weight) /
                        (target.weight + other.weight);
    target.weight += other.weight;
  } else {
    target.barycenter = other.barycenter;
    target.weight = other.weight;
  }
}

function sortSubgraph (g, v, cg, biasRight) {
  var movable = g.children(v);
  var node = g.node(v);
  var bl = node ? node.borderLeft : undefined;
  var br = node ? node.borderRight : undefined;
  var subgraphs = {};

  if (bl) {
    movable = _.filter(movable, function (w) {
      return w !== bl && w !== br
    });
  }

  var barycenters = barycenter(g, movable);
  _.forEach(barycenters, function (entry) {
    if (g.children(entry.v).length) {
      var subgraphResult = sortSubgraph(g, entry.v, cg, biasRight);
      subgraphs[entry.v] = subgraphResult;
      if (_.has(subgraphResult, 'barycenter')) {
        mergeBarycenters(entry, subgraphResult);
      }
    }
  });

  var entries = resolveConflicts(barycenters, cg);
  expandSubgraphs(entries, subgraphs);

  var result = sort(entries, biasRight);

  if (bl) {
    result.vs = _.flatten([bl, result.vs, br], true);
    if (g.predecessors(bl).length) {
      var blPred = g.node(g.predecessors(bl)[0]);
      var brPred = g.node(g.predecessors(br)[0]);
      if (!_.has(result, 'barycenter')) {
        result.barycenter = 0;
        result.weight = 0;
      }
      result.barycenter = (result.barycenter * result.weight +
                           blPred.order + brPred.order) / (result.weight + 2);
      result.weight += 2;
    }
  }

  return result
}

function createRootNode (g) {
  var v;
  while (g.hasNode((v = _.uniqueId('_root'))));
  return v
}

/*
 * Constructs a graph that can be used to sort a layer of nodes. The graph will
 * contain all base and subgraph nodes from the request layer in their original
 * hierarchy and any edges that are incident on these nodes and are of the type
 * requested by the "relationship" parameter.
 *
 * Nodes from the requested rank that do not have parents are assigned a root
 * node in the output graph, which is set in the root graph attribute. This
 * makes it easy to walk the hierarchy of movable nodes during ordering.
 *
 * Pre-conditions:
 *
 *    1. Input graph is a DAG
 *    2. Base nodes in the input graph have a rank attribute
 *    3. Subgraph nodes in the input graph has minRank and maxRank attributes
 *    4. Edges have an assigned weight
 *
 * Post-conditions:
 *
 *    1. Output graph has all nodes in the movable rank with preserved
 *       hierarchy.
 *    2. Root nodes in the movable layer are made children of the node
 *       indicated by the root attribute of the graph.
 *    3. Non-movable nodes incident on movable nodes, selected by the
 *       relationship parameter, are included in the graph (without hierarchy).
 *    4. Edges incident on movable nodes, selected by the relationship
 *       parameter, are added to the output graph.
 *    5. The weights for copied edges are aggregated as need, since the output
 *       graph is not a multi-graph.
 */
function buildLayerGraph (g, rank, relationship) {
  var root = createRootNode(g);
  var result = new Graph({ compound: true }).setGraph({ root: root })
                  .setDefaultNodeLabel(function (v) { return g.node(v) });

  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    var parent = g.parent(v);

    if (node.rank === rank || node.minRank <= rank && rank <= node.maxRank) {
      result.setNode(v);
      result.setParent(v, parent || root);

      // This assumes we have only short edges!
      _.forEach(g[relationship](v), function (e) {
        var u = e.v === v ? e.w : e.v;
        var edge = result.edge(u, v);
        var weight = !_.isUndefined(edge) ? edge.weight : 0;
        result.setEdge(u, v, { weight: g.edge(e).weight + weight });
      });

      if (_.has(node, 'minRank')) {
        result.setNode(v, {
          borderLeft: node.borderLeft[rank],
          borderRight: node.borderRight[rank]
        });
      }
    }
  });

  return result
}

function addSubgraphConstraints (g, cg, vs) {
  var prev = {};
  var rootPrev;

  _.forEach(vs, function (v) {
    var child = g.parent(v);
    var parent;
    var prevChild;
    while (child) {
      parent = g.parent(child);
      if (parent) {
        prevChild = prev[parent];
        prev[parent] = child;
      } else {
        prevChild = rootPrev;
        rootPrev = child;
      }
      if (prevChild && prevChild !== child) {
        cg.setEdge(prevChild, child);
        return
      }
      child = parent;
    }
  });

  /*
  function dfs(v) {
    var children = v ? g.children(v) : g.children();
    if (children.length) {
      var min = Number.POSITIVE_INFINITY,
          subgraphs = [];
      _.forEach(children, function(child) {
        var childMin = dfs(child);
        if (g.children(child).length) {
          subgraphs.push({ v: child, order: childMin });
        }
        min = Math.min(min, childMin);
      });
      _.reduce(_.sortBy(subgraphs, "order"), function(prev, curr) {
        cg.setEdge(prev.v, curr.v);
        return curr;
      });
      return min;
    }
    return g.node(v).order;
  }
  dfs(undefined);
  */
}

function buildLayerGraphs (g, ranks, relationship) {
  return _.map(ranks, function (rank) {
    return buildLayerGraph(g, rank, relationship)
  })
}

function sweepLayerGraphs (layerGraphs, biasRight) {
  var cg = new Graph();
  _.forEach(layerGraphs, function (lg) {
    var root = lg.graph().root;
    var sorted = sortSubgraph(lg, root, cg, biasRight);
    _.forEach(sorted.vs, function (v, i) {
      lg.node(v).order = i;
    });
    addSubgraphConstraints(lg, cg, sorted.vs);
  });
}

function assignOrder (g, layering) {
  _.forEach(layering, function (layer) {
    _.forEach(layer, function (v, i) {
      g.node(v).order = i;
    });
  });
}

/*
 * Applies heuristics to minimize edge crossings in the graph and sets the best
 * order solution as an order attribute on each node.
 *
 * Pre-conditions:
 *
 *    1. Graph must be DAG
 *    2. Graph nodes must be objects with a "rank" attribute
 *    3. Graph edges must have the "weight" attribute
 *
 * Post-conditions:
 *
 *    1. Graph nodes will have an "order" attribute based on the results of the
 *       algorithm.
 */
function order (g) {
  var mr = maxRank(g);
  var downLayerGraphs = buildLayerGraphs(g, _.range(1, mr + 1), 'inEdges');
  var upLayerGraphs = buildLayerGraphs(g, _.range(mr - 1, -1, -1), 'outEdges');

  var layering = initOrder(g);
  assignOrder(g, layering);

  var bestCC = Number.POSITIVE_INFINITY;
  var best;

  for (var i = 0, lastBest = 0; lastBest < 4; ++i, ++lastBest) {
    sweepLayerGraphs(i % 2 ? downLayerGraphs : upLayerGraphs, i % 4 >= 2);

    layering = buildLayerMatrix(g);
    var cc = crossCount(g, layering);
    if (cc < bestCC) {
      lastBest = 0;
      best = _.cloneDeep(layering);
      bestCC = cc;
    }
  }

  assignOrder(g, best);
}

/*
 * This module provides coordinate assignment based on Brandes and Köpf, "Fast
 * and Simple Horizontal Coordinate Assignment."
 */

/*
 * Marks all edges in the graph with a type-1 conflict with the "type1Conflict"
 * property. A type-1 conflict is one where a non-inner segment crosses an
 * inner segment. An inner segment is an edge with both incident nodes marked
 * with the "dummy" property.
 *
 * This algorithm scans layer by layer, starting with the second, for type-1
 * conflicts between the current layer and the previous layer. For each layer
 * it scans the nodes from left to right until it reaches one that is incident
 * on an inner segment. It then scans predecessors to determine if they have
 * edges that cross that inner segment. At the end a final scan is done for all
 * nodes on the current rank to see if they cross the last visited inner
 * segment.
 *
 * This algorithm (safely) assumes that a dummy node will only be incident on a
 * single node in the layers being scanned.
 */
function findType1Conflicts (g, layering) {
  var conflicts = {};

  function visitLayer (prevLayer, layer) {
    // last visited node in the previous layer that is incident on an inner
    // segment.
    var k0 = 0;
    // Tracks the last node in this layer scanned for crossings with a type-1
    // segment.
    var scanPos = 0;
    var prevLayerLength = prevLayer.length;
    var lastNode = _.last(layer);

    _.forEach(layer, function (v, i) {
      var w = findOtherInnerSegmentNode(g, v);
      var k1 = w ? g.node(w).order : prevLayerLength;

      if (w || v === lastNode) {
        _.forEach(layer.slice(scanPos, i + 1), function (scanNode) {
          _.forEach(g.predecessors(scanNode), function (u) {
            var uLabel = g.node(u);
            var uPos = uLabel.order;
            if ((uPos < k0 || k1 < uPos) &&
                !(uLabel.dummy && g.node(scanNode).dummy)) {
              addConflict(conflicts, u, scanNode);
            }
          });
        });
        scanPos = i + 1;
        k0 = k1;
      }
    });

    return layer
  }

  _.reduce(layering, visitLayer);
  return conflicts
}

function findType2Conflicts (g, layering) {
  var conflicts = {};

  function scan (south, southPos, southEnd, prevNorthBorder, nextNorthBorder) {
    var v;
    _.forEach(_.range(southPos, southEnd), function (i) {
      v = south[i];
      if (g.node(v).dummy) {
        _.forEach(g.predecessors(v), function (u) {
          var uNode = g.node(u);
          if (uNode.dummy &&
              (uNode.order < prevNorthBorder || uNode.order > nextNorthBorder)) {
            addConflict(conflicts, u, v);
          }
        });
      }
    });
  }

  function visitLayer (north, south) {
    var prevNorthPos = -1;
    var nextNorthPos;
    var southPos = 0;

    _.forEach(south, function (v, southLookahead) {
      if (g.node(v).dummy === 'border') {
        var predecessors = g.predecessors(v);
        if (predecessors.length) {
          nextNorthPos = g.node(predecessors[0]).order;
          scan(south, southPos, southLookahead, prevNorthPos, nextNorthPos);
          southPos = southLookahead;
          prevNorthPos = nextNorthPos;
        }
      }
      scan(south, southPos, south.length, nextNorthPos, north.length);
    });

    return south
  }

  _.reduce(layering, visitLayer);
  return conflicts
}

function findOtherInnerSegmentNode (g, v) {
  if (g.node(v).dummy) {
    return _.find(g.predecessors(v), function (u) {
      return g.node(u).dummy
    })
  }
}

function addConflict (conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }

  var conflictsV = conflicts[v];
  if (!conflictsV) {
    conflicts[v] = conflictsV = {};
  }
  conflictsV[w] = true;
}

function hasConflict (conflicts, v, w) {
  if (v > w) {
    var tmp = v;
    v = w;
    w = tmp;
  }
  return _.has(conflicts[v], w)
}

/*
 * Try to align nodes into vertical "blocks" where possible. This algorithm
 * attempts to align a node with one of its median neighbors. If the edge
 * connecting a neighbor is a type-1 conflict then we ignore that possibility.
 * If a previous node has already formed a block with a node after the node
 * we're trying to form a block with, we also ignore that possibility - our
 * blocks would be split in that scenario.
 */
function verticalAlignment (g, layering, conflicts, neighborFn) {
  var root = {};
  var align = {};
  var pos = {};

  // We cache the position here based on the layering because the graph and
  // layering may be out of sync. The layering matrix is manipulated to
  // generate different extreme alignments.
  _.forEach(layering, function (layer) {
    _.forEach(layer, function (v, order) {
      root[v] = v;
      align[v] = v;
      pos[v] = order;
    });
  });

  _.forEach(layering, function (layer) {
    var prevIdx = -1;
    _.forEach(layer, function (v) {
      var ws = neighborFn(v);
      if (ws.length) {
        ws = _.sortBy(ws, function (w) { return pos[w] });
        var mp = (ws.length - 1) / 2;
        for (var i = Math.floor(mp), il = Math.ceil(mp); i <= il; ++i) {
          var w = ws[i];
          if (align[v] === v &&
              prevIdx < pos[w] &&
              !hasConflict(conflicts, v, w)) {
            align[w] = v;
            align[v] = root[v] = root[w];
            prevIdx = pos[w];
          }
        }
      }
    });
  });

  return { root: root, align: align }
}

function horizontalCompaction (g, layering, root, align, reverseSep) {
  // This portion of the algorithm differs from BK due to a number of problems.
  // Instead of their algorithm we construct a new block graph and do two
  // sweeps. The first sweep places blocks with the smallest possible
  // coordinates. The second sweep removes unused space by moving blocks to the
  // greatest coordinates without violating separation.
  var xs = {};
  var blockG = buildBlockGraph(g, layering, root, reverseSep);

  // First pass, assign smallest coordinates via DFS
  var visited = {};
  function pass1 (v) {
    if (!_.has(visited, v)) {
      visited[v] = true;
      xs[v] = _.reduce(blockG.inEdges(v), function (max, e) {
        pass1(e.v);
        return Math.max(max, xs[e.v] + blockG.edge(e))
      }, 0);
    }
  }
  _.forEach(blockG.nodes(), pass1);

  var borderType = reverseSep ? 'borderLeft' : 'borderRight';
  function pass2 (v) {
    if (visited[v] !== 2) {
      visited[v]++;
      var node = g.node(v);
      var min = _.reduce(blockG.outEdges(v), function (min, e) {
        pass2(e.w);
        return Math.min(min, xs[e.w] - blockG.edge(e))
      }, Number.POSITIVE_INFINITY);
      if (min !== Number.POSITIVE_INFINITY && node.borderType !== borderType) {
        xs[v] = Math.max(xs[v], min);
      }
    }
  }
  _.forEach(blockG.nodes(), pass2);

  // Assign x coordinates to all nodes
  _.forEach(align, function (v) {
    xs[v] = xs[root[v]];
  });

  return xs
}

function buildBlockGraph (g, layering, root, reverseSep) {
  var blockGraph = new Graph();
  var graphLabel = g.graph();
  var sepFn = sep(graphLabel.nodesep, graphLabel.edgesep, reverseSep);

  _.forEach(layering, function (layer) {
    var u;
    _.forEach(layer, function (v) {
      var vRoot = root[v];
      blockGraph.setNode(vRoot);
      if (u) {
        var uRoot = root[u];
        var prevMax = blockGraph.edge(uRoot, vRoot);
        blockGraph.setEdge(uRoot, vRoot, Math.max(sepFn(g, v, u), prevMax || 0));
      }
      u = v;
    });
  });

  return blockGraph
}

/*
 * Returns the alignment that has the smallest width of the given alignments.
 */
function findSmallestWidthAlignment (g, xss) {
  var vals = _.values(xss);

  return _.minBy(vals, function (xs) {
    var maxVals = [];
    var minVals = [];

    _.forIn(xs, function (x, v) {
      var halfWidth = width(g, v) / 2;

      maxVals.push(x + halfWidth);
      minVals.push(x - halfWidth);
    });

    return _.max(maxVals) - _.min(minVals)
  })
}

/*
 * Align the coordinates of each of the layout alignments such that
 * left-biased alignments have their minimum coordinate at the same point as
 * the minimum coordinate of the smallest width alignment and right-biased
 * alignments have their maximum coordinate at the same point as the maximum
 * coordinate of the smallest width alignment.
 */
function alignCoordinates (xss, alignTo) {
  var vals = _.values(alignTo);
  var alignToMin = _.min(vals);
  var alignToMax = _.max(vals);

  _.forEach(['u', 'd'], function (vert) {
    _.forEach(['l', 'r'], function (horiz) {
      var alignment = vert + horiz;
      var xs = xss[alignment];
      var delta;
      if (xs === alignTo) return

      var xsVals = _.values(xs);
      delta = horiz === 'l' ? alignToMin - _.min(xsVals) : alignToMax - _.max(xsVals);

      if (delta) {
        xss[alignment] = _.mapValues(xs, function (x) { return x + delta });
      }
    });
  });
}

function balance (xss, align) {
  return _.mapValues(xss.ul, function (ignore, v) {
    if (align) {
      return xss[align.toLowerCase()][v]
    } else {
      var xs = _.sortBy(_.map(xss, v));
      return (xs[1] + xs[2]) / 2
    }
  })
}

function positionX (g) {
  var layering = buildLayerMatrix(g);
  var conflicts = _.merge(findType1Conflicts(g, layering),
                          findType2Conflicts(g, layering));

  var xss = {};
  var adjustedLayering;
  _.forEach(['u', 'd'], function (vert) {
    adjustedLayering = vert === 'u' ? layering : _.values(layering).reverse();
    _.forEach(['l', 'r'], function (horiz) {
      if (horiz === 'r') {
        adjustedLayering = _.map(adjustedLayering, function (inner) {
          return _.values(inner).reverse()
        });
      }

      var neighborFn = _.bind(vert === 'u' ? g.predecessors : g.successors, g);
      var align = verticalAlignment(g, adjustedLayering, conflicts, neighborFn);
      var xs = horizontalCompaction(g, adjustedLayering,
                                    align.root, align.align,
                                    horiz === 'r');
      if (horiz === 'r') {
        xs = _.mapValues(xs, function (x) { return -x });
      }
      xss[vert + horiz] = xs;
    });
  });

  var smallestWidth = findSmallestWidthAlignment(g, xss);
  alignCoordinates(xss, smallestWidth);
  return balance(xss, g.graph().align)
}

function sep (nodeSep, edgeSep, reverseSep) {
  return function (g, v, w) {
    var vLabel = g.node(v);
    var wLabel = g.node(w);
    var sum = 0;
    var delta;

    sum += vLabel.width / 2;
    if (_.has(vLabel, 'labelpos')) {
      switch (vLabel.labelpos.toLowerCase()) {
        case 'l': delta = -vLabel.width / 2; break
        case 'r': delta = vLabel.width / 2; break
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    sum += (vLabel.dummy ? edgeSep : nodeSep) / 2;
    sum += (wLabel.dummy ? edgeSep : nodeSep) / 2;

    sum += wLabel.width / 2;
    if (_.has(wLabel, 'labelpos')) {
      switch (wLabel.labelpos.toLowerCase()) {
        case 'l': delta = wLabel.width / 2; break
        case 'r': delta = -wLabel.width / 2; break
      }
    }
    if (delta) {
      sum += reverseSep ? delta : -delta;
    }
    delta = 0;

    return sum
  }
}

function width (g, v) {
  return g.node(v).width
}

function positionY (g) {
  var layering = buildLayerMatrix(g);
  var rankSep = g.graph().ranksep;
  var prevY = 0;
  _.forEach(layering, function (layer) {
    var maxHeight = _.max(_.map(layer, function (v) { return g.node(v).height }));
    _.forEach(layer, function (v) {
      g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}

function position (g) {
  g = asNonCompoundGraph(g);

  positionY(g);
  _.forEach(positionX(g), function (x, v) {
    g.node(v).x = x;
  });
}

function runLayout (g, time$$1) {
  time$$1('    makeSpaceForEdgeLabels', function () { makeSpaceForEdgeLabels(g); });
  time$$1('    removeSelfEdges', function () { removeSelfEdges(g); });
  time$$1('    acyclic', function () { run(g); });
  time$$1('    nestingGraph.run', function () { run$2(g); });
  time$$1('    rank', function () { rank(asNonCompoundGraph(g)); });
  time$$1('    injectEdgeLabelProxies', function () { injectEdgeLabelProxies(g); });
  time$$1('    removeEmptyRanks', function () { removeEmptyRanks(g); });
  time$$1('    nestingGraph.cleanup', function () { cleanup(g); });
  time$$1('    normalizeRanks', function () { normalizeRanks(g); });
  time$$1('    assignRankMinMax', function () { assignRankMinMax(g); });
  time$$1('    removeEdgeLabelProxies', function () { removeEdgeLabelProxies(g); });
  time$$1('    normalize.run', function () { run$1(g); });
  time$$1('    parentDummyChains', function () { parentDummyChains(g); });
  time$$1('    addBorderSegments', function () { addBorderSegments(g); });
  time$$1('    order', function () { order(g); });
  time$$1('    insertSelfEdges', function () { insertSelfEdges(g); });
  time$$1('    adjustCoordinateSystem', function () { adjust(g); });
  time$$1('    position', function () { position(g); });
  time$$1('    positionSelfEdges', function () { positionSelfEdges(g); });
  time$$1('    removeBorderNodes', function () { removeBorderNodes(g); });
  time$$1('    normalize.undo', function () { undo$1(g); });
  time$$1('    fixupEdgeLabelCoords', function () { fixupEdgeLabelCoords(g); });
  time$$1('    undoCoordinateSystem', function () { undo$2(g); });
  time$$1('    translateGraph', function () { translateGraph(g); });
  time$$1('    assignNodeIntersects', function () { assignNodeIntersects(g); });
  time$$1('    reversePoints', function () { reversePointsForReversedEdges(g); });
  time$$1('    acyclic.undo', function () { undo(g); });
}

/*
 * Copies final layout information from the layout graph back to the input
 * graph. This process only copies whitelisted attributes from the layout graph
 * to the input graph, so it serves as a good place to determine what
 * attributes can influence layout.
 */
function updateInputGraph (inputGraph, layoutGraph) {
  _.forEach(inputGraph.nodes(), function (v) {
    var inputLabel = inputGraph.node(v);
    var layoutLabel = layoutGraph.node(v);

    if (inputLabel) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;

      if (layoutGraph.children(v).length) {
        inputLabel.width = layoutLabel.width;
        inputLabel.height = layoutLabel.height;
      }
    }
  });

  _.forEach(inputGraph.edges(), function (e) {
    var inputLabel = inputGraph.edge(e);
    var layoutLabel = layoutGraph.edge(e);

    inputLabel.points = layoutLabel.points;
    if (_.has(layoutLabel, 'x')) {
      inputLabel.x = layoutLabel.x;
      inputLabel.y = layoutLabel.y;
    }
  });

  inputGraph.graph().width = layoutGraph.graph().width;
  inputGraph.graph().height = layoutGraph.graph().height;
}

var graphNumAttrs = ['nodesep', 'edgesep', 'ranksep', 'marginx', 'marginy'];
var graphDefaults = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: 'tb' };
var graphAttrs = ['acyclicer', 'ranker', 'rankdir', 'align'];
var nodeNumAttrs = ['width', 'height'];
var nodeDefaults = { width: 0, height: 0 };
var edgeNumAttrs = ['minlen', 'weight', 'width', 'height', 'labeloffset'];
var edgeDefaults = {
  minlen: 1,
  weight: 1,
  width: 0,
  height: 0,
  labeloffset: 10,
  labelpos: 'r'
};
var edgeAttrs = ['labelpos'];

/*
 * Constructs a new graph from the input graph, which can be used for layout.
 * This process copies only whitelisted attributes from the input graph to the
 * layout graph. Thus this function serves as a good place to determine what
 * attributes can influence layout.
 */
function buildLayoutGraph (inputGraph) {
  var g = new Graph({ multigraph: true, compound: true });
  var graph = canonicalize(inputGraph.graph());

  g.setGraph(_.merge({},
    graphDefaults,
    selectNumberAttrs(graph, graphNumAttrs),
    _.pick(graph, graphAttrs)));

  _.forEach(inputGraph.nodes(), function (v) {
    var node = canonicalize(inputGraph.node(v));
    g.setNode(v, _.defaults(selectNumberAttrs(node, nodeNumAttrs), nodeDefaults));
    g.setParent(v, inputGraph.parent(v));
  });

  _.forEach(inputGraph.edges(), function (e) {
    var edge = canonicalize(inputGraph.edge(e));
    g.setEdge(e, _.merge({},
      edgeDefaults,
      selectNumberAttrs(edge, edgeNumAttrs),
      _.pick(edge, edgeAttrs)));
  });

  return g
}

/*
 * This idea comes from the Gansner paper: to account for edge labels in our
 * layout we split each rank in half by doubling minlen and halving ranksep.
 * Then we can place labels at these mid-points between nodes.
 *
 * We also add some minimal padding to the width to push the label for the edge
 * away from the edge itself a bit.
 */
function makeSpaceForEdgeLabels (g) {
  var graph = g.graph();
  graph.ranksep /= 2;
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    edge.minlen *= 2;
    if (edge.labelpos.toLowerCase() !== 'c') {
      if (graph.rankdir === 'TB' || graph.rankdir === 'BT') {
        edge.width += edge.labeloffset;
      } else {
        edge.height += edge.labeloffset;
      }
    }
  });
}

/*
 * Creates temporary dummy nodes that capture the rank in which each edge's
 * label is going to, if it has one of non-zero width and height. We do this
 * so that we can safely remove empty ranks while preserving balance for the
 * label's position.
 */
function injectEdgeLabelProxies (g) {
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.width && edge.height) {
      var v = g.node(e.v);
      var w = g.node(e.w);
      var label = { rank: (w.rank - v.rank) / 2 + v.rank, e: e };
      addDummyNode(g, 'edge-proxy', label, '_ep');
    }
  });
}

function assignRankMinMax (g) {
  var maxRank$$1 = 0;
  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    if (node.borderTop) {
      node.minRank = g.node(node.borderTop).rank;
      node.maxRank = g.node(node.borderBottom).rank;
      maxRank$$1 = _.max(maxRank$$1, node.maxRank);
    }
  });
  g.graph().maxRank = maxRank$$1;
}

function removeEdgeLabelProxies (g) {
  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    if (node.dummy === 'edge-proxy') {
      g.edge(node.e).labelRank = node.rank;
      g.removeNode(v);
    }
  });
}

function translateGraph (g) {
  var minX = Number.POSITIVE_INFINITY;
  var maxX = 0;
  var minY = Number.POSITIVE_INFINITY;
  var maxY = 0;
  var graphLabel = g.graph();
  var marginX = graphLabel.marginx || 0;
  var marginY = graphLabel.marginy || 0;

  function getExtremes (attrs) {
    var x = attrs.x;
    var y = attrs.y;
    var w = attrs.width;
    var h = attrs.height;
    minX = Math.min(minX, x - w / 2);
    maxX = Math.max(maxX, x + w / 2);
    minY = Math.min(minY, y - h / 2);
    maxY = Math.max(maxY, y + h / 2);
  }

  _.forEach(g.nodes(), function (v) { getExtremes(g.node(v)); });
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    if (_.has(edge, 'x')) {
      getExtremes(edge);
    }
  });

  minX -= marginX;
  minY -= marginY;

  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    node.x -= minX;
    node.y -= minY;
  });

  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    _.forEach(edge.points, function (p) {
      p.x -= minX;
      p.y -= minY;
    });
    if (_.has(edge, 'x')) { edge.x -= minX; }
    if (_.has(edge, 'y')) { edge.y -= minY; }
  });

  graphLabel.width = maxX - minX + marginX;
  graphLabel.height = maxY - minY + marginY;
}

function assignNodeIntersects (g) {
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    var nodeV = g.node(e.v);
    var nodeW = g.node(e.w);
    var p1;
    var p2;
    if (!edge.points) {
      edge.points = [];
      p1 = nodeW;
      p2 = nodeV;
    } else {
      p1 = edge.points[0];
      p2 = edge.points[edge.points.length - 1];
    }
    edge.points.unshift(intersectRect(nodeV, p1));
    edge.points.push(intersectRect(nodeW, p2));
  });
}

function fixupEdgeLabelCoords (g) {
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    if (_.has(edge, 'x')) {
      if (edge.labelpos === 'l' || edge.labelpos === 'r') {
        edge.width -= edge.labeloffset;
      }
      switch (edge.labelpos) {
        case 'l': edge.x -= edge.width / 2 + edge.labeloffset; break
        case 'r': edge.x += edge.width / 2 + edge.labeloffset; break
      }
    }
  });
}

function reversePointsForReversedEdges (g) {
  _.forEach(g.edges(), function (e) {
    var edge = g.edge(e);
    if (edge.reversed) {
      edge.points.reverse();
    }
  });
}

function removeBorderNodes (g) {
  _.forEach(g.nodes(), function (v) {
    if (g.children(v).length) {
      var node = g.node(v);
      var t = g.node(node.borderTop);
      var b = g.node(node.borderBottom);
      var l = g.node(_.last(node.borderLeft));
      var r = g.node(_.last(node.borderRight));

      node.width = Math.abs(r.x - l.x);
      node.height = Math.abs(b.y - t.y);
      node.x = l.x + node.width / 2;
      node.y = t.y + node.height / 2;
    }
  });

  _.forEach(g.nodes(), function (v) {
    if (g.node(v).dummy === 'border') {
      g.removeNode(v);
    }
  });
}

function removeSelfEdges (g) {
  _.forEach(g.edges(), function (e) {
    if (e.v === e.w) {
      var node = g.node(e.v);
      if (!node.selfEdges) {
        node.selfEdges = [];
      }
      node.selfEdges.push({ e: e, label: g.edge(e) });
      g.removeEdge(e);
    }
  });
}

function insertSelfEdges (g) {
  var layers = buildLayerMatrix(g);
  _.forEach(layers, function (layer) {
    var orderShift = 0;
    _.forEach(layer, function (v, i) {
      var node = g.node(v);
      node.order = i + orderShift;
      _.forEach(node.selfEdges, function (selfEdge) {
        addDummyNode(g, 'selfedge', {
          width: selfEdge.label.width,
          height: selfEdge.label.height,
          rank: node.rank,
          order: i + (++orderShift),
          e: selfEdge.e,
          label: selfEdge.label
        }, '_se');
      });
      delete node.selfEdges;
    });
  });
}

function positionSelfEdges (g) {
  _.forEach(g.nodes(), function (v) {
    var node = g.node(v);
    if (node.dummy === 'selfedge') {
      var selfNode = g.node(node.e.v);
      var x = selfNode.x + selfNode.width / 2;
      var y = selfNode.y;
      var dx = node.x - x;
      var dy = selfNode.height / 2;
      g.setEdge(node.e, node.label);
      g.removeNode(v);
      node.label.points = [
        { x: x + 2 * dx / 3, y: y - dy },
        { x: x + 5 * dx / 6, y: y - dy },
        { x: x + dx, y: y },
        { x: x + 5 * dx / 6, y: y + dy },
        { x: x + 2 * dx / 3, y: y + dy }
      ];
      node.label.x = node.x;
      node.label.y = node.y;
    }
  });
}

function selectNumberAttrs (obj, attrs) {
  return _.mapValues(_.pick(obj, attrs), Number)
}

function canonicalize (attrs) {
  var newAttrs = {};
  _.forEach(attrs, function (v, k) {
    newAttrs[k.toLowerCase()] = v;
  });
  return newAttrs
}

function layout (g, opts) {
  var timeFn = opts && opts.debugTiming ? time : notime;
  timeFn('layout', function () {
    var layoutGraph = timeFn('  buildLayoutGraph',
                               function () { return buildLayoutGraph(g) });
    timeFn('  runLayout', function () { runLayout(layoutGraph, timeFn); });
    timeFn('  updateInputGraph', function () { updateInputGraph(g, layoutGraph); });
  });
}

/*
Copyright (c) 2012-2014 Chris Pettitt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var dagre_esm = {
  layout
}

export default dagre_esm;
