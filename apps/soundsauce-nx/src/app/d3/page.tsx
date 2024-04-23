'use client';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LineChart from './charts/LineChart';
import parseDate from '../../utils/parseDate';
import { ICSVData, IData, IGraphData } from '../types';

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
    }
  }, [csvData]);

  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="flex">
      {transformedData.length && (
        <LineChart
          data={transformedData.splice(0, 800)}
          width={1024}
          height={height - 200}
        />
      )}
      {/* <DataGrid
        autoHeight
        rows={csvData?.data ?? []}
        columns={getColumns(csvData?.data ?? [])}
        density="compact"
        getRowId={(row) => row.Address}
        scrollbarSize={17}
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
      /> */}
    </div>
  );
};

export default D3Visualization;
