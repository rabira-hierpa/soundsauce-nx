import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { PeriodData } from '../../types/period-types';

interface LineChartProps {
  data: PeriodData[];
}

const PeriodChart: React.FC<LineChartProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // D# time parsing and formating functions
    const parseTime = d3.timeParse('%Y-%m-%d %H:%M:%S');
    const formatTime = d3.timeFormat('%d-%m-%Y %H:%M');

    // Set dimensions and margins for the chart
    const margin = { top: 70, right: 30, bottom: 100, left: 80 };
    const width = 1200 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    // set up the x and y scales
    const x = d3.scaleTime().range([0, width]);
    const y = d3.scaleLinear().range([height, 0]);

    // create the svg element and append to it the chart container
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // define the x and y domains
    const typedData = data.map((d) => ({
      ...d,
      ENDDATETIME: new Date(d.ENDDATETIME),
      LAFMAX: d.LAFMAX,
      LAFMIN: +d.LAFMIN,
      LAIMAX: +d.LAIMAX,
      LAIMIN: +d.LAIMIN,
    }));

    x.domain(d3.extent(typedData, (d) => d.ENDDATETIME) as [Date, Date]);
    y.domain([0, d3.max(typedData, (d) => d.LAFMAX) as number]);

    // Add the x-axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(x).tickFormat((domainValue, index) => {
          if (domainValue instanceof Date) {
            // Handle the case where domainValue is a Date
            return formatTime(domainValue);
          }
          return '';
        })
      )
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-90)');

    // add y-axis
    svg.append('g').call(d3.axisLeft(y));

    // create the line generator
    const line = d3
      .line<PeriodData>()
      .x((d) => x(d.ENDDATETIME))
      .y((d) => y(d.LAFMAX));

    // add the line path to the SVG element
    svg
      .append('path')
      .datum(typedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line as any);
  }, [data]);

  return <svg ref={svgRef} />;
};

export default PeriodChart;
