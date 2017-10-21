/**
 * Created by admin on 10/21/17.
 */
var topoSort = {};
var buildGraph = function(input) {
  var result = [];
  input.forEach(function (course) {
      if (course.prereq) {
          course.prereq.forEach(function (dep) {
              var array = [];
              array.push(course.name);
              array.push(dep);
              result.push(array);
          });
      }
  });
  return result;
};

topoSort.tsort = function(input) {
    var edges = buildGraph(input);
    var nodes   = {}, // hash: stringified id of the node => { id: id, afters: lisf of ids }
        sorted  = [], // sorted list of IDs ( returned value )
        visited = {}; // hash: id of already visited node => true

    var Node = function(id) {
        this.id = id;
        this.afters = [];
    };

    // 1. build data structures
    edges.forEach(function(v) {
        var from = v[0], to = v[1];
        if (!nodes[from]) nodes[from] = new Node(from);
        if (!nodes[to]) nodes[to]     = new Node(to);
        nodes[from].afters.push(to);
    });

    // 2. topological sort
    Object.keys(nodes).forEach(function visit(idstr, ancestors) {
        var node = nodes[idstr],
            id   = node.id;

        // if already exists, do nothing
        if (visited[idstr]) return;

        if (!Array.isArray(ancestors)) ancestors = [];

        ancestors.push(id);

        visited[idstr] = true;

        node.afters.forEach(function(afterID) {
            if (ancestors.indexOf(afterID) >= 0)  // if already in ancestors, a closed chain exists.
                return false;

            visit(afterID.toString(), ancestors.map(function(v) { return v })); // recursive call
        });

        sorted.unshift(id);
    });

    sorted = sorted.reverse();

    var result = [];
    sorted.forEach(function (courseSorted) {
        result.push(input.find(function (courseUnsorted) {
            return courseUnsorted.name == courseSorted;
        }));
    });
    return result;
};


module.exports = topoSort;

