import { useContext, useEffect } from 'react';
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';
import { fabric } from 'fabric';
import React from 'react';

import { ACTION, MENU_TYPE_ENUM } from '../constants';
import { EditorContext } from '../util';
import RotatePop from './setting/RotatePop';

export const useRotate = () => {
  const {
    canvasInstanceRef,
    currentMenuRef,
    setCurrentMenu,
    canvasIsRender,
    currentMenu,
    historyRef,
  } = useContext(EditorContext);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !canvasIsRender) {
      return;
    }
  }, [canvasIsRender]);

  const handleRotateTrigger = () => {
    setCurrentMenu(
      currentMenuRef.current !== MENU_TYPE_ENUM.rotate
        ? MENU_TYPE_ENUM.rotate
        : MENU_TYPE_ENUM.default,
    );
  };

  const handleRotateChange = (value: number) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.getObjects().forEach((obj: any) => {
      /** 记录第一次形状的位置，方便计算相对位置 */
      obj.originalPoint =
        obj.originalPoint || new fabric.Point(obj.left, obj.top);
      let posNewCenter = fabric.util.rotatePoint(
        obj.originalPoint,
        canvas.getVpCenter(),
        fabric.util.degreesToRadians(value),
      );

      obj.set({
        left: posNewCenter.x,
        top: posNewCenter.y,
        angle: value,
      });
    });

    /** 单独对背景图进行旋转 */
    const canvasImage = canvas.backgroundImage;
    canvasImage.rotate(value);
    canvasImage.setCoords();
    canvas.requestRenderAll();
    historyRef.current.updateCanvasState(ACTION.add);
  };

  return { handleRotateTrigger, handleRotateChange, currentMenu };
};

export const Rotate = () => {
  const { handleRotateTrigger, handleRotateChange, currentMenu } = useRotate();
  return (
    <>
      <div
        className={classNames(
          'bre-image-editor_tool-item bre-image-editor_tool-rotate',
          {
            ['bre-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.rotate,
          },
        )}
      >
        <RotatePop
          open={currentMenu === MENU_TYPE_ENUM.rotate}
          onChange={handleRotateChange}
        >
          {/* <Popover content="旋转" placement="top"> */}
          <i className="bre-image-editor_icon" onClick={handleRotateTrigger} />
          {/* </Popover> */}
        </RotatePop>
      </div>
    </>
  );
};
