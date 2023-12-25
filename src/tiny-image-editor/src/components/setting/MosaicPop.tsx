/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Popover } from '@casstime/bricks';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (value: number) => void;
}

/** 马赛克参数 */
const MosaicPop = ({ children, open = false, onChange }: IProps) => {
  const handleSizeChange = (value: number) => {
    onChange && onChange(value);
  };

  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-crop-pop">
    //       <div className="bre-image-editor_tool-paint-size-wrapper">
    //         {paintConfig.mosaicSizes.map((size, index) => (
    //           <div
    //             onClick={() => handleSizeChange(size)}
    //             key={size}
    //             className="bre-image-editor_tool-paint-size"
    //             style={{ width: 10 + index * 5, height: 10 + index * 5 }}
    //           ></div>
    //         ))}
    //       </div>
    //     </div>
    //   }
    //   placement="bottom"
    //   open={open}
    // >
    <div>{children}</div>
    // </Popover>
  );
};

export default MosaicPop;
