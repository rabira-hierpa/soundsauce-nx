'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { PeriodData } from '../types/period-types';
import dayjs from 'dayjs';
import MeasurementValues from '../d3/charts/(components)/line-values';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeInterval } from '../types/time-interval';
import { Slider } from '@mui/material';
import { ProcessedSVANDATA } from '../types/svan-types';

const Page = () => {
  const [data, setData] = useState<ProcessedSVANDATA[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chartData, setChartData] = useState<any>({});
  const [availableDateIntervals, setAvailableDateIntervals] = useState<
    string[]
  >([]);
  const [availableMeasurements, setAvailableMeasurements] = useState<
    (keyof PeriodData)[]
  >([]);
  const [selectedMeasurements, setSelectedMeasurements] = useState<
    (keyof PeriodData)[]
  >([]);
  const [timeInterval, setTimeInterval] = useState<TimeInterval>(
    TimeInterval.FIFTEEN_MINUTES
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [size, setSize] = useState<number>(10);
  const [showAllDates, setShowAllDates] = useState<boolean>(false);
  const chartRef = useRef(null);

  const generateData = (maxPoint: number) => {
    const allData: ProcessedSVANDATA[] = [];
    let date = dayjs('2023-01-02');
    for (let index = 0; index < maxPoint; index++) {
      date = dayjs(date).add(1, 'minute'); // Update date inside the loop
      const element: ProcessedSVANDATA = {
        ID: (index + 1).toString(),
        DATETIME: date,
        LAFmax: parseFloat((Math.random() * 100).toFixed(2)),
        LAFmin: parseFloat((Math.random() * 100).toFixed(2)),
        LAeq: parseFloat((Math.random() * 100).toFixed(2)),
        LAeqLn: parseFloat((Math.random() * 100).toFixed(2)),
      };
      allData.push(element);
    }
    return allData;
  };

  const mappedData = (data: ProcessedSVANDATA[]) =>
    data.reduce(
      (acc, item: ProcessedSVANDATA) => {
        acc.LAE.push(Number(item.LAeq));
        acc.LAEQ.push(Number(item.LAeqLn));
        acc.LAFMAX.push(Number(item.LAFmax));
        acc.LAFMIN.push(Number(item.LAFmin));
        return acc;
      },
      {
        LAE: [] as number[],
        LAEQ: [] as number[],
        LAFMAX: [] as number[],
        LAFMIN: [] as number[],
      }
    );
  const formatChartData = useCallback((data: ProcessedSVANDATA[]) => {
    return {
      labels: data.map((item: ProcessedSVANDATA) => {
        return dayjs(item.DATETIME).format('HH:MM:ss');
      }),
      datasets: [
        {
          label: 'LAE',
          data: mappedData(data).LAE,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'LAEQ',
          data: mappedData(data).LAEQ,
          fill: false,
          borderColor: 'rgb(25, 102, 92)',
          tension: 0.1,
        },
        {
          label: 'LAFMAX',
          data: mappedData(data).LAFMAX,
          fill: false,
          borderColor: 'rgb(10, 250, 102)',
          tension: 0.1,
        },
        {
          label: 'LAFMIN',
          data: mappedData(data).LAFMIN,
          fill: false,
          borderColor: 'rgb(175, 102, 132)',
          tension: 0.1,
        },
      ],
    };
  }, []);

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };
  useEffect(() => {
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      zoomPlugin
    );
    setLoading(true);
    const data = generateData(size * 1000);
    const dates = data.map((d) =>
      String(dayjs(d.DATETIME).format('YYYY-MM-DD'))
    );
    const uniqueDates = new Set(dates);
    const _dateIntervals = Array.from(uniqueDates);
    setData(data);
    setAvailableDateIntervals(
      _dateIntervals.filter((value) => value !== 'undefined')
    );
    setSelectedDate(new Date(_dateIntervals[0]));
    const _data = formatChartData(data);
    setChartData(_data);
    setLoading(false);
  }, [size]);

  useEffect(() => {
    const filteredData = data.filter((item) =>
      dayjs(item.DATETIME).isSame(dayjs(selectedDate), 'day')
    );
    const _data = formatChartData(filteredData);
    setChartData(_data);
    handleResetZoom();
  }, [data, formatChartData, selectedDate]);

  useEffect(() => {
    if (showAllDates) {
      const allData = formatChartData(data.slice(1, data.length));
      setChartData(allData);
      setShowAllDates(false);
    }
  }, [showAllDates]);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Chart Example</h1>
      <div className="text-center flex justify-center px-5 space-x-10">
        <span>Data Size(k)</span>
        <Slider
          value={size}
          onChange={(event, newValue) => setSize(newValue as number)}
          aria-labelledby="continuous-slider"
          valueLabelDisplay="auto"
          min={10}
          max={100}
          step={10}
        />
      </div>
      <div className="bg-white p-4 shadow-md h-[700px] w-full">
        {loading ? (
          <p className="flex justify-center items-center">Loading...</p>
        ) : (
          <Line
            ref={chartRef}
            data={{
              ...chartData,
              datasets: chartData.datasets.map((dataset: any) => ({
                ...dataset,
                pointRadius: 0,
              })),
            }}
            options={{
              animation: false,
              // parsing: false,
              normalized: true,
              spanGaps: true,
              plugins: {
                decimation: {
                  enabled: true,
                  algorithm: 'min-max',
                },
                zoom: {
                  zoom: {
                    wheel: { enabled: true },
                    pinch: { enabled: true },
                    mode: 'xy',
                  },
                  pan: {
                    enabled: true,
                    mode: 'xy',
                  },
                },
              },
              elements: {
                line: {
                  tension: 0,
                  borderColor: 'rgba(75, 192, 192, 0.6)',
                  borderWidth: 2,
                },
              },
            }}
          />
        )}
      </div>
      <div className="flex flex-col flex-grow text-center py-20">
        <div className="flex">
          <button onClick={handleResetZoom}>Reset Zoom</button>
        </div>
        <div>
          {!!availableMeasurements.length && (
            <MeasurementValues
              availableMeasurements={availableMeasurements}
              selectedMeasurements={selectedMeasurements}
              setSelectedMeasurements={setSelectedMeasurements}
            />
          )}
        </div>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <p className="text-xl font-semibold">Range</p>
          <button
            className="rounded-lg border-md border-teal-100"
            onClick={() => setShowAllDates(true)}
          >
            Show all dates
          </button>
          <DateCalendar
            value={dayjs(selectedDate)}
            onChange={(newValue) => {
              return setSelectedDate(newValue);
            }}
            shouldDisableDate={(date) =>
              !availableDateIntervals.includes(date.format('YYYY-MM-DD'))
            }
          />
        </LocalizationProvider>
      </div>
    </div>
  );
};

export default Page;
