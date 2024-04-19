import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { IGraphData, LineChartProps } from '../../types';

/**
 * Renders a line chart using D3.js library.
 *
 * @component
 * @param {LineChartProps} props - The component props.
 * @param {IGraphData[]} props.data - The data points for the line chart.
 * @param {number} props.width - The width of the chart.
 * @param {number} props.height - The height of the chart.
 * @returns {JSX.Element} The rendered LineChart component.
 */
const LineChart: React.FC<LineChartProps> = ({
  data,
  width,
  height,
}: LineChartProps): JSX.Element => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    console.log({ data });
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);

      // Clear previous chart
      svg.selectAll('*').remove();

      // Set up chart dimensions
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const parseDate = d3.timeParse('%Y-%m-%d');

      data.forEach((d: IGraphData) => {
        d.date = parseDate(d.date);
        d.Leq = +d.Leq;
      });

      const chartGroup = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => new Date()) as [Date, Date])
        .range([0, innerWidth]);
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.Leq) as number])
        .range([innerHeight, 0]);

      const valueLine = d3
        .line<IGraphData>()
        .x((d) => x(d.date))
        .y((d) => y(d.Leq));

      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));
      chartGroup.append('g').call(d3.axisLeft(y));

      chartGroup
        .append('path')
        .data([data])
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', valueLine);
      // const dateExtent = d3.extent(data, function (d) {
      //   return parseDate(d.date);
      // });
      // Create x and y scales
      // const xScale = d3
      //   .scaleTime()
      //   .domain(
      //     dateExtent[0] === undefined ? [new Date(0), new Date(0)] : dateExtent
      //   )
      //   .range([0, innerWidth]);

      // const yScale = d3
      //   .scaleLinear()
      //   .domain([
      //     0,
      //     d3.max(data, function (d) {
      //       return d.Leq;
      //     }) || 0,
      //   ])
      //   .range([innerHeight, 0]);

      // const xAxis = d3.axisBottom(xScale).ticks(5);
      // const yAxis = d3.axisLeft(yScale).ticks(10);
      // Create line generator
      // const valueLine = d3
      //   .line<IGraphData & { date: Date | d3.NumberValue; Leq: number }>()
      //   .x((d) => xScale(Number(d.date)))
      //   .y((d) => yScale(d.Leq));

      // const chartGroup = svg
      //   .append('path')
      //   .data([data])
      //   .attr('class', 'line')
      //   .attr('d', valueLine);
      // const focus = svg
      //   .append('g')
      //   .attr('class', 'focus')
      //   .style('display', 'none');

      // focus.append('circle').attr('r', 4.5);

      // focus.append('text').attr('x', 9).attr('dy', '.35em');

      // function mousemove(this: any, event: MouseEvent) {
      //   const x0: Date | d3.NumberValue = xScale.invert(d3.pointer(event, this)[0]);
      //   const i: number = Math.round(x0);
      //   const d0: number = data[i];
      //   focus.attr('transform', `translate(${xScale(i)}, ${yScale(d0)})`);
      //   focus.select('text').text(d0);
      //   focus.select('text').text(d0);
      // }

      // Append chart group
      // const chartGroup = svg
      //   .append('g')
      //   .attr('transform', `translate(${margin.left},${margin.top})`);

      // Append line path
      // chartGroup
      //   .append('path')
      //   .datum(data)
      //   .attr('fill', 'none')
      //   .attr('stroke', 'steelblue')
      //   .attr('stroke-width', 2)
      //   .attr('d', line)
      //   .on('mouseover', () => focus.style('display', null))
      //   .on('mouseout', () => focus.style('display', 'none'))
      //   .on('mousemove', mousemove);
    }
  }, [data, width, height]);

  return <svg ref={chartRef} width={width} height={height}></svg>;
};

export default LineChart;
