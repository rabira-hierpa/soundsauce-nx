'use client';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PeriodChart from '../charts/PeriodChart';
import { ParsedPeriodData, PeriodData } from '../../types/period-types';
import LargeChart from '../charts/LargeChart';

const D3PeriodDataVisualization = () => {
  const [csvData, setCsvData] = useState<PeriodData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [availableDateIntervals, setAvailableDateIntervals] = useState<
    string[]
  >([]);

  useEffect(() => {
    fetch('/api/csv/get_large_data')
      .then((res) => res.text())
      .then((data: any) => {
        const result = Papa.parse(data, {
          header: true,
        }) as ParsedPeriodData;
        const dates = result.data.map(
          (d) => String(d.ENDDATETIME).split(' ')[0]
        );
        const uniqueDates = new Set(dates);
        const _dateIntervals = Array.from(uniqueDates);
        setCsvData(result.data);
        setAvailableDateIntervals(
          _dateIntervals.filter((value) => value !== 'undefined')
        );
      })
      .catch((err) => {
        console.error({ err });
      })
      .finally(() => setLoading(false));
  }, []);

  const getColumns = (data: PeriodData[]): GridColDef[] => {
    if (data.length === 0) {
      return [];
    }

    return Object.keys(data[0]).map((key) => {
      return {
        field: key,
        headerName: key,
        flex: 1,
        minWidth: 150,
      };
    });
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex flex-col flex-grow ">
      <div id="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>

      <div className="flex-auto ">
        <h3 className="text-xl text-center text-blue-500">
          RAW Period Data visualization
        </h3>

        <LargeChart data={csvData} availableDates={availableDateIntervals} />
      </div>

      <h3 className="text-xl text-center text-blue-500 py-5">Tabular Data,</h3>
      <div
        className="mx-20"
        style={{ width: window.innerWidth - window.innerWidth * 0.25 }}
      >
        <DataGrid
          autoHeight
          rows={csvData}
          getRowId={(row) => `${row.ID}`}
          columns={getColumns(csvData)}
          density="compact"
          scrollbarSize={17}
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
        />
      </div>
    </div>
  );
};

export default D3PeriodDataVisualization;
