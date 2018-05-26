import { isObjectType } from 'graphql';

const objectValues =
  Object.values || (obj => Object.keys(obj).map(key => obj[key]));

function traverseRoots(type, acumulator) {
  if (!isObjectType(type)) return;

  acumulator.addNode(type.name);

  const fields = type.getFields();

  // create node for each query/mutation
  Object.keys(fields).forEach(field => {
    acumulator.addNode(field);
    acumulator.addEdge(type.name, field);
    traverseType(fields[field].type, acumulator, field);
  });
}

function traverseType(type, acumulator, parent) {
  if (!isObjectType(type) || acumulator.hasNode(type.name)) return;

  // add new node to graph
  acumulator.addNode(type.name);
  // add edge
  if (parent != null) acumulator.addEdge(parent, type.name);

  const fields = type.getFields();

  Object.keys(fields).forEach(field =>
    traverseType(fields[field].type, acumulator, type.name)
  );
}

const rootTypes = ['Query', 'Mutation', 'Subscription'];

export default function convertSchema(schema) {
  let nodes = [];
  let edges = [];

  const acc = (function acumulator() {
    function addNode(name) {
      if (!nodes.includes(name)) nodes.push(name);
    }
    function addEdge(parent, child) {
      edges.push({ from: parent, to: child });
    }
    const hasNode = name => nodes.includes(name);
    return { addNode, addEdge, hasNode };
  })();

  // read types from schema
  const types = objectValues(schema.getTypeMap());
  // traverse DFS and add nodes/edges
  types
    .filter(type => rootTypes.includes(type.name))
    .forEach(type => traverseRoots(type, acc));

  const graph = {
    nodes: nodes.map(name => ({
      id: name,
      label: name,
      shape: 'box',
      color: rootTypes.includes(name) ? '#08c' : '#03a9f4'
    })),
    edges
  };

  return graph;
}
