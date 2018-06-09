import React from "react";
import { HttpLink } from "apollo-link-http";
import { introspectSchema } from "graphql-tools";

class SchemaLoader extends React.Component {
  state = {};

  componentDidMount() {
    const { uri } = this.props;
    this.readSchema(uri);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { uri } = this.props;
    const { uri: prevUri } = prevProps;

    if (uri !== prevUri) {
      this.readSchema(uri);
    }
  }

  readSchema = uri => {
    const link = new HttpLink({ uri });
    this.setState({ loading: true });
    introspectSchema(link)
      .then(schema => this.setState({ schema, loading: false, err: null }))
      .catch(err => {
        console.error(err);
        this.setState({ loading: false, err });
      });
  };

  render() {
    const { children } = this.props;
    const { schema, loading, err } = this.state;

    return schema ? children(schema, loading, err) : null;
  }
}

export default SchemaLoader;
