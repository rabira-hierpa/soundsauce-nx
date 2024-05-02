import React, { Dispatch, SetStateAction } from 'react';
import { TimeInterval } from '../../../types/time-interval';
import clsx from 'clsx';

type ITimeIntervalProps = {
  timeInterval: TimeInterval;
  setTimeInterval: (
    interval: TimeInterval
  ) => Dispatch<SetStateAction<TimeInterval>>;
};

const TimeIntervals = [
  {
    value: TimeInterval.TEN_MINUTES,
    label: '10 Minutes',
  },
  {
    value: TimeInterval.FIFTEEN_MINUTES,
    label: '15 Minutes',
  },
  {
    value: TimeInterval.THIRTY_MINUTES,
    label: '30 Minutes',
  },
  {
    value: TimeInterval.ONE_HOUR,
    label: '1 Hour',
  },
];

const TimeIntervalGroup: React.FC<ITimeIntervalProps> = ({
  timeInterval,
  setTimeInterval,
}) => {
  return (
    <div className="flex flex-wrap justify-center p-5 space-5">
      {TimeIntervals.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setTimeInterval(value)}
          className={clsx(
            'button m-2',
            timeInterval === value ? 'bg-blue-700' : 'bg-blue-500'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default TimeIntervalGroup;
