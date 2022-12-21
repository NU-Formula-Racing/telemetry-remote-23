import React, { useRef, useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import HorizIndicator from './HorizIndicator';

import useMouse from '../hooks/useMouse';

import { Context } from './Context';

// Works Kind of like DnD Flex
// Expected Props
/// items             dnd items
/// vspace            space between items
/// setCurrentItems   item setter
export default function DndList(props) {
  let context = useContext(Context);

  const [state, setState] = useState({
    startInd: -1,
    hoverInd: -1,
    vIndex: 0,
    sector: 0,
    canDrop: true,
  });
  const [proppedChildren, setChildren] = useState(props.children);

  const dndRef = useRef(null);

  const { mouseX, mouseY } = useMouse();

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    handleResize();
  }, [props.children]);

  // Assigns Dnd Props to Children
  useEffect(() => {
    const addProps = (initProps) => {
      const handleUnhover = () => {
        if (!context.dragging) {
          setState(prevState => ({
            ...prevState,
            startInd: -1
          }));
        }
      }
      
      const updatedChildren = initProps.map((child, index) => {
        return React.cloneElement(child, {
          sendIndex: () => setState(prevState => ({
            ...prevState,
            hoverInd: index,
          })),
          sendStart: () => handleHover(index),
          removeIndex: () => setState(prevState => ({
            ...prevState,
            hoverInd: -1
          })),
          removeStart: () => handleUnhover(),
          isDragging: context.dragging && index === state.startInd,
          isHovering: context.dragging && index === state.hoverInd && index !== state.startInd && state.canDrop,
        });
      });
  
      return updatedChildren;
    }

    setChildren(addProps(props.children));
  }, [props.children, state.startInd, state.hoverInd]);

  useEffect(() => {
    if (state.startInd >= 0 && !context.dragging && state.canDrop) {
      if (state.bounds) {
        let sector = getSector(mouseX, mouseY);
        if (sector >= 0) {
          let drop = getDrop(sector);
          
          let temp = props.items[state.startInd];
          props.items.splice(state.startInd, 1);
          props.items.splice(drop, 0, temp);
          props.setCurrentItems(props.items);
          handleHover(Math.floor(sector / 2));
        }
      }
    }
    // console.log(mouseX);
  }, [context.dragging])

  useEffect(() => {
    if (state.bounds) {
      setState(prevState => ({
        ...prevState,
        vIndex: getVindex(getSector(mouseX, mouseY)),
      }));
    }
  }, [mouseY]);

  useEffect(() => {
    if (state.bounds) {
      let l = props.children.length;
      let ih = (state.bounds.height - (l * props.vspace * 2)) / l;
      setState(prevState => ({
        ...prevState,
        sector: props.vspace + (ih / 2),
      }))
    }
  }, [state.bounds]);

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
  
  const getVindex = (sector) => {
    let startSector = 2 * state.startInd;

    return state.startInd - Math.floor((startSector - sector) / 2);
  }

  const handleResize = () => {
    if (dndRef.current) {
      setState(prevState => ({
        ...prevState,
        bounds: dndRef.current.getBoundingClientRect(),
      }));
    }
  }

  const handleHover = (i) => {
    if (!context.dragging) {
      setState(prevState => ({
        ...prevState,
        startInd: i,
      }));
    }
  }

  const getSector = (_x, _y) => {
    let dy = _y - state.bounds.top;
    if (dy < 0 || dy > state.bounds.height || _x < state.bounds.left || _x > state.bounds.right) {
      return -1;
    }
    let l = props.children.length;
    for (let i = 0; i < (l * 2); i++) {
      if ((state.sector * (i + 1)) > dy) {
        return i;
      }
    }
    return -1;
  }

  return (
    <FlexTray
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
        <HorizIndicator
          y={(state.vIndex * state.sector * 2) - 0.5}
        />
      }      
      {proppedChildren}
    </FlexTray>
  );
}

const FlexTray = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  user-select: none;
  position: relative;
`;