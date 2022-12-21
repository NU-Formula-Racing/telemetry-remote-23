import React, { useRef, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import VertIndicator from './VertIndicator';

import useMouse from '../hooks/useMouse';

import { Context } from './Context';

// Expected Props:
/// items             list of dnd items
/// itemWidth         width of child element
/// itemHeight        height of child element
/// vspace            vertical space between rows
/// setCurrentItems   item setter
export default function DndFlex(props) {
  let context = useContext(Context);
  const { mouseX, mouseY } = useMouse();

  const [state, setState] = useState({
    startInd: -1,   // index of item that is being dragged
    indicator: {
      x: 0,         // coordinates of the dnd indicator
      y: 0,
    },
    flexProps: {
      cols: 0,      // # of columns in normal row
      extraCols: 0, // # of columns in extra row
      rows: 0,      // # of full rows
    },
    canDrop: true,
  });
  const [proppedChildren, setChildren] = useState(props.children);

  const dndRef = useRef(null);

  // Resize Listerners
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    handleResize();
  }, [props.children]);

  // Updates the bounding box upon resize
  const handleResize = () => {
    if (dndRef.current) {
      setState(prevState => ({
        ...prevState,
        bounds: dndRef.current.getBoundingClientRect(),
      }));
    }
  }

  // Passes drag state to element as prop
  useEffect(() => {
    const addProps = (initProps) => {      
      const updatedChildren = initProps.map((child, index) => {
        return React.cloneElement(child, {
          isDragging: context.dragging && index === state.startInd,
        });
      });

      return updatedChildren;
    }

    setChildren(addProps(props.children));
  }, [props.children, state.startInd]);

  // DnD Handler
  useEffect(() => {
    // Helper for converting drop sector into drop index based on start index
    const getDrop = (sector) => {
      let startSector = 2 * state.startInd;
      if (startSector - 1 <= sector && sector <= startSector + 2) {
        return state.startInd;
      } else if (sector < startSector) {
        return state.startInd - Math.floor((startSector - sector) / 2);
      } else {
        return state.startInd + Math.floor((sector - startSector - 1) / 2);
      }
    }

    // Ensures that the bounding box has loaded
    if (state.bounds) {
      // Ensures that mouse is in dnd zone
      let sector = getSector(mouseX, mouseY);
      if (sector >= 0) {
        // If item getting dropped
        // if (!context.dragging && state.startInd >= 0 && state.canDrop) {
        if (!context.dragging && state.startInd >= 0) {
          let drop = getDrop(sector);
          
          // Reorder items and propagate change
          let temp = props.items[state.startInd];
          props.items.splice(state.startInd, 1);
          props.items.splice(drop, 0, temp);
          props.setCurrentItems(props.items);

          // Resets dnd start index
          setState(prevState => ({
            ...prevState,
            startInd: -1,
          }));
        }

        // Sets dnd start index if starting to drag
        else {
          setState(prevState => ({
            ...prevState,
            startInd: Math.floor(sector / 2),
          }));
        }
      }
    }
  }, [context.dragging]);

  // DnD Indicator Updating
  useEffect(() => {
    // Helper for updating indicator's coordinates
    const indicatorCoords = (sector) => {
      // Offset based on thickness of indicator in styling
      let indicator_offset = 0.5

      let x = Math.ceil((sector % (2 * state.flexProps.cols)) / 2);
      let y = Math.floor(sector / (2 * state.flexProps.cols));

      // Converts x index to x coordinate
      switch(y < state.flexProps.rows) {
        case true:
          x *= (state.bounds.width / state.flexProps.cols) - indicator_offset;
          break;
        default:
          switch(state.flexProps.extraCols) {
            case 1:
              x *= (state.bounds.width / (2 * state.flexProps.extraCols)) - indicator_offset;
              x += (state.bounds.width / (4 * state.flexProps.extraCols));
              break;
            default:
              x *= (state.bounds.width / state.flexProps.extraCols) - indicator_offset;
          }
      }
      // Converts y index to y coordinate
      y *= props.itemHeight + props.vSpace;

      // Translates to be position relative to screen (rather than bounding box)
      x += state.bounds.left;
      y += state.bounds.top;
      return {
        x,
        y,
      };
    }

    // If bounds are loaded and mouse is in dnd zone
    // updates the dnd indicator coordinates
    if (state.bounds && state.canDrop) {
      setState(prevState => ({
        ...prevState,
        indicator: indicatorCoords(getSector(mouseX, mouseY)),
      }));
    }
  }, [mouseY, mouseX]);

  // Stores relevent dimension data when bounds get loaded
  useEffect(() => {
    if (state.bounds) {
      let cols = Math.floor(state.bounds.width / props.itemWidth);
      setState(prevState => ({
        ...prevState,
        flexProps: {
          cols,
          extraCols: props.items.length % cols,
          rows: Math.floor(props.items.length / cols),
        },
      }));
    }
  }, [state.bounds]);

  // Gets the dnd sector that the mouse is in
  const getSector = (_x, _y) => {
    // Relative distance of mouse from corner of bounding box
    let dy = _y - (state.bounds.top + (.5 * props.vSpace));
    let dx = _x - state.bounds.left;

    // If out of Bounds
    if (dy < 0 || dy > (state.bounds.height - props.vSpace) || dx < 0 || dx > state.bounds.width) {
      return -1;
    }

    // Iterates through full rows
    let sector = 0;
    for (let i = 0; i < state.flexProps.rows; i++) {
      if (dy < (props.itemHeight + props.vSpace) * (i + 1)) {
        for (let j = 0; j < (state.flexProps.cols * 2); j++) {
          if (dx < (state.bounds.width / (state.flexProps.cols * 2)) * (j + 1)) {
            return sector;
          }
          sector++;
        }
      } else {
        sector += state.flexProps.cols * 2;
      }
    }

    // Iterates through extra row
    for (let j = 0; j < (state.flexProps.extraCols * 2); j++) {
      if (dx < (state.bounds.width / (state.flexProps.extraCols * 2)) * (j + 1)) {
        return sector;
      }
      sector++;
    }

    return -1;
  }

  return (
    <FlexTray
      vSpace={props.vSpace}
      ref={dndRef}
      onMouseEnter={() => {setState(prevState => ({
        ...prevState,
        canDrop: true,
      }))}}
      onMouseLeave={() => {setState(prevState => ({
        ...prevState,
        canDrop: false,
      }))}}
    >
      {
        (context.dragging && state.startInd >= 0 && state.canDrop) &&
          <VertIndicator
            height={props.itemHeight}
            x={state.indicator.x}
            y={state.indicator.y}
          />
      }
      {proppedChildren}
    </FlexTray>
  );
}

const FlexTray = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin-top: -${props => props.vSpace}px;
  > * {
    margin-top: ${props => props.vSpace}px;
  }
`;