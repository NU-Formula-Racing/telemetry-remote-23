import { Component } from 'react';
import { createGlobalStyle } from 'styled-components';

import Sidebar from './components/sidebar/Sidebar';
import Main from './components/main/Main';

import { Context } from './components/shared/Context';

export default class App extends Component {
  static contextType = Context;

  constructor(props) {
    super(props);

    this.state = {
      isLive: false,
      currentSensors: [],
      sessionName: '',
      socketURL: 'wss://localhost:443/',
      connected: false,
      // socket: new WebSocket('wss://10.105.160.88:443/'),
    };

    /* b'\x16\x03\x01\x02\x00\x01\x00\x01\xfc\x03\x03\xff\xe0\xc7\xe9\xe3\xba\x92I\xed\xc9\xd3D\xab4\xe2\x08\xd9?<(\x9f\x96\xbd\x95\x1d\x91\xb8\xd7\x12\xc9_+ Y9\x00\xe9\xcc\x86\x18aN\x17\xea.\xd9\r\xef\xf7\xd0\x0fKs\x12\xa8e\xfa\x17\xa8`7I\x12q\x9c\x00"\x13\x01\x13\x03\x13\x02\xc0+\xc0/\xcc\xa9\xcc\xa8\xc0,\xc00\xc0\n\xc0\t\xc0\x13\xc0\x14\x00\x9c\x00\x9d\x00/\x005\x01\x00\x01\x91\x00\x17\x00\x00\xff\x01\x00\x01\x00\x00\n\x00\x0e\x00\x0c\x00\x1d\x00\x17\x00\x18\x00\x19\x01\x00\x01\x01\x00\x0b\x00\x02\x01\x00\x00\x10\x00\x0e\x00\x0c\x02h2\x08http/1.1\x00\x05\x00\x05\x01\x00\x00\x00\x00\x00"\x00\n\x00\x08\x04\x03\x05\x03\x06\x03\x02\x03\x003\x00k\x00i\x00\x1d\x00 37\xe2L\x89\xd8w\xa9d\x8d\xaf\xb6\x07(\x00\xf1t\xf2zB\xcd\x95PZ\xf4\xdd\xa5\x93f\xcb\x94\x05\x00\x17\x00A\x04E\xb3\xa7\xf5\xc2j\x97\xa9$o`\x92h`H}u\x02\x07\xd4{d\xa5\x07AMl$KI\xe9\x9ej\x02\xff\xbd\x90\xb6>\xf8\x16\x80+\x0e\xaeE^;\xc0\xd4\x1fP+\x8b\x87mJ\xfb\xfe\xcc5\xcd\x94p\x00+\x00\x05\x04\x03\x04\x03\x03\x00\r\x00\x18\x00\x16\x04\x03\x05\x03\x06\x03\x08\x04\x08\x05\x08\x06\x04\x01\x05\x01\x06\x01\x02\x03\x02\x01\x00\x1c\x00\x02@\x01\x00\x15\x00\xa9\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00' */
    new WebSocket('wss://10.105.160.88:443/');
  }

  handleMouseDown = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(true);
  }

  handleMouseUp = (e) => {
    this.context.setMouseCoords(e.clientX, e.clientY);
    this.context.setDragging(false);
  }

  // componentDidMount() {
  //   this.state.socket.addEventListener('open', function (event) {
  //     console.log('HEKLJEWIOFJDSIOJio')
  //     this.state.socket.send(encodeURI('HEWWO!'));
  //   });

  //   this.state.socket.addEventListener('message', function (event) {
  //     console.log(`sent: ${event}`);
  //   });

  //   this.state.socket.addEventListener('error', function (err) {
  //     console.log(`errorrrorr: ${err.data}`);
  //   });

  //   this.state.socket.onerror = function(err) {
  //     console.log(err.message);
  //   }
  // }

  // updateSocket = () => {
  //   this.setState({ socket: new WebSocket(this.state.socketURL) });
  // }

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
          setSocketURL={(url) => this.setState({ socketURL: `ws://${url}:443` }, () => {
            if (url) {
              this.updateSocket();
            }
          })}
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