/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import React, { useContext, useEffect, useRef } from 'react';

import {
  ACTION,
  CURSOR,
  IPaintTypes,
  LANG,
  MENU_TYPE_ENUM,
  MENU_TYPE_TEXT,
  paintConfig,
} from '../constants';
import { EditorContext } from '../util';
import Paint from './setting/Paint';
import Popover from './setting/Popover';

import ArrowClass from '../helpers/Arrow';

export const useArrow = () => {
  const {
    currentMenu,
    setCurrentMenu,
    canvasInstanceRef,
    canvasIsRender,
    currentMenuRef,
    historyRef,
  } = useContext(EditorContext);

  const isDrawingLine = useRef(false);
  const pointer = useRef({ x: 0, y: 0 });
  const pointerPoints = useRef<number[]>([]);
  const lineToDraw = useRef(null);
  const paintConfigValue = useRef({
    color: paintConfig.colors[0],
    size: paintConfig.sizes[0],
  });

  const initArrow = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.on('mouse:down', (o: any) => {
      if (
        canvas.getActiveObject() ||
        currentMenuRef.current !== MENU_TYPE_ENUM.arrow
      ) {
        return;
      }

      canvas.discardActiveObject();
      canvas.getObjects().forEach((obj: any) => {
        obj.selectable = false;
        obj.hasControls = false;
      });

      canvas.requestRenderAll();
      isDrawingLine.current = true;
      pointer.current = canvas.getPointer(o.e);
      pointerPoints.current = [
        pointer.current.x,
        pointer.current.y,
        pointer.current.x,
        pointer.current.y,
      ];

      const lineToDrawNew = new ArrowClass(pointerPoints.current, {
        strokeWidth: paintConfigValue.current.size,
        stroke: paintConfigValue.current.color,
        id: new Date().valueOf() + '_' + Math.random() * 4,
      });

      // lineToDrawNew.selectable = false;
      // lineToDrawNew.evented = false;
      lineToDrawNew.strokeUniform = true;
      lineToDraw.current = lineToDrawNew;
      canvas.add(lineToDrawNew);
    });

    canvas.on('mouse:move', (o: any) => {
      if (
        !canvas.getActiveObject() &&
        currentMenuRef.current === MENU_TYPE_ENUM.rect
      ) {
        canvas.setCursor(CURSOR.crosshair);
      }

      if (
        canvas.getActiveObject() ||
        currentMenuRef.current !== MENU_TYPE_ENUM.arrow ||
        !isDrawingLine.current ||
        !lineToDraw.current
      ) {
        canvas.renderAll();
        return;
      }

      pointer.current = canvas.getPointer(o.e);

      if (o.e.shiftKey) {
        // calc angle
        const startX = pointerPoints.current[0];
        const startY = pointerPoints.current[1];
        const x2 = pointer.current.x - startX;
        const y2 = pointer.current.y - startY;
        const r = Math.sqrt(x2 * x2 + y2 * y2);
        let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
        angle = parseInt('' + ((angle + 7.5) % 360) / 15) * 15;

        const cosx = r * Math.cos((angle * Math.PI) / 180);
        const sinx = r * Math.sin((angle * Math.PI) / 180);

        (lineToDraw.current as any).set({
          x2: cosx + startX,
          y2: sinx + startY,
        });
      } else {
        if (!lineToDraw.current) {
          return;
        }

        (lineToDraw.current as any).set({
          x2: pointer.current.x,
          y2: pointer.current.y,
        });
      }

      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      if (
        currentMenuRef.current !== MENU_TYPE_ENUM.arrow ||
        !lineToDraw.current ||
        !isDrawingLine.current
      )
        return;
      (lineToDraw.current as any).setCoords();
      isDrawingLine.current = false;
      // canvas.discardActiveObject();

      if (
        pointer.current.x === pointerPoints.current[0] &&
        pointer.current.y === pointerPoints.current[1]
      ) {
        /** 无效矩形 */
        canvas.remove(lineToDraw.current);
        canvas.requestRenderAll();
        historyRef.current.updateCanvasState(ACTION.add, true, false);
      } else {
        /** 有效矩形 */
        canvas.setActiveObject(lineToDraw.current);
        historyRef.current.updateCanvasState(ACTION.add, true, true);
      }
    });
  };

  useEffect(() => {
    if (canvasInstanceRef.current && canvasIsRender) {
      initArrow();
    }
  }, [canvasInstanceRef, canvasIsRender]);

  const handleArrowTrigger = () => {
    setCurrentMenu(
      currentMenu === MENU_TYPE_ENUM.arrow
        ? MENU_TYPE_ENUM.default
        : MENU_TYPE_ENUM.arrow,
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

  return { handleArrowTrigger, handlePaintChange, currentMenu };
};

/** 箭头 */
export const Arrow = () => {
  const { lang = LANG.en } = useContext(EditorContext);
  const { handleArrowTrigger, handlePaintChange, currentMenu } = useArrow();
  return (
    <div
      className={classNames(
        'tie-image-editor_tool-item tie-image-editor_tool-arrow',
        {
          ['tie-image-editor_tool-item--checked']:
            currentMenu === MENU_TYPE_ENUM.arrow,
        },
      )}
    >
      <Paint
        open={currentMenu === MENU_TYPE_ENUM.arrow}
        onChange={handlePaintChange}
      >
        <Popover content={MENU_TYPE_TEXT.arrow[lang]} placement="top">
          <i
            className={classNames('tie-image-editor_icon')}
            onClick={handleArrowTrigger}
          />
        </Popover>
      </Paint>
    </div>
  );
};
