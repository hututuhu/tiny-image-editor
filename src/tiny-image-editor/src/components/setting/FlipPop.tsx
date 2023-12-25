/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Popover } from '@casstime/bricks';
import React, { useState } from 'react';
import { FLIP_TYPE } from '../../constants';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  onChange?: (type: FLIP_TYPE, value: boolean) => void;
}

/** 旋转参数 */
const FlipPop = ({ children, open = false, onChange }: IProps) => {
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const handleAngelChange = (type: FLIP_TYPE, value: boolean) => {
    if (type === FLIP_TYPE.flipX) {
      setFlipX(value);
    } else {
      setFlipY(value);
    }
    onChange && onChange(type, value);
  };

  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-flip-pop">
    //       <div
    //         className="bre-image-editor_tool-item bre-image-editor_tool-flipX"
    //         onClick={() => handleAngelChange(FLIP_TYPE.flipX, !flipX)}
    //       >
    //         <i className="bre-image-editor_icon" />
    //       </div>
    //       <div
    //         className="bre-image-editor_tool-item bre-image-editor_tool-flipY"
    //         onClick={() => handleAngelChange(FLIP_TYPE.flipY, !flipY)}
    //       >
    //         <i className="bre-image-editor_icon" />
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

export default FlipPop;
