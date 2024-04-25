import { useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useSpring, animated } from 'react-spring';
import { IGraphData } from '../../types';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

// type DataPoint = { x: number; y: number };
type LineChartProps = {
  width: number;
  height: number;
  data: IGraphData[];
  color: string;
  cursorPosition: number | null;
  setCursorPosition: (position: number | null) => void;
};

export const NoiseChart = ({
  width,
  height,
  data,
  cursorPosition,
  setCursorPosition,
  color,
}: LineChartProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const parsedDate = d3.timeParse('%Y-%m-%d');

  data.forEach((d: IGraphData) => {
    d.date = parsedDate(d.date.toISOString().split('T')[0]) as Date;
    d.Leq = +d.Leq;
  });

  // Y axis
  const [min, max] = d3.extent(data, (d) => d.Leq);
  const yScale = useMemo(() => {
    return d3
      .scaleLinear()
      .domain([min || 0, max || 0])
      .range([boundsHeight, 0]);
  }, [data, height]);

  // X axis
  const [xMin, xMax] = d3.extent(data, (d) => d.date) as [Date, Date];
  const xScale = useMemo(() => {
    return d3.scaleTime().domain([xMin, xMax]).range([0, boundsWidth]);
  }, [data, width]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll('*').remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + boundsHeight + ')')
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append('g').call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

  // Build the line
  const lineBuilder = d3
    .line<IGraphData>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.Leq));
  const linePath = lineBuilder(data);
  if (!linePath) {
    return null;
  }

  //
  const getClosestPoint = (cursorPixelPosition: number): IGraphData => {
    const x = xScale.invert(cursorPixelPosition);
    let minDistance = xMin.getTime();
    let closest: IGraphData = data[0];

    for (const point of data) {
      const distance = Math.abs(point.date.getTime() - x.getTime());
      if (distance < minDistance) {
        console.log({ distance });
        minDistance = distance;
        closest = point;
      }
    }

    return closest;
  };

  //
  const onMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;

    const closest = getClosestPoint(mouseX);

    setCursorPosition(xScale(closest.date));
  };

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          <path
            d={linePath}
            opacity={1}
            stroke={color}
            fill="none"
            strokeWidth={2}
          />
          {cursorPosition && (
            <Cursor
              height={boundsHeight}
              x={Math.max(0, Math.min(boundsWidth, cursorPosition))}
              y={Math.max(
                0,
                Math.min(
                  boundsHeight,
                  yScale(getClosestPoint(cursorPosition)?.Leq)
                )
              )}
              color={color}
            />
          )}
          <rect
            x={0}
            y={0}
            width={boundsWidth}
            height={boundsHeight}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setCursorPosition(null)}
            visibility={'hidden'}
            pointerEvents={'all'}
          />
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={axesRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        />
      </svg>
    </div>
  );
};

type CursorProps = {
  x: number | null;
  y: number;
  height: number;
  color: string;
};

const Cursor = ({ x, y, height, color }: CursorProps) => {
  const springProps = useSpring({
    to: {
      x,
      y,
    },
  });

  if (!springProps.x) {
    return null;
  }

  return (
    <>
      <animated.line
        x1={springProps.x.get() ?? 0}
        x2={springProps.x.get() ?? 0}
        y1={0}
        y2={height}
        stroke="black"
        strokeWidth={1}
      />
      <circle cx={x ?? 0} cy={y} r={5} fill={color} />
    </>
  );
};
