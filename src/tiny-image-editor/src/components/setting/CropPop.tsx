/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Icon, Popover } from '@casstime/bricks';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (value: boolean) => void;
}

/** 旋转参数 */
const CropPop = ({ children, open = false, onChange }: IProps) => {
  const handleAngelChange = (value: boolean) => {
    onChange && onChange(value);
  };

  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-crop-pop">
    //       <Icon
    //         type="check-round"
    //         className="bre-image-editor_tool-crop-pop_icon"
    //         onClick={() => handleAngelChange(true)}
    //       />
    //       <Icon type="close" className="bre-image-editor_tool-crop-pop_icon" onClick={() => handleAngelChange(false)} />
    //     </div>
    //   }
    //   placement="bottom"
    //   open={open}
    // >
    <div>{children}</div>
    // </Popover>
  );
};

export default CropPop;
