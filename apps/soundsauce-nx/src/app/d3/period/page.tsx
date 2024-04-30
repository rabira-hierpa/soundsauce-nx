'use client';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PeriodChart from '../charts/PeriodChart';
import { ParsedPeriodData, PeriodData } from '../../types/period-types';

const D3PeriodDataVisualization = () => {
  const [csvData, setCsvData] = useState<PeriodData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/csv/get_period_data')
      .then((res) => res.text())
      .then((data: any) => {
        const lines = data.split('\n');
        const dataIndex = lines.indexOf('[data]') + 1;
        const csvData = lines.slice(dataIndex).join('\n');
        const result = Papa.parse(csvData, {
          header: true,
        }) as ParsedPeriodData;
        setCsvData(result.data);
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
    <div className="flex flex-col  mx-auto">
      <div id="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>

      {
        <>
          <div className="w-full h-[1200px]">
            <h3 className="text-xl text-center text-blue-500">
              RAW Period Data visualization
            </h3>
            <PeriodChart data={csvData} />
          </div>
          <h3 className="text-xl text-center text-blue-500 py-5">
            Tabular Data,
          </h3>
          <div className="mx-20">
            <DataGrid
              autoHeight
              rows={csvData}
              getRowId={(row) => row.ID}
              columns={getColumns(csvData)}
              density="compact"
              scrollbarSize={17}
              disableColumnMenu
              disableColumnSelector
              disableDensitySelector
            />
          </div>
        </>
      }
    </div>
  );
};

export default D3PeriodDataVisualization;
