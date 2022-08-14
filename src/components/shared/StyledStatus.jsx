import styled from 'styled-components';

export default function StyledStatus(props) {
  return(
    <Status valid={props.valid}>
      {props.children}
    </Status>
  );
}

const Status = styled.div`
  color: ${props => (props.valid ? '#42D060' : '#BE0707')}
`;