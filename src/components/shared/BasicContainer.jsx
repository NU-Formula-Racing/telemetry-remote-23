import styled from 'styled-components';

export default function BasicContainer(props) {
  const handleEnter = () => {
    if (props.hoverHandler) {
      props.hoverHandler();
    }
  }

  const handleLeave = () => {
    if (props.exitHandler) {
      props.exitHandler();
    }
  }

  return (
    <Container
      onMouseEnter={() => {handleEnter()}}
      onMouseLeave={() => {handleLeave()}}
      isFlex={props.flex}
      expand={props.expand}
      scroll={props.scroll}
      // grabbable={props.grabbable}
      // grabbing={props.grabbing}
    >
      {props.children}
    </Container>
  );
}

const Container = styled.div`
  width: calc(100% - 18px);
  border: 1px solid #818181;
  border-radius: 9px;
  padding: 8px;
  height: ${props => (props.expand ? '100%' : 'auto')};
  overflow-y: ${props => (props.scroll ? 'scroll' : 'visible')};
  display: ${props => (props.isFlex ? 'flex' : 'auto')};
  align-items: center;
  justify-content: center;
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