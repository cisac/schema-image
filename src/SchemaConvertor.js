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

const excludedTypes = [
  'Boolean',
  'Float',
  'Int',
  'String',
  '__DirectiveLocation',
  '__Directive',
  '__EnumValue',
  '__Field',
  '__InputValue',
  '__Schema',
  '__TypeKind',
  '__Type'
];

const objectValues =
  Object.values || (obj => Object.keys(obj).map(key => obj[key]));

function getTypes(schema) {
  const typeMap = schema.getTypeMap();
  if (typeMap) {
    const types = objectValues(typeMap);
    return types.map(type => ({
      name: type.name,
      fields: getFields(type)
    }));
  }
  return [];
}

function getFields(type) {
  if (isObjectType(type)) {
    const fields = objectValues(type.getFields());

    const objectFields = fields.map(field => ({
      [field.name]: String(field.type)
    }));

    const fieldsMap = objectFields.reduce((prev, current) => {
      return { ...prev, ...current };
    }, {});

    return fieldsMap;
  }
  return {};
}

function getEdges(type) {
  const { fields } = type;
  if (fields) {
    return Object.keys(fields).map(key => ({
      from: type.name,
      to: fields[key]
    }));
  }
  return [];
}

function convertSchema(schema) {
  const types = getTypes(schema).filter(
    type => !excludedTypes.includes(type.name)
  );

  const nodes = types.map(type => ({
    id: type.name,
    label: type.name
  }));

  const edges = types
    .map(type => getEdges(type))
    .reduce((acc, typeConnextions) => acc.concat(typeConnextions), []);

  return { nodes, edges };
}

export default convertSchema;
