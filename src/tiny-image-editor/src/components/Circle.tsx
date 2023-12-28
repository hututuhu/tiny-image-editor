/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import { fabric } from 'fabric';
import React, { useContext, useEffect, useRef } from 'react';
import { ACTION, IPaintTypes, LANG, MENU_TYPE_ENUM, MENU_TYPE_TEXT, paintConfig } from '../constants';
import { EditorContext } from '../util';
import Paint from './setting/Paint';
import Popover from './setting/Popover';

export const useCircle = () => {
  const {
    canvasInstanceRef,
    currentMenuRef,
    setCurrentMenu,
    canvasIsRender,
    currentMenu,
    historyRef,
  } = useContext(EditorContext);

  const startCircle = useRef(false);
  const circlePoint = useRef({ x: 9, y: 0 });
  const currentCircle = useRef<any>(null);
  const paintConfigValue = useRef({
    color: paintConfig.colors[0],
    size: paintConfig.sizes[0],
  });

  const initCircle = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.on('mouse:down', function (o: any) {
      if (
        canvas.getActiveObject() ||
        currentMenuRef.current !== MENU_TYPE_ENUM.circle
      ) {
        return;
      }

      startCircle.current = true;
      let pointer = canvas.getPointer(o.e);
      circlePoint.current.x = pointer.x;
      circlePoint.current.y = pointer.y;
      currentCircle.current = new fabric.Circle({
        left: circlePoint.current.x,
        top: circlePoint.current.y,
        originX: 'left',
        originY: 'top',
        radius: pointer.x - circlePoint.current.x,
        angle: 0,
        fill: '',
        stroke: paintConfigValue.current.color,
        strokeWidth: paintConfigValue.current.size,
      });
      canvas.add(currentCircle.current);
    });

    canvas.on('mouse:move', function (o: any) {
      if (
        !startCircle.current ||
        currentMenuRef.current !== MENU_TYPE_ENUM.circle
      )
        return;
      let pointer = canvas.getPointer(o.e);
      let radius =
        Math.max(
          Math.abs(circlePoint.current.y - pointer.y),
          Math.abs(circlePoint.current.x - pointer.x),
        ) / 2;
      if (radius > currentCircle.current.strokeWidth) {
        radius -= currentCircle.current.strokeWidth / 2;
      }
      currentCircle.current.set({ radius: radius });

      if (circlePoint.current.x > pointer.x) {
        currentCircle.current.set({ originX: 'right' });
      } else {
        currentCircle.current.set({ originX: 'left' });
      }
      if (circlePoint.current.y > pointer.y) {
        currentCircle.current.set({ originY: 'bottom' });
      } else {
        currentCircle.current.set({ originY: 'top' });
      }
      canvas.renderAll();
    });

    canvas.on('mouse:up', function (o: any) {
      if (
        !currentCircle.current ||
        currentMenuRef.current !== MENU_TYPE_ENUM.circle
      ) {
        return;
      }
      let pointer = canvas.getPointer(o.e);
      if (
        pointer.x === currentCircle.current.left &&
        pointer.y === currentCircle.current.top
      ) {
        /** 无效 */
        canvas.remove(currentCircle.current);
        canvas.requestRenderAll();
        historyRef.current.updateCanvasState(ACTION.add, true, false);
      } else {
        /** 有效 */
        canvas.setActiveObject(currentCircle.current);
        historyRef.current.updateCanvasState(ACTION.add, true, true);
      }

      startCircle.current = false;
      currentCircle.current = null;
    });
  };

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (canvas && canvasIsRender) {
      initCircle();
    }
  }, [canvasInstanceRef, canvasIsRender]);

  const handleDrawCircle = () => {
    setCurrentMenu(
      currentMenuRef.current === MENU_TYPE_ENUM.circle
        ? MENU_TYPE_ENUM.default
        : MENU_TYPE_ENUM.circle,
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

  return { handleDrawCircle, handlePaintChange, currentMenu };
};

/** 圆形 */
export const Circle = () => {
  const {
    lang = LANG.en
  } = useContext(EditorContext);
  const { handleDrawCircle, handlePaintChange, currentMenu } = useCircle();
  return (
    <>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-circle',
          {
            ['tie-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.circle,
          },
        )}
      >
        <Paint
          open={currentMenu === MENU_TYPE_ENUM.circle}
          onChange={handlePaintChange}
        >
          <Popover content={MENU_TYPE_TEXT.circle[lang]} placement="top">
            <i
              className={classNames('tie-image-editor_icon')}
              onClick={handleDrawCircle}
            />
          </Popover>
        </Paint>
      </div>
    </>
  );
};
