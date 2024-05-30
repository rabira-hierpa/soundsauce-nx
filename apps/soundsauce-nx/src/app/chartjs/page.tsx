'use client';
import { useState, useEffect, useRef } from 'react';
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
import { ParsedPeriodData, PeriodData } from '../types/period-types';
import Papa from 'papaparse';
import dayjs from 'dayjs';
import TimeIntervalGroup from '../d3/charts/(components)/time-interval';
import MeasurementValues from '../d3/charts/(components)/line-values';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { TimeInterval } from '../types/time-interval';
import { Slider } from '@mui/material';

const Page = () => {
  const [data, setData] = useState<PeriodData[]>([]);
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
  const chartRef = useRef(null);
  const formatChartData = (data: PeriodData[]) => {
    return {
      labels: data.map((item: PeriodData) => {
        return dayjs(item.ENDDATETIME).format('HH:MM MM/YY');
      }),
      datasets: [
        {
          label: 'LAE',
          data: data.map((item: PeriodData) => +item.LAE),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
        {
          label: 'LAEQ',
          data: data.map((item: PeriodData) => +item.LAEQ),
          fill: false,
          borderColor: 'rgb(25, 102, 92)',
          tension: 0.1,
        },
        {
          label: 'LAFMAX',
          data: data.map((item: PeriodData) => +item.LAFMAX),
          fill: false,
          borderColor: 'rgb(10, 250, 102)',
          tension: 0.1,
        },
        {
          label: 'LAFMIN',
          data: data.map((item: PeriodData) => +item.LAFMIN),
          fill: false,
          borderColor: 'rgb(175, 102, 132)',
          tension: 0.1,
        },
      ],
    };
  };
  const lineChartOptions = {};

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
    fetch(`/api/csv/get_period_data?size=${size}k`)
      .then((res) => res.text())
      .then((data: any) => {
        const result = Papa.parse(data, {
          header: true,
        }) as ParsedPeriodData;

        // Check if result.data exists before using it
        if (result.data) {
          const dates = result.data.map(
            (d) => String(d.ENDDATETIME).split(' ')[0]
          );

          const uniqueDates = new Set(dates);
          const _dateIntervals = Array.from(uniqueDates);
          setData(result.data);
          setAvailableDateIntervals(
            _dateIntervals.filter((value) => value !== 'undefined')
          );
          setSelectedDate(new Date(_dateIntervals[0]));
          const _data = formatChartData(result.data);
          setChartData(_data);
        } else {
          console.error('Data is empty or undefined');
        }
      })
      .catch((err) => {
        console.error({ err });
      })
      .finally(() => setLoading(false));
  }, [size]);

  useEffect(() => {
    let filteredData = data;
    if (selectedDate) {
      console.log(selectedDate);
      filteredData = data.filter((item) =>
        dayjs(item.ENDDATETIME).isSame(dayjs(selectedDate), 'day')
      );
    }
    const _data = formatChartData(filteredData);
    setChartData(_data);
  }, [availableDateIntervals, data, selectedDate]);

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
      <div className="bg-white p-4 shadow-md min-h-[700px]  w-full">
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
              plugins: {
                decimation: {
                  enabled: true,
                  algorithm: 'lttb',
                  samples: 100,
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
          <button onClick={() => chartRef?.current.resetZoom()}>
            Reset Zoom
          </button>
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
            onClick={() => setSelectedDate(null)}
          >
            Show all dates
          </button>
          <DateCalendar
            value={dayjs(selectedDate)}
            onChange={(newValue) => setSelectedDate(newValue)}
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
