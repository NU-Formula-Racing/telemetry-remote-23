import Graph from './Graph';
import DndList from '../../shared/DnDList';
import VertSpacer from '../../shared/VertSpacer';

export default function Graphs(props) {
  return (
    <DndList
      items={props.sensors}
      vspace={7}
      setCurrentItems={(x) => props.setCurrentSensors(x)}
    >
      {props.sensors.map((e, index) => {
        return (
          <Graph
            width={props.width}
            sensorName={e.label}
            key={index}
            rerender={() => {props.rerender()}}
          />
        );
      })}
    </DndList>
  );
}