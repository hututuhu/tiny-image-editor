import { useContext, useEffect } from 'react';
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';
import React from 'react';

import { ACTION, FLIP_TYPE, MENU_TYPE_ENUM } from '../constants';
import { EditorContext } from '../util';
import FlipPop from './setting/FlipPop';

export const useFlip = () => {
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

  const handleFlipTrigger = () => {
    setCurrentMenu(
      currentMenuRef.current !== MENU_TYPE_ENUM.flip
        ? MENU_TYPE_ENUM.flip
        : MENU_TYPE_ENUM.default,
    );
  };

  const handleFlipChange = (type: FLIP_TYPE, value: boolean) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    /** 针对底图翻转的原理是将图标先旋转相反角度，再重新计算坐标，最后翻转 */
    canvas.getObjects().forEach((obj: any) => {
      obj.originalPoint = obj.originalPoint || { left: obj.left, top: obj.top };

      let options = {
        [type]: value,
      };

      if (type === FLIP_TYPE.flipX) {
        if (value) {
          options = {
            ...options,
            left: canvas.width - obj.originalPoint.left - obj.width,
          } as any;
        } else {
          options = { ...options, left: obj.originalPoint.left } as any;
        }
      } else {
        if (value) {
          options = {
            ...options,
            top: canvas.height - obj.originalPoint.top - obj.height,
          } as any;
        } else {
          options = { ...options, top: obj.originalPoint.top } as any;
        }
      }

      obj
        .set(options)
        .rotate(parseFloat((obj.angle * -1).toString()))
        .setCoords();
    });

    const canvasImage = canvas.backgroundImage;
    let { angle } = canvasImage;

    if (value) {
      angle *= -1;
    }

    canvasImage.set({ [type]: value });
    canvasImage.rotate(parseFloat(angle)).setCoords(); // parseFloat for -0 to 0
    canvasImage.setCoords();
    canvas.renderAll();
    historyRef.current.updateCanvasState(ACTION.add);
  };

  return { handleFlipTrigger, handleFlipChange, currentMenu };
};

export const Flip = () => {
  const { handleFlipTrigger, handleFlipChange, currentMenu } = useFlip();
  return (
    <>
      <div
        className={classNames(
          'bre-image-editor_tool-item bre-image-editor_tool-flip',
          {
            ['bre-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.flip,
          },
        )}
      >
        <FlipPop
          open={currentMenu === MENU_TYPE_ENUM.flip}
          onChange={handleFlipChange}
        >
          {/* <Popover content="翻转" placement="top"> */}
          <i className="bre-image-editor_icon" onClick={handleFlipTrigger} />
          {/* </Popover> */}
        </FlipPop>
      </div>
    </>
  );
};
