import styled from 'styled-components';

import DndFlex from '../../shared/DnDFlex';
import Number from './Number';

export default function Numbers(props) {

  return (
    <SemiContext>
      <DndFlex
        //scrollHeight={props.scrollHeight}
        vSpace={12}
        itemWidth={240}
        itemHeight={190}
        items={props.sensors}
        setCurrentItems={(x) => props.setCurrentSensors(x)}
      >
        {props.sensors.map((e, index) => {
          return (
            <Number
              value={e.id*30}
              percentage={e.id}
              unit={'m/s'}
              label={e.label}
              key={index}
            />
          );
        })}
      </DndFlex>
    </SemiContext>
  );
}

const SemiContext = styled.div`
  position: relative;
`;