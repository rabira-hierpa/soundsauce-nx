import React, { Dispatch, SetStateAction } from 'react';
import { PeriodData } from '../../../types/period-types';
import { Checkbox, FormControlLabel } from '@mui/material';

type ILineValuesProps = {
  availableMeasurements: (keyof PeriodData)[];
  selectedMeasurements: (keyof PeriodData)[];
  setSelectedMeasurements: Dispatch<SetStateAction<(keyof PeriodData)[]>>;
};

const MeasurementValues: React.FC<ILineValuesProps> = ({
  selectedMeasurements,
  availableMeasurements,
  setSelectedMeasurements,
}) => {
  return (
    <div>
      <p className="text-xl font-semibold">Measurements</p>
      {availableMeasurements.map((measurement, index) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={selectedMeasurements.includes(measurement)}
              onChange={() => {
                if (selectedMeasurements.includes(measurement)) {
                  setSelectedMeasurements(
                    selectedMeasurements.filter((m) => m !== measurement)
                  );
                } else {
                  setSelectedMeasurements([
                    ...selectedMeasurements,
                    measurement,
                  ]);
                }
              }}
              name={measurement}
            />
          }
          label={measurement}
          key={index}
        />
      ))}
    </div>
  );
};

export default MeasurementValues;
