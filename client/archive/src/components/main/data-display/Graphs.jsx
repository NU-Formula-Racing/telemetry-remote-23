import { Component, useState, useEffect } from 'react';
import Graph from './Graph';
import DndList from '../../shared/DnDList';
import VertSpacer from '../../shared/VertSpacer';
// import socketio from "socket.io-client";


export default function Graphs(props) {
  return (
    <DndList
      items={props.sensors} // need to pass in full sensors here
      vspace={7}
      setCurrentItems={(x) => props.setCurrentSensors(x)}
    >
      {Object.keys(props.sensors).map((e, index) => {
        return (
          <Graph
            width={props.width}
            sensorName={e}
            initSensorData={props.sensors[e]}
            key={index}
            rerender={() => {props.rerender()}}
          />
        );
      })}
    </DndList>
  );
}

