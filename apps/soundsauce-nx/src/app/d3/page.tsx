'use client';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LineChart from './charts/LineChart';
import parseDate from '../../utils/parseDate';
import { ICSVData, IData, IGraphData } from '../types';
import { parse } from 'path';

const D3Visualization = () => {
  const [csvData, setCsvData] = useState<ICSVData>();
  const [loading, setLoading] = useState<boolean>(true);
  const [transformedData, setTransformedData] = useState<IGraphData[]>([]);

  useEffect(() => {
    fetch('/api/csv/get_noise_data')
      .then((res) => res.text())
      .then((data: any) => {
        const lines = data.split('\n');
        const dataIndex = lines.indexOf('[data]') + 1;
        const csvData = lines.slice(dataIndex).join('\n');
        const result = Papa.parse(csvData, {
          header: true,
        }) as unknown as ICSVData;
        setCsvData(result);
      })
      .catch((err) => {
        console.error({ err });
      })
      .finally(() => setLoading(false));
  }, []);

  const getColumns = (data: any[]): GridColDef[] => {
    if (data.length === 0) {
      return [];
    }

    return Object.keys(data[0]).map((key) => ({
      field: key,
      headerName: key,
      flex: 1,
      minWidth: 150,
    }));
  };

  useEffect(() => {
    if (csvData) {
      const transformedData: any = (csvData?.data ?? [])
        .map((d: IData) => {
          try {
            const date = parseDate(d['Start Time']);
            if (date === null) {
              throw new Error(`Failed to parse date: ${d['Start Time']}`);
            }
            return {
              date: date,
              Leq: d.Leq,
            };
          } catch (error) {
            console.error(error);
            return null;
          }
        })
        .filter(Boolean); // remove null values

      setTransformedData(transformedData);
      console.log({ o: transformedData[0] });
    }
  }, [csvData]);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex flex-col mx-20">
      {transformedData.length && (
        <LineChart data={transformedData} width={800} height={400} />
      )}
      <DataGrid
        autoHeight
        rows={csvData?.data ?? []}
        columns={getColumns(csvData?.data ?? [])}
        density="compact"
        getRowId={(row) => row.Address}
        scrollbarSize={17}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
      />
    </div>
  );
};

export default D3Visualization;
