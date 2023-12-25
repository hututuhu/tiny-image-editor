/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Popover } from '@casstime/bricks';
import React from 'react';
import { IPaintTypes, MENU_TYPE_ENUM } from '../../constants';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (type: IPaintTypes, value: number | string) => void;
  type?: MENU_TYPE_ENUM;
}

const Paint = ({ children, open = false, type, onChange }: IProps) => {
  const handleChange = (type: IPaintTypes, value: number | string) => {
    onChange && onChange(type, value);
  };

  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-paint-content">
    //       <div className="bre-image-editor_tool-paint-size-wrapper">
    //         {(type === MENU_TYPE_ENUM.text ? paintConfig.fontSizes : paintConfig.sizes).map((size, index) => (
    //           <div
    //             onClick={() => handleChange(IPaintTypes.size, size)}
    //             key={size}
    //             className="bre-image-editor_tool-paint-size"
    //             style={{ width: 10 + index * 5, height: 10 + index * 5 }}
    //           ></div>
    //         ))}
    //       </div>
    //       <div className="bre-image-editor_tool-paint-color-wrapper">
    //         {paintConfig.colors.map((color) => (
    //           <div
    //             onClick={() => handleChange(IPaintTypes.color, color)}
    //             key={color}
    //             className="bre-image-editor_tool-paint-color"
    //             style={{ background: color }}
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

export default Paint;
