import { useEffect } from 'react';

import styled from 'styled-components';

export default function VertIndicator(props) {
  return(
    <Line y={props.y} />
  )
}

const Line = styled.div`
  width: 100%;
  border-top: 1.5px solid #564fe6;
  position: absolute;
  left: 0px;
  top: ${props => props.y}px;
`;