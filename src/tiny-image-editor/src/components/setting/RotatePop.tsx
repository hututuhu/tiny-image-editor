/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useState } from 'react';
import { paintConfig } from '../../constants';
import Popover from './Popover';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (value: number | number[]) => void;
}

/** 旋转参数 */
const RotatePop = ({ children, open = false, onChange }: IProps) => {
  const [angel, setAngel] = useState(paintConfig.rotates[0]);

  const handleAngelChange = (value: number | number[]) => {
    setAngel(+value);
    onChange && onChange(+value);
  };

  return (
    <Popover
      content={
        <div className="tie-image-editor_tool-rotate-pop-content">
          <Slider
            min={paintConfig.rotates[0]}
            max={paintConfig.rotates[paintConfig.rotates.length - 1]}
            onChange={handleAngelChange}
            value={angel}
            marks={paintConfig.rotates.reduce(
              (pre, cur) => ({ ...pre, [cur]: cur + '°' }),
              {},
            )}
          />
        </div>
      }
      placement="bottom-end"
      open={open}
    >
      <div>{children}</div>
    </Popover>
  );
};

export default RotatePop;
