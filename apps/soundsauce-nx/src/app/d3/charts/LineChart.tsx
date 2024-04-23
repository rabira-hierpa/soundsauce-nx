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
    if (chartRef.current) {
      const svg = d3.select(chartRef.current);

      // Clear previous chart
      svg.selectAll('*').remove();

      // Set up chart dimensions
      const margin = { top: 20, right: 20, bottom: 30, left: 50 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;
      const parsedDate = d3.timeParse('%Y-%m-%d');

      data.forEach((d: IGraphData) => {
        d.date = parsedDate(d.date.toISOString().split('T')[0]) as Date;
        d.Leq = +d.Leq;
      });

      const chartGroup = svg
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date) as [Date, Date])
        .range([0, innerWidth]);
      const y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.Leq) as [number, number])
        .range([innerHeight, 0]);

      const xAxis = d3
        .axisBottom(x)
        .tickFormat((domainValue: d3.AxisDomain, _index: number) => {
          const date = domainValue as Date;
          return d3.timeFormat('%Y-%m-%d')(date);
        });

      const yAxis = d3.axisLeft(y).ticks(5);

      const valueLine = d3
        .line<IGraphData>()
        .x((d) => (d.date ? x(d.date) : 0))
        .y((d) => y(d.Leq));

      // x-axis label
      chartGroup
        .append('g')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', 'rotate(-65)');

      // y-axis label
      chartGroup.append('g').call(yAxis);

      // Add the valueline path.
      chartGroup
        .append('path')
        .data([data])
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', valueLine);

      // Append a circle and text for the cursor point label
      const focus = chartGroup.append('g').style('display', 'none');
      focus
        .append('circle')
        .attr('class', 'focusCircle')
        .attr('r', 5)
        .style('fill', 'none')
        .style('stroke', 'black');
      focus
        .append('text')
        .attr('class', 'focusText')
        .attr('x', 10)
        .attr('dy', '.31em');

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

      // Function to handle mousemove event

      chartGroup
        .append('rect')
        .attr('class', 'overlay')
        .attr('width', width)
        .attr('height', height)
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .on('mousemove', (d: any) => {
          const x1 = x.invert(d3.pointer(d, d.currentTarget)[0]);
          const [x0] = d3.pointer(d, d.currentTarget);
          const i = d3.bisector((d: IGraphData) => d.date).left(data, x1, 1);
          const d0 = data[i - 1];
          const d1 = data[i];
          const d2 = x0 - d0.date.getTime() > d1.date.getTime() - x0 ? d1 : d0;
          focus.attr('transform', `translate(${x(d2.date)}, ${y(d2.Leq)})`);
          focus.select('.focusText').text(d2.Leq);
          tooltip
            .html(
              `Date: ${d3
                .timeFormat('%Y-%m-%d')(d2.date)
                .toString()}<br/>Value: ${d2.Leq}`
            )
            .style('left', d3.pointer(d, d.currentTarget)[0] + 'px')
            .style('top', d3.pointer(d, d.currentTarget)[1] - 28 + 'px');
        });
    }
  }, [data, width, height]);

  return <svg ref={chartRef} width={width} height={height}></svg>;
};

export default LineChart;
