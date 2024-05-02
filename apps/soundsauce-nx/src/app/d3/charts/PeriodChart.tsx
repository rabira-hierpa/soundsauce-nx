import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PeriodData } from '../../types/period-types';
import TimeIntervalGroup from './(components)/time-interval';
import { TimeInterval } from '../../types/time-interval';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

interface LineChartProps {
  data: PeriodData[];
  availableDates: string[];
}

const PeriodChart: React.FC<LineChartProps> = ({ data, availableDates }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(
    TimeInterval.FIFTEEN_MINUTES
  );
  const [selectedData, setSelectedData] = useState<Date | null>(null);
  const [selectedMeasurements, setSelectedMeasurements] = useState<
    (keyof PeriodData)[]
  >([]);

  useEffect(() => {
    if (availableDates) {
      const date = new Date(availableDates[0]);
      setSelectedData(date);
    }
  }, [availableDates]);

  function constructLineGraph(
    data: PeriodData[],
    selectedData: Date,
    timeInterval: TimeInterval,
    _selectedMeasurements: (keyof PeriodData)[]
  ) {
    d3.select(svgRef.current).selectAll('*').remove();
    //  time parsing and formating functions
    const formatTime = d3.timeFormat('%H:%M');
    const formatDate = d3.timeFormat('%b %d, %y');

    // Set dimensions and margins for the chart
    const graphWidth = window.innerWidth - window.innerWidth * 0.25;
    const margin = { top: 70, right: 0, bottom: 100, left: 80 };
    const width = graphWidth - margin.left - margin.right;
    const height = 700 - margin.top - margin.bottom;

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

    x.domain(d3.extent(data, (d) => d.ENDDATETIME) as [Date, Date]);
    y.domain([
      d3.min(data, (d) => d.LAFMIN) as number,
      d3.max(data, (d) => d.LAFMAX) as number,
    ]);

    // Add the x-axis
    const xAxisTime = d3
      .axisBottom(x)
      .ticks(d3.timeMinute.every(timeInterval))
      .tickFormat((d) => formatTime(d as Date));
    const xAxisDate = d3
      .axisBottom(x)
      .ticks(d3.timeDay.every(1))
      .tickFormat((d) => formatDate(d as Date));

    // Add the x-axis for the dates
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`) // adjust the position as needed
      .call(xAxisDate)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

    // Add the x-axis for the time
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisTime)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-90)');

    // add y-axis
    svg.append('g').call(d3.axisLeft(y));

    // Add vertical gridlines
    svg
      .selectAll('xGrid')
      .data(x.ticks().slice(1))
      .join('line')
      .attr('x1', (d) => x(d))
      .attr('x2', (d) => x(d))
      .attr('y1', 0)
      .attr('y2', height)
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5);

    //Add horizontal gridlines
    svg
      .selectAll('yGrid')
      .data(y.ticks(d3.max(data, (d) => d.LAFMAX) / 10).slice(1))
      .join('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#e0e0e0')
      .attr('stroke-width', 0.5);

    const color = d3
      .scaleOrdinal()
      .domain(['LAFMAX', 'LAFMIN', 'LAE', 'LAEQ'])
      .range(['lightblue', 'orange', 'red', 'green']);

    // create the line generator for lineLAFMAX
    const lineLAFMAX = d3
      .line<PeriodData>()
      .x((d) => x(d.ENDDATETIME))
      .y((d) => y(d.LAFMAX));

    //  create the line generator for properties

    const generateLineGraphs = (properties: (keyof PeriodData)[]) => {
      return properties.map((property) =>
        d3
          .line<PeriodData>()
          .x((d) => x(d.ENDDATETIME))
          .y((d) => y(+d[property]))
      );
    };
    const lineGenerators = generateLineGraphs(_selectedMeasurements);
    console.log({ lineGenerators });

    if (lineGenerators.length) {
      lineGenerators.map((lineGenerator, index) => {
        svg
          .append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', color(_selectedMeasurements[index]))
          .attr('stroke-width', 1.5)
          .attr('d', lineGenerator as any);
      });
    }

    // define tooltip div
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

    // add a circle element
    const circle = svg
      .append('circle')
      .attr('r', 0)
      .attr('fill', 'steelblue')
      .style('stroke', 'white')
      .attr('opacity', 0.7)
      .style('pointer-events', 'none');

    const listeningRect = svg
      .append('rect')
      .attr('width', width)
      .attr('height', height);

    // create the mouse move function

    listeningRect.on('mousemove', function (event) {
      const [xCoord] = d3.pointer(event, svgRef.current);
      const bisectDate = d3.bisector(
        (d: PeriodData) => new Date(d.ENDDATETIME)
      ).left;
      const x0 = x.invert(xCoord);
      const x1 = data.findIndex((d) =>
        dayjs(d.ENDDATETIME).isSame(dayjs(x0), 'minute')
      );
      const i = bisectDate(data, x0, 1);
      const d0 = data[x1 - 1];
      const d1 = data[x1];
      const d =
        dayjs(x0).isBefore(dayjs(d0.ENDDATETIME)) &&
        dayjs(d1.ENDDATETIME).isBefore(dayjs(x0))
          ? d1
          : d0;
      // console.log({ xCoord, x1, id: d.ID.slice(0, 3) });
      const xPos = x(d.ENDDATETIME);
      const yPos = y(d.LAFMAX);

      // Update the circle position
      circle.attr('cx', xPos).attr('cy', yPos);

      // Add transition for the circle radius
      circle.transition().duration(50).attr('r', 5);

      // add in  our tooltip
      tooltip
        .style('display', 'block')
        .style('left', `${xPos + 100}px`)
        .style('top', `${yPos}px`)
        .html(
          `<strong>Time:</strong> ${dayjs(d.ENDDATETIME).format(
            'HH:mm'
          )}<br><strong>LAFMAX:</strong> ${
            d.LAFMAX !== undefined ? d.LAFMAX + 'dB' : 'N/A'
          }`
        );
    });

    listeningRect.on('mouseleave', function () {
      circle.attr('r', 0);
      tooltip.style('display', 'none');
    });
  }

  useEffect(() => {
    // Select the SVG group and remove all its children
    if (svgRef.current && !!data.length && selectedData) {
      const filteredData = data.filter(
        (d) =>
          d.ENDDATETIME?.toString().split(' ')[0] ===
          new Date(selectedData!).toISOString().split('T')[0]
      );
      const typedData = filteredData.map((d) => ({
        ...d,
        ENDDATETIME: new Date(d.ENDDATETIME),
        LAFMAX: +d.LAFMAX,
        LAFMIN: +d.LAFMIN,
        LAE: +d.LAE,
        LAEQ: +d.LAEQ,
      }));
      const measurements = Object.entries(typedData[0])
        .filter(([key, value]) => typeof value === 'number')
        .map(([key]) => key) as (keyof PeriodData)[];
      console.log({ measurements });
      setSelectedMeasurements(measurements);
      constructLineGraph(typedData, selectedData, timeInterval, measurements);
    }
  }, [data, selectedData, timeInterval]);

  return (
    <div className="flex  space-x-5">
      <div id="tooltip"></div>
      <svg ref={svgRef} />
      <div className="flex flex-col flex-grow text-center">
        <div>
          <p className="text-center text-xl font-semibold">Time Interval</p>
          <TimeIntervalGroup
            timeInterval={timeInterval}
            setTimeInterval={setTimeInterval}
          />
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <p className="text-xl font-semibold">Range</p>
          <DateCalendar
            value={dayjs(selectedData)}
            onChange={(newValue) => setSelectedData(newValue)}
            shouldDisableDate={(date) =>
              !availableDates.includes(date.format('YYYY-MM-DD'))
            }
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default PeriodChart;
