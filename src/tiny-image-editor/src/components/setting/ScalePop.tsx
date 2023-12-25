/* eslint-disable @typescript-eslint/no-unused-vars */
// import { Button, Icon, Popover } from '@casstime/bricks';
import React from 'react';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  zoom?: number;
  onScaleUp?: () => void;
  onScaleDown?: () => void;
  onReset?: () => void;
}

/** 缩放参数 */
const ScalePop = ({
  children,
  open = false,
  zoom = 1,
  onScaleUp,
  onScaleDown,
  onReset,
}: IProps) => {
  return (
    // <Popover
    //   content={
    //     <div className="bre-image-editor_tool-scale-pop-content">
    //       <div className="bre-image-editor_tool-scale-pop-zoom">{+(zoom * 100).toFixed(0)}%</div>
    //       <div className="bre-image-editor_tool-scale-pop-icons">
    //         <Icon type="subtract" className="bre-image-editor_tool-scale-pop-icon" onClick={onScaleDown} />
    //         <Icon type="add" className="bre-image-editor_tool-scale-pop-icon" onClick={onScaleUp} />
    //       </div>
    //       <Button round outline onClick={onReset}>
    //         重置
    //       </Button>
    //     </div>
    //   }
    //   placement="bottom-end"
    //   open={open}
    //   showArrow={false}
    // >
    <div>{children}</div>
    // </Popover>
  );
};

export default ScalePop;
