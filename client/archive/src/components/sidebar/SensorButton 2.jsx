
import {Component} from 'react'
import styled from 'styled-components'
import BasicContainer from "../shared/BasicContainer";

class SensorButton extends Component {
    
    removeSelected(e){
        let previous = this.props.selectedSensors
        this.props.setCurrentSensors(previous.filter((element) => element.label !== e.target.value))
        this.forceUpdate()
    }
    state = {  }
    render() { 
        return ( 
        <Div
            onMouseEnter={() => {this.props.sendIndex()}}
            onMouseLeave={() => {this.props.removeIndex()}}
            transluscent={this.props.isDragging}
            target={this.props.isHovering}
        >
            <SmallVertSpace/>
            <BasicContainer
                hoverHandler={() => {this.props.sendStart()}}
                exitHandler={() => {this.props.removeStart()}}
            >
                <Holder>
                    <>{this.props.label}</>
                    <StyledButton
                    onClick={e => this.removeSelected(e)}
                    value={this.props.label}>
                        ╳
                    </StyledButton>
                </Holder> 
            </BasicContainer>
            <SmallVertSpace/>
        </Div>
        );
    }
}
export default SensorButton;

const Holder = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

let StyledButton = styled.button`
  width: 20px;
  height: 20x;
  font-size: 8px;
  cursor: pointer;
  border: 0px;
  background-color: white;
`;

let SmallVertSpace = styled.div`
  height: 5px;
`;

const Div = styled.div`
    opacity: ${props => ((props.transluscent) ? '0.4' : '1')};
`;