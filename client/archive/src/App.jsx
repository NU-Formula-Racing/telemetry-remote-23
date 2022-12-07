import React from 'react';
import { Component, useState, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';

import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';
import { Context } from './components/shared/Context';

import socketio from "socket.io-client";
const socket = socketio.connect("http://localhost:3001");

const util = require('util');
export default class App extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      isLive: false,
      currentSensors: [],
      sessionName: '',
      connected: false,
    };
  }

  async getCurrentSensors() {
    await socket.emit("getSensors", (res) => {
      console.log("getSensors res ", res)
      this.setState({ currentSensors: res });
      // socket.disconnect();
    });

    // socket.disconnect();

    // const response = await fetch(`http://localhost:3001/getSensors`);
    // let results = await response.json();
    // console.log(`get sensor api res: ${results}`);
    // this.setState({currentSensors: results.message["sensors"]});
    // var sensors = {
    //   "FRTemp": [(0, 0)],
    //   "BLTemp": [(0, 0)],
    // }
    // this.setState({currentSensors: sensors});
    // prints message object in full
    // console.log(util.inspect(this.state.currentSensors, {showHidden: false, depth: null, colors: true}));
  }

  async componentDidMount() {
    console.log("comp did mount")
    await this.getCurrentSensors();
  }

  handleMouseDown = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(true);
  }

  handleMouseUp = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(false);
  }


  render() {
    return (
      <div onMouseDown={(e) => {this.handleMouseDown(e)}} onMouseUp={(e) => {this.handleMouseUp(e)}}>
        <GlobalStyle />
        <Sidebar
          isLive={this.state.isLive}
          setIsLive={(next) => this.setState({ isLive: next })}
          currentSensors={this.state.currentSensors}
          setCurrentSensors={(newState) => this.setState({ currentSensors: newState })}
          setSessionName={(newState) => this.setState({ sessionName: newState })}
          connected={this.state.connected}
        />
        <Main
          isLive={this.state.isLive}
          currentSensors={this.state.currentSensors}
          setCurrentSensors={(newState) => this.setState({ currentSensors: newState })}
        />
      </div>
    );
  }
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Open Sans', sans-serif;
  }
`;