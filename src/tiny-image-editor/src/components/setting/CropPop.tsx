/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'react';
import Popover from './Popover';

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
    <Popover
      content={
        <div className="tie-image-editor_tool-crop-pop">
          <i
            className="tie-image-editor_tool-crop-pop_icon"
            onClick={() => handleAngelChange(true)}
          />
          <i
            className="tie-image-editor_tool-crop-pop_icon"
            onClick={() => handleAngelChange(false)}
          />
        </div>
      }
      placement="bottom"
      open={open}
    >
      <div>{children}</div>
    </Popover>
  );
};

export default CropPop;
