import React, { useContext, useMemo, useCallback } from 'react'
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { extent, max, bisector } from 'd3-array';
import BasicContainer from "../../shared/BasicContainer";
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { MarkerArrow, MarkerCross, MarkerX, MarkerCircle, MarkerLine } from '@visx/marker';
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { showTooltip } from '@visx/tooltip/lib/enhancers/withTooltip';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { LinePath, Bar, Line, stackOffset } from '@visx/shape';
import * as allCurves from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { timeFormat } from 'd3-time-format';
import { Zoom } from '@visx/zoom';

const series = [generateDateValue(50, 1/72).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
)]

const allData = series.reduce((rec, d) => rec.concat(d), []);

const bisectDate = bisector((d) => new Date(d.date)).left;
const formatDate = timeFormat("%b %d, '%y");
// data accessors
const getX = (d) => d.date;
const getY = (d) => d.value;

// scales
const xScale = scaleTime({
    domain: extent(allData, getX),
  });
const yScale = scaleLinear({
domain: [0, max(allData, getY)],
});

const graph_offset = 25

export default function Graph() {
    const curveType = 'curveLinear'
    const height = 300
    const width = 800
    // update scale output ranges
    xScale.range([0, width - 3*graph_offset]);
    yScale.range([height * 0.9, height * 0.1]);

    const { showTooltip,
        tooltipData,
        hideTooltip,
        tooltipTop = 0,
        tooltipLeft = 0, } = useTooltip();

    // tooltip handler
    const handleTooltip = useCallback(
        (event) => {
          let { x } = localPoint(event) || { x: (graph_offset*2) }; // x of mouse
          x -= (graph_offset*2)
          const x0 = xScale.invert(x); // maps x -> time 
          const index = bisectDate(allData, x0, 1); // finds index of the middle time
          const d0 = allData[index - 1]; 
          const d1 = allData[index];
          let d = d0;
          if (d1 && getX(d1)) {
            d = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
          }
          showTooltip({
            tooltipData: d,
            tooltipLeft: xScale(getX(d)),
            tooltipTop: yScale(getY(d)),
          });
        },
        [showTooltip, yScale, xScale],
      );
  return (
        <div>
            <svg width={width} height={height} 
                >
                <MarkerX
                id="marker-x"
                stroke="#333"
                size={12}
                strokeWidth={4}
                markerUnits="userSpaceOnUse"
                />
                <MarkerCross
                id="marker-cross"
                stroke="#333"
                size={22}
                strokeWidth={4}
                strokeOpacity={0.6}
                markerUnits="userSpaceOnUse"
                />
                <MarkerCircle id="marker-circle" fill="#333" size={2} refX={2} />
                <MarkerArrow id="marker-arrow-odd" stroke="#333" size={12} strokeWidth={1} />
                <MarkerLine id="marker-line" fill="#333" size={16} strokeWidth={1} />
                <MarkerArrow id="marker-arrow" fill="#333" refX={2} size={12} />
                <rect width={width} height={height} fill="#efefef" rx={14} ry={14} />
                  {width > 8 &&
                  series.map((lineData, i) => {
                      let markerStart = 'url(#marker-circle)';
                      if (i === 1) markerStart = 'url(#marker-line)';
                      const markerEnd = 'url(#marker-circle)';
                      return (
                      <Group key={`lines-${i}`} top={i * height} left={graph_offset*2}>
                          {lineData.map((d, j) => (
                              <circle
                              key={i + j}
                              r={3}
                              cx={xScale(getX(d))}
                              cy={yScale(getY(d))}
                              stroke="rgba(33,33,33,0.5)"
                              />
                          ))}
                          {/* <rect width={width} height={height} fill="#efefef" rx={14} ry={14} /> */}
                          <AxisBottom left={0} top={height-30} scale={xScale} />
                          <AxisLeft left={0} scale={yScale} />
                          <LinePath
                          curve={allCurves[curveType]}
                          data={lineData}
                          x={(d) => xScale(getX(d)) ?? 0}
                          y={(d) => yScale(getY(d)) ?? 0}
                          stroke="#333"
                          strokeWidth={1}
                          strokeOpacity={1}
                          shapeRendering="geometricPrecision"
                          markerMid="url(#marker-circle)"
                          markerStart={markerStart}
                          markerEnd={markerEnd}
                          />
                          <Bar
                              x={0}
                              y={0}
                              width={width}
                              height={height}
                              fill="transparent"
                              rx={14}
                              onTouchStart={handleTooltip}
                              onTouchMove={handleTooltip}
                              onMouseMove={handleTooltip}
                              onMouseLeave={() => hideTooltip()}
                          />
                          {tooltipData && (
                          <Zoom>
                          {(zoom) => ( 
                          <g style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                          ref={zoom.containerRef}>
                              <Line
                              from={{ x: tooltipLeft, y: height * 0.08 }}
                              to={{ x: tooltipLeft, y: height * 0.9}}
                              stroke="#5048E5"
                              strokeWidth={2}
                              pointerEvents="none"
                              strokeDasharray="5,2"
                              />
                              <circle
                              cx={tooltipLeft}
                              cy={tooltipTop + 1}
                              r={4}
                              fill="black"
                              fillOpacity={0.1}
                              stroke="black"
                              strokeOpacity={0.1}
                              strokeWidth={2}
                              pointerEvents="none"
                              />
                              <circle
                              cx={tooltipLeft}
                              cy={tooltipTop}
                              r={4}
                              fill="#5048E5"
                              stroke="white"
                              strokeWidth={2}
                              pointerEvents="none"
                              />
                              <div>
                                <TooltipWithBounds
                                  key={Math.random()}
                                  top={tooltipTop + 150}
                                  left={tooltipLeft + 40}
                                >
                                  {`${getY(tooltipData)}`}
                                </TooltipWithBounds>
                              </div>
                              {/* <rect
                                width={width}
                                height={height}
                                rx={14}
                                fill="transparent"
                                // onTouchStart={zoom.dragStart}
                                // onTouchMove={zoom.dragMove}
                                onTouchEnd={zoom.dragEnd}
                                onMouseDown={zoom.dragStart}
                                onMouseUp={zoom.dragEnd}
                                // onMouseMove={zoom.dragMove}
                                
                                // onMouseLeave={() => {
                                //   if (zoom.isDragging) zoom.dragEnd();
                                // }}
                                onDoubleClick={(event) => {
                                  const point = localPoint(event) || { x: 0, y: 0 };
                                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                                }}
                              /> */}
                          </g>
                          )}
                          </Zoom>
                          )}
                    </Group>
                    );
                })}
          </svg>
          {tooltipData && (
            <div>
              <TooltipWithBounds
                key={Math.random()}
                top={tooltipTop + 150}
                left={tooltipLeft + 40}
              >
                {`${getY(tooltipData)}`}
              </TooltipWithBounds>
            </div>
          )}
        </div>
    )}