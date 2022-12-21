import { useState } from 'react';
import styled from 'styled-components';

import BasicContainer from '../shared/BasicContainer';
import VertSpacer from '../shared/VertSpacer';
import SensorDropdown from './SensorDropdown';
import GroupDropDown from './GroupDropDown';

export default function SensorSelector(props) {
  let [selectedGroup, setSelectedGroup] = useState('Safety Sensors');

  return(
    <SelectorContainer>
      <BasicContainer>
        <GroupDropDown 
        selectedGroup={selectedGroup}
        setSelectedGroup={(newState) => setSelectedGroup(newState)}
        />
      </BasicContainer>
      <VertSpacer />
      <BasicContainer expand scroll>
        <SensorDropdown 
        selectedGroup={selectedGroup}
        selectedSensors={props.currentSensors}
        setCurrentSensors={(newState) => props.setCurrentSensors(newState)}
        />
      </BasicContainer>
    </SelectorContainer>
  );
}

const SelectorContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: hidden;
  overflow-x: hidden;
`;


