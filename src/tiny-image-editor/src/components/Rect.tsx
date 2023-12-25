/* eslint-disable @typescript-eslint/no-unused-expressions */
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';
import { fabric } from 'fabric';
import React, { useContext, useEffect, useRef } from 'react';

import { ACTION, IPaintTypes, MENU_TYPE_ENUM, paintConfig } from '../constants';
import { EditorContext } from '../util';
import Paint from './setting/Paint';

export const useRect = () => {
  const {
    canvasInstanceRef,
    currentMenuRef,
    canvasIsRender,
    currentMenu,
    historyRef,
    setCurrentMenu,
  } = useContext(EditorContext);

  const startRect = useRef(false);
  const rectPoint = useRef({ x: 9, y: 0 });
  const currentRect = useRef<any>(null);
  const paintConfigValue = useRef({
    color: paintConfig.colors[0],
    size: paintConfig.sizes[0],
  });

  /** 初始化矩形 */
  const initRect = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.on('mouse:down', function (o: any) {
      if (
        canvas.getActiveObject() ||
        currentMenuRef.current !== MENU_TYPE_ENUM.rect
      ) {
        return false;
      }

      startRect.current = true;
      let pointer = canvas.getPointer(o.e);
      rectPoint.current.x = pointer.x;
      rectPoint.current.y = pointer.y;

      currentRect.current = new fabric.Rect({
        left: rectPoint.current.x,
        top: rectPoint.current.y,
        originX: 'left',
        originY: 'top',
        width: pointer.x - rectPoint.current.x,
        height: pointer.y - rectPoint.current.y,
        angle: 0,
        fill: 'rgba(255,0,0,0)',
        stroke: paintConfigValue.current.color,
        strokeWidth: paintConfigValue.current.size,
        transparentCorners: false,
      });
      canvas.add(currentRect.current);
    });

    canvas.on('mouse:move', function (o: any) {
      if (
        !startRect.current ||
        !currentRect.current ||
        currentMenuRef.current !== MENU_TYPE_ENUM.rect
      ) {
        return;
      }

      let pointer = canvas.getPointer(o.e);

      if (rectPoint.current.x > pointer.x) {
        currentRect.current.set({ left: Math.abs(pointer.x) });
      }
      if (rectPoint.current.y > pointer.y) {
        currentRect.current.set({ top: Math.abs(pointer.y) });
      }

      currentRect.current.set({
        width: Math.abs(rectPoint.current.x - pointer.x),
      });
      currentRect.current.set({
        height: Math.abs(rectPoint.current.y - pointer.y),
      });

      canvas.renderAll();
    });

    canvas.on('mouse:up', function (o: any) {
      if (
        !currentRect.current ||
        currentMenuRef.current !== MENU_TYPE_ENUM.rect
      ) {
        return;
      }

      let pointer = canvas.getPointer(o.e);
      if (
        pointer.x === currentRect.current.left &&
        pointer.y === currentRect.current.top
      ) {
        /** 无效矩形 */
        canvas.remove(currentRect.current);
        canvas.requestRenderAll();
        historyRef.current.updateCanvasState(ACTION.add, true, false);
      } else {
        /** 有效矩形 */
        canvas.setActiveObject(currentRect.current);
        historyRef.current.updateCanvasState(ACTION.add, true, true);
      }

      startRect.current = false;
      currentRect.current = null;
    });
  };

  useEffect(() => {
    if (canvasInstanceRef.current && canvasIsRender) {
      initRect();
    }
  }, [canvasInstanceRef, canvasIsRender]);

  const handleDrawRect = () => {
    setCurrentMenu(
      currentMenuRef.current === MENU_TYPE_ENUM.rect
        ? MENU_TYPE_ENUM.default
        : MENU_TYPE_ENUM.rect,
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
      activeObject && activeObject.set('stroke', value);
    } else {
      paintConfigValue.current.size = value as number;
      activeObject && activeObject.set('strokeWidth', value);
    }

    canvas.renderAll();
  };

  return { handleDrawRect, handlePaintChange, currentMenu };
};

export const Rect = () => {
  const { handleDrawRect, handlePaintChange, currentMenu } = useRect();
  return (
    <>
      <div
        className={classNames(
          'bre-image-editor_tool-item bre-image-editor_tool-rect',
          {
            ['bre-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.rect,
          },
        )}
      >
        <Paint
          open={currentMenu === MENU_TYPE_ENUM.rect}
          onChange={handlePaintChange}
        >
          {/* <Popover content="矩形" placement="top"> */}
          <i
            className={classNames('bre-image-editor_icon')}
            onClick={handleDrawRect}
          />
          {/* </Popover> */}
        </Paint>
      </div>
    </>
  );
};
