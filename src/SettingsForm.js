import React, { Component } from "react";

class SettingsForm extends Component {
  state = { uri: this.props.uri };

  handleInputChange = event => {
    this.setState({ uri: event.target.value });
  };

  handleSubmit = event => {
    const { updateURI } = this.props;
    const { uri } = this.state;
    if (updateURI instanceof Function) {
      updateURI(uri);
    }
    event.preventDefault();
  };

  render() {
    const { uri } = this.state;

    return (
      <form onSubmit={this.handleSubmit} className="settings-form">
        <label htmlFor="uri">GraphQL Server URL:</label>
        <input id="uri" type="text" value={uri} onChange={this.handleInputChange} />
        <button type="submit">Get schema</button>
      </form>
    );
  }
}

export default SettingsForm;
