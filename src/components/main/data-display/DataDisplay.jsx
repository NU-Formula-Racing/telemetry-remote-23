import React, { Component, createRef } from 'react';
import styled from 'styled-components';

import NumGraphToggle from './NumGraphToggle';
import Graphs from './Graphs';
import Numbers from './Numbers';

import StyledStatus from '../../shared/StyledStatus';

export default class DataDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dispType: 'graphs',
      scrollAmt: 0,
      whatthefuck: true,
    }

    this.containerRef = null;

    this.setContainerRef = (element) => {
      this.containerRef = element;
    }

    this.updateWidth = () => {
      if (this.containerRef) {
        this.content = (this.state.dispType==='graphs')
          ? <Graphs
              viewState={this.props.viewState}
              sensors={this.props.sensors}
              setCurrentSensors={(newState) => this.props.setCurrentSensors(newState)}
              width={this.containerRef ? this.containerRef.clientWidth - 16 : 0}
              rerender={() => {this.setState({ whatthefuck: true })}}
            />
          : <Numbers
              viewState={this.props.viewState}
              scrollHeight={this.state.scrollAmt}
              sensors={this.props.sensors}
              setCurrentSensors={(newState) => this.props.setCurrentSensors(newState)}
            />;
        this.setState({ whatthefuck: true });
      }
    }

    this.handleScroll = () => {
      const scrollAmt = this.containerRef.scrollTop;
      this.setState({ scrollAmt });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWidth);
    this.updateWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWidth);
  }

  render() {
    return(
      <Container ref={this.setContainerRef} onScroll={this.handleScroll}>
        <NumGraphToggle
          dispType={this.state.dispType}
          setDispType={(x) => this.setState({ dispType: x })}
        />
        {(this.props.sensors && this.props.sensors.length > 0)
          ? this.state.dispType==='graphs'
            ? <Graphs
                viewState={this.props.viewState}
                sensors={this.props.sensors}
                setCurrentSensors={(newState) => this.props.setCurrentSensors(newState)}
                width={this.containerRef ? this.containerRef.clientWidth - 16 : 0}
                rerender={() => {this.setState({ whatthefuck: true })}}
              />
            : <Numbers
                viewState={this.props.viewState}
                scrollHeight={this.state.scrollAmt}
                sensors={this.props.sensors}
                setCurrentSensors={(newState) => this.props.setCurrentSensors(newState)}
              />
          : <StyledStatus>No Selected Sensors</StyledStatus>
        }
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid #818181;
  border-radius: 9px;
  padding: 8px;
  height: 100%;
  padding-top: 50px;
  overflow-y: scroll;
  ::-webkit-scrollbar-thumb {
    background-color: #dadce0;
    border: 4px solid transparent;
    border-radius: 8px;
    background-clip: padding-box;  
  }
  
  ::-webkit-scrollbar {
    width: 16px;
  }
`;