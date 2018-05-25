import { isObjectType } from 'graphql';

/*
type IntrospectionSchema = {|
  +queryType: IntrospectionNamedTypeRef<IntrospectionObjectType>,
  +mutationType: ?IntrospectionNamedTypeRef<IntrospectionObjectType>,
  +subscriptionType: ?IntrospectionNamedTypeRef<IntrospectionObjectType>,
  +types: $ReadOnlyArray<IntrospectionType>,
  +directives: $ReadOnlyArray<IntrospectionDirective>,
|};
*/

const objectValues =
  Object.values || (obj => Object.keys(obj).map(key => obj[key]));

function traverseRoots(type, acumulator) {
  if (!isObjectType(type)) return;

  acumulator.addNode(type.name);

  const fields = type.getFields();
  console.log('root type name', type.name, 'fields', fields);

  Object.keys(fields).forEach(field => {
    acumulator.addNode(field);
    acumulator.addEdge(type.name, field);
    traverseType(fields[field].type, acumulator, field);
  });
}

function traverseType(type, acumulator, parent) {
  if (!isObjectType(type) || acumulator.hasNode(type.name)) return;

  acumulator.addNode(type.name);
  if (parent != null) acumulator.addEdge(parent, type.name);

  const fields = type.getFields();
  console.log('type name', type.name, 'fields', fields);

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

  const types = objectValues(schema.getTypeMap());
  types
    .filter(type => rootTypes.includes(type.name))
    .forEach(type => traverseRoots(type, acc));

  const graph = {
    nodes: nodes.map(name => ({
      id: name,
      label: name,
      shape: 'box',
      color: rootTypes.includes(name) ? '#08c' : '#D2E5FF'
    })),
    edges
  };

  console.log(graph);
  return graph;
}
