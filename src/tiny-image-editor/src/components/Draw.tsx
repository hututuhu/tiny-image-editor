/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fabric } from 'fabric';
import { useContext, useRef } from 'react';
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';
import React from 'react';

import { IPaintTypes, MENU_TYPE_ENUM, paintConfig } from '../constants';
import { EditorContext } from '../util';
import Paint from './setting/Paint';

export const useDraw = () => {
  const { canvasInstanceRef, currentMenuRef, setCurrentMenu, currentMenu } =
    useContext(EditorContext);
  const paintConfigValue = useRef({
    color: paintConfig.colors[0],
    size: paintConfig.sizes[0],
  });

  const initDraw = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }
    canvas.freeDrawingBrush = new fabric['PencilBrush'](canvas);
    let brush = canvas.freeDrawingBrush;
    brush.color = paintConfigValue.current.color;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
    brush.width = paintConfigValue.current.size;
    brush.shadow = new fabric.Shadow({
      blur: paintConfigValue.current.size,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: '#333',
    });
  };

  const handleDrawTrigger = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }
    if (currentMenuRef.current !== MENU_TYPE_ENUM.draw) {
      canvas.isDrawingMode = true;
      initDraw();
    } else {
      canvas.isDrawingMode = false;
    }

    setCurrentMenu(
      currentMenuRef.current !== MENU_TYPE_ENUM.draw
        ? MENU_TYPE_ENUM.draw
        : MENU_TYPE_ENUM.default,
    );
  };

  const handlePaintChange = (type: IPaintTypes, value: number | string) => {
    if (!canvasInstanceRef.current) {
      return;
    }
    const canvas = canvasInstanceRef.current;
    const activeObject = canvas.getActiveObjects()[0];

    if (type === IPaintTypes.color) {
      paintConfigValue.current.color = value as string;
      activeObject && activeObject.set('fill', value);
    } else {
      paintConfigValue.current.size = value as number;
      activeObject && activeObject.set('width', value);
    }
    canvas.renderAll();
    initDraw();
  };

  return { handleDrawTrigger, handlePaintChange, currentMenu };
};

export const Draw = () => {
  const { handleDrawTrigger, handlePaintChange, currentMenu } = useDraw();
  return (
    <>
      <div
        className={classNames(
          'bre-image-editor_tool-item bre-image-editor_tool-draw',
          {
            ['bre-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.draw,
          },
        )}
      >
        <Paint
          open={currentMenu === MENU_TYPE_ENUM.draw}
          onChange={handlePaintChange}
        >
          {/* <Popover content="画笔" placement="top"> */}
          <i className="bre-image-editor_icon" onClick={handleDrawTrigger} />
          {/* </Popover> */}
        </Paint>
      </div>
    </>
  );
};
