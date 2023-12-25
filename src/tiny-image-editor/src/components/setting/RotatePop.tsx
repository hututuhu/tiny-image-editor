/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Popover, Slider } from '@casstime/bricks';
import React, { useState } from 'react';
import { paintConfig } from '../../constants';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (value: number) => void;
}

/** 旋转参数 */
const RotatePop = ({ children, open = false, onChange }: IProps) => {
  const [angel, setAngel] = useState(paintConfig.rotates[0]);

  const handleAngelChange = (value: number | string) => {
    setAngel(+value);
    onChange && onChange(+value);
  };

  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-rotate-pop-content">
    //       <Slider
    //         min={paintConfig.rotates[0]}
    //         max={paintConfig.rotates[paintConfig.rotates.length - 1]}
    //         onChange={handleAngelChange}
    //         value={angel}
    //         marks={paintConfig.rotates}
    //         renderMarks={(v) => <div>{v}°</div>}
    //       />
    //     </div>
    //   }
    //   placement="bottom-end"
    //   open={open}
    // >
    <div>{children}</div>
    // </Popover>
  );
};

export default RotatePop;
