// import { Popover } from '@casstime/bricks';
import React, { useContext, useEffect, useRef } from 'react';

import classNames from 'classnames';
import { MENU_TYPE_ENUM, WORK_SPACE_ID } from '../constants';
import { EditorContext } from '../util';

export const useDrag = () => {
  const {
    canvasInstanceRef,
    wrapperInstanceRef,
    canvasIsRender,
    currentMenu,
    setCurrentMenu,
  } = useContext(EditorContext);

  const dragModeRef = useRef(false);

  useEffect(() => {
    dragModeRef.current = currentMenu === MENU_TYPE_ENUM.drag;
  }, [setCurrentMenu, currentMenu]);

  const _setDring = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.selection = false;
    canvas.defaultCursor = 'grab';
    canvas.getObjects().forEach((obj: any) => {
      obj.selectable = false;
    });
    canvas.requestRenderAll();
  };

  const startDring = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    console.log('startDring');
    setCurrentMenu(MENU_TYPE_ENUM.drag);
    canvas.defaultCursor = 'grab';
    canvas.renderAll();
  };

  const endDring = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    setCurrentMenu(MENU_TYPE_ENUM.default);
    canvas.defaultCursor = 'default';
    canvas.isDragging = false;
    canvas.selection = false;
    canvas.renderAll();
  };

  // 拖拽模式;
  const initDring = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }
    canvas.on('mouse:down', function (this: any, opt: any) {
      const evt = opt.e;
      if (evt.altKey || dragModeRef.current) {
        canvas.defaultCursor = 'grabbing';
        canvas.discardActiveObject();
        _setDring();
        canvas.selection = false;
        canvas.isDragging = true;
        canvas.lastPosX = evt.clientX;
        canvas.lastPosY = evt.clientY;
        canvas.requestRenderAll();
      }
    });

    canvas.on('mouse:move', function (this: any, opt: any) {
      if (canvas.isDragging) {
        canvas.discardActiveObject();
        canvas.defaultCursor = 'grabbing';
        const { e } = opt;
        if (!canvas.viewportTransform) return;
        const vpt = canvas.viewportTransform;
        vpt[4] += e.clientX - canvas.lastPosX;
        vpt[5] += e.clientY - canvas.lastPosY;
        canvas.lastPosX = e.clientX;
        canvas.lastPosY = e.clientY;
        canvas.requestRenderAll();
      }
    });

    canvas.on('mouse:up', function (this: any) {
      if (!canvas.viewportTransform || !dragModeRef.current) return;
      canvas.setViewportTransform(this.viewportTransform);
      canvas.isDragging = false;
      canvas.selection = true;
      canvas.getObjects().forEach((obj: any) => {
        if (obj.id !== WORK_SPACE_ID && obj.hasControls) {
          obj.selectable = true;
        }
      });
      canvas.defaultCursor = 'default';
      canvas.requestRenderAll();
    });
  };

  const handleWrapperKeyDown = (e: any) => {
    /** 空格拖拽功能 */
    const canvas = canvasInstanceRef.current;
    if (e.keyCode === 32 && canvas && !dragModeRef.current) {
      startDring();
    }
    e.preventDefault();
  };

  const handleWrapperKeyUp = (e: any) => {
    /** 结束空格拖拽功能 */
    const canvas = canvasInstanceRef.current;
    if (e.keyCode === 32 && canvas) {
      endDring();
    }
  };

  useEffect(() => {
    if (canvasInstanceRef.current && canvasIsRender) {
      initDring();

      wrapperInstanceRef.current.tabIndex = 1000;
      wrapperInstanceRef.current.addEventListener(
        'keydown',
        handleWrapperKeyDown,
        false,
      );
      wrapperInstanceRef.current.addEventListener(
        'keyup',
        handleWrapperKeyUp,
        false,
      );
    }
    return () => {
      const canvas = canvasInstanceRef.current;
      if (canvas && wrapperInstanceRef.current) {
        wrapperInstanceRef.current?.removeEventListener(
          'keydown',
          handleWrapperKeyDown,
          false,
        );
        wrapperInstanceRef.current?.removeEventListener(
          'keyup',
          handleWrapperKeyUp,
          false,
        );
      }
    };
  }, [canvasInstanceRef, canvasIsRender]);

  const handleMoving = () => {
    setCurrentMenu(
      currentMenu !== MENU_TYPE_ENUM.drag
        ? MENU_TYPE_ENUM.drag
        : MENU_TYPE_ENUM.default,
    );
  };

  return { handleMoving, currentMenu };
};

export const Drag = () => {
  const { handleMoving, currentMenu } = useDrag();
  return (
    <div
      className={classNames(
        'bre-image-editor_tool-item bre-image-editor_tool-hand',
        {
          ['bre-image-editor_tool-item--checked']:
            currentMenu === MENU_TYPE_ENUM.drag,
        },
      )}
    >
      {/* <Popover content="抓取" placement="top"> */}
      <i
        className={classNames('bre-image-editor_icon')}
        onClick={handleMoving}
      />
      {/* </Popover> */}
    </div>
  );
};
