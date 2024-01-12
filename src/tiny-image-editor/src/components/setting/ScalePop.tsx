/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Popover from './Popover';

interface IProps {
  children: React.ReactNode;
  open?: boolean;
  zoom?: number;
  resetText?:string;
  onScaleUp?: () => void;
  onScaleDown?: () => void;
  onReset?: () => void;
  onOpenChange?: (open: boolean) => void;
}

/** 缩放参数 */
const ScalePop = ({
  children,
  open = false,
  zoom = 1,
  resetText="",
  onScaleUp,
  onScaleDown,
  onReset,
  onOpenChange,
}: IProps) => {
  return (
    <Popover
      content={
        <div className="tie-image-editor_tool-scale-pop-content">
          <div className="tie-image-editor_tool-scale-pop-zoom">
            {+(zoom * 100).toFixed(0)}%
          </div>
          <div className="tie-image-editor_tool-scale-pop-icons">
            <div className="tie-image-editor_tool-item tie-image-editor_tool-subtract">
              <i
                className="tie-image-editor_tool-scale-pop-icon tie-image-editor_icon"
                onClick={onScaleDown}
              />
            </div>
            <div className="tie-image-editor_tool-item tie-image-editor_tool-add">
              <i
                className="tie-image-editor_tool-scale-pop-icon tie-image-editor_icon"
                onClick={onScaleUp}
              />
            </div>
          </div>
          <button onClick={onReset}>{resetText}</button>
        </div>
      }
      placement="bottom-end"
      open={open}
      showArrow={false}
      trigger="click"
      // onOpenChange={onOpenChange}
    >
      <div>{children}</div>
    </Popover>
  );
};

export default ScalePop;
