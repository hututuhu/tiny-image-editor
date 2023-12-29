/* eslint-disable @typescript-eslint/no-unused-vars */
import { fabric } from 'fabric';
import React, { useCallback, useContext, useEffect } from 'react';
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';

import { LANG, MENU_TYPE_ENUM, MENU_TYPE_TEXT } from '../constants';
import { EditorContext } from '../util';
import Popover from './setting/Popover';
import ScalePop from './setting/ScalePop';

export const useScale = () => {
  const {
    canvasInstanceRef,
    canvasIsRender,
    currentMenu,
    currentMenuRef,
    zoom,
    setZoom,
    setCurrentMenu,
  } = useContext(EditorContext);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (canvas && canvasIsRender) {
      canvas.on('mouse:wheel', function (opt: any) {
        const delta = opt.e.deltaY;
        let newZoom: number = canvas.getZoom();
        newZoom *= 0.999 ** delta;
        if (newZoom > 20) newZoom = 20;
        if (newZoom < 0.01) newZoom = 0.01;
        setZoom(newZoom);
        // const center = canvas.getCenter();
        // canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
        canvas.requestRenderAll();
        opt.e.preventDefault();
        opt.e.stopPropagation();
      });
    }
  }, [canvasInstanceRef, canvasIsRender]);

  useEffect(() => {
    const canvas = canvasInstanceRef.current;

    if (!canvas) {
      return;
    }

    const center = canvas.getCenter();
    canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoom < 0 ? 0.01 : zoom,
    );

    if (currentMenuRef.current !== MENU_TYPE_ENUM.scale) {
      setCurrentMenu(MENU_TYPE_ENUM.scale);
    }
  }, [zoom]);

  /** 放大 */
  const handleScaleUp = () => {
    if (!canvasInstanceRef.current) {
      return;
    }

    const canvas = canvasInstanceRef.current;
    let zoomRatio = canvas.getZoom();
    zoomRatio += 0.05;
    setZoom(zoomRatio);
    // const center = canvas.getCenter();
    // canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  };
  /** 缩小 */
  const handleScaleDown = () => {
    if (!canvasInstanceRef.current) {
      return;
    }

    const canvas = canvasInstanceRef.current;
    let zoomRatio = canvas.getZoom();
    zoomRatio -= 0.05;
    setZoom(zoomRatio);
    // const center = canvas.getCenter();
    // canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio < 0 ? 0.01 : zoomRatio);
  };

  const handleScaleTrigger = () => {
    setCurrentMenu(
      currentMenuRef.current === MENU_TYPE_ENUM.scale
        ? MENU_TYPE_ENUM.default
        : MENU_TYPE_ENUM.scale,
    );
  };

  const handleReset = () => {
    setZoom(1);
  };

  const handleOpenChange = useCallback((open: boolean) => {
    setCurrentMenu(!open ? MENU_TYPE_ENUM.default : MENU_TYPE_ENUM.scale);
  }, []);

  return {
    zoom,
    handleScaleUp,
    handleScaleDown,
    handleScaleTrigger,
    handleReset,
    handleOpenChange,
  };
};

export const Scale = () => {
  const { lang = LANG.en, currentMenu } = useContext(EditorContext);
  const {
    zoom,
    handleScaleDown,
    handleScaleUp,
    handleScaleTrigger,
    handleReset,
    handleOpenChange,
  } = useScale();
  return (
    <>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-zoomIn',
          {
            ['tie-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.scale,
          },
        )}
      >
        <ScalePop
          open={currentMenu === MENU_TYPE_ENUM.scale}
          zoom={zoom}
          onScaleDown={handleScaleDown}
          onScaleUp={handleScaleUp}
          onReset={handleReset}
          onOpenChange={handleOpenChange}
        >
          <Popover content={MENU_TYPE_TEXT.scale[lang]} placement="top">
            <i
              className={classNames('tie-image-editor_icon')}
              // onClick={handleScaleTrigger}
            />
          </Popover>
        </ScalePop>
      </div>
    </>
  );
};
