import styled from 'styled-components';

export default function NumGraphToggle(props) {
  const handleClick = () => {
    if (props.dispType === 'graphs') {
      props.setDispType('numbers');
    } else {
      props.setDispType('graphs');
    }
  }

  return(
    <ReferenceFrame>
      <StyledDiv>
        <LabelHolder onClick={() => handleClick()}>
          <Label active={props.dispType === 'graphs'}>Graph</Label>
          <Label active={props.dispType === 'numbers'}>Number</Label>
        </LabelHolder>
        <Overlay onClick={() => handleClick()} isLeft={props.dispType === 'graphs'} />
      </StyledDiv>
    </ReferenceFrame>
  );
}

const ReferenceFrame = styled.div`
  position: relative;
  float: right;
  right: 136px;
  top: -42px;
`;

const StyledDiv = styled.div`
  width: 136px;
  height: 34px;
  top: 0;
  left: 0;
  position: absolute;
`;

const LabelHolder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: #fafafa;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Label = styled.div`
  color: ${props => (props.active ? '#000' : '#838181')};
  font-size: 12px;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s ease;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: ${props => (props.isLeft ? 0 : 68)}px;
  width: 68px;
  height: 100%;
  background-color: #e5e4fB;
  display: inline;
  border-top-left-radius: ${props => (props.isLeft ? 8 : 0)}px;
  border-bottom-left-radius: ${props => (props.isLeft ? 8 : 0)}px;
  border-top-right-radius: ${props => (props.isLeft ? 0 : 8)}px;
  border-bottom-right-radius: ${props => (props.isLeft ? 0 : 8)}px;
  transition: all 0.1s ease;
`;