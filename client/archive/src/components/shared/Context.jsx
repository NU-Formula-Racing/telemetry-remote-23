import React, { Component } from 'react';

const Context = React.createContext(null);
const ContextConsumer = Context.Consumer;

class ContextProvider extends Component{
  constructor(props) {
    super(props);

    this.state = {
      mouseX: 0,
      mouseY: 0,
      dragging: false,
      setMouseCoords: (x, y) => {
        this.setState({ mouseX: x, mouseY: y });
      },
      setDragging: (x) => {
        this.setState({ dragging: x });
      },
    };
  }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export { Context, ContextProvider, ContextConsumer }