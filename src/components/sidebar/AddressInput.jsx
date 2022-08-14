import { useState, useEffect } from 'react';
import styled from 'styled-components';

import BasicContainer from '../shared/BasicContainer';

export default function AddressInput(props) {
  let [focus, setFocus] = useState(false);
  let [input, setInput] = useState('');

  useEffect(() => {
    props.setSocketURL(input);
  }, [input])

  const handleKeyPress = (e) => {
      if (e.keyCode === 13) {
          e.target.blur();
      }
  }

  const handleBlur = () => {
      setFocus(false);
  }

  return(
    <BasicContainer flex>
        <StyledInput 
            type="text" 
            placeholder = "Enter Server Address"
            value={input}
            onInput={(e) => setInput(e.target.value)}
            onFocus={(e) => setFocus(true)}
            onBlur={(e) => handleBlur()}
            onKeyDown={(e) => {handleKeyPress(e)}}
            focus={focus}
            connected={props.connected}
        />
    </BasicContainer>
  );
}

const StyledInput = styled.input`
    border: none;
    padding-top: 3px;
    width: 100%;
    font-weight: ${props => (props.focus ? "normal" : "bold")} ;
    ::placeholder {
        font-weight: normal;
    }
    text-overflow: ellipsis;
    :focus {
        outline: none;
    }
    color: ${props => (props.focus ? "black" : (props.connected ? '#42D060' : '#BE0707')) } ;
`;