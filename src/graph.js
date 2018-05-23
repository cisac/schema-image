import React from 'react';
import Graph from 'react-graph-vis';

const options = {
  autoResize: true,
  layout: {
    hierarchical: {
      enabled: true,
      direction: 'UD'
    }
  },
  edges: {
    color: '#000000'
  }
};

const events = {
  select: function(event) {
    var { nodes, edges } = event;
    console.log(`nodes: ${nodes}`);
    console.log(`edges: ${edges}`);
  }
};

const SchemaGraph = ({ graph }) => (
  <Graph
    graph={graph}
    options={options}
    events={events}
    style={{ height: '640px' }}
  />
);

export default SchemaGraph;
