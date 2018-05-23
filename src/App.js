import React, { Component } from 'react';
import SchemaLoader from './SchemaLoader';
import SettingsForm from './SettingsForm';
import convertSchema from './SchemaConvertor';
import SchemaGraph from './graph';

class App extends Component {
  state = { uri: 'http://api.githunt.com/graphql' };

  updateURI = uri => {
    this.setState({ uri });
  };

  render() {
    const { uri } = this.state;

    return (
      <div>
        <SettingsForm uri={uri} updateURI={this.updateURI} />
        <SchemaLoader uri={uri}>
          {(schema, loading, err) => {
            if (err) return `Error: ${err}`;
            if (loading) return 'Loading...';
            const graph = convertSchema(schema);
            return <SchemaGraph graph={graph} />;
          }}
        </SchemaLoader>
      </div>
    );
  }
}

/* public GraphQL servers
 http://graphql.brandfolder.com/graphql
 https://www.universe.com/graphql
*/

export default App;
