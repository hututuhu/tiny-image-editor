import classNames from 'classnames';
import React, { useCallback, useContext, useEffect, useRef } from 'react';

import { fabric } from 'fabric';
import { LANG, MENU_TYPE_ENUM, MENU_TYPE_TEXT, paintConfig } from '../constants';
import { EditorContext } from '../util';
import MosaicPop from './setting/MosaicPop';
import Popover from './setting/Popover';

let blockSize = paintConfig.mosaicSizes[0];

const mosaicify = (imageData: any) => {
  const { data } = imageData;
  const iLen = imageData.height;
  const jLen = imageData.width;
  let index;
  let i;
  let j;
  let r;
  let g;
  let b;
  let a;
  let _i;
  let _j;
  let _iLen;
  let _jLen;
  for (i = 0; i < iLen; i += blockSize) {
    for (j = 0; j < jLen; j += blockSize) {
      index = i * 4 * jLen + j * 4;
      r = data[index];
      g = data[index + 1];
      b = data[index + 2];
      a = data[index + 3];

      _iLen = Math.min(i + blockSize, iLen);
      _jLen = Math.min(j + blockSize, jLen);
      for (_i = i; _i < _iLen; _i++) {
        for (_j = j; _j < _jLen; _j++) {
          index = _i * 4 * jLen + _j * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
          data[index + 3] = a;
          /*
          data[index] = 0;
          data[index + 1] = 0;
          data[index + 2] = 0;
          */
        }
      }
    }
  }
};

const useMosaic = () => {
  const {
    canvasInstanceRef,
    canvasIsRender,
    currentMenu,
    currentMenuRef,
    setCurrentMenu,
  } = useContext(EditorContext);
  const mosaicBrush = useRef<any>(null);

  const initMosaic = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    mosaicBrush.current = new fabric.PatternBrush(canvas);
    mosaicBrush.current.getPatternSrc = function () {
      // 创立一个暂存 canvas 来绘製要画的图案
      const cropping = {
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height,
      };
      const imageCanvas = canvas.toCanvasElement(1, cropping);
      const imageCtx = imageCanvas.getContext('2d');
      const imageData = imageCtx.getImageData(
        0,
        0,
        imageCanvas.width,
        imageCanvas.height,
      );
      mosaicify(imageData);
      imageCtx.putImageData(imageData, 0, 0);

      const patternCanvas = (fabric as any).document.createElement('canvas'); // 这里的ceateElement一定要使用fabric内置的方法
      const patternCtx = patternCanvas.getContext('2d');
      patternCanvas.width = canvas.width || 0;
      patternCanvas.height = canvas.height || 0;
      patternCtx.drawImage(
        imageCanvas,
        0,
        0,
        imageCanvas.width,
        imageCanvas.height,
        cropping.left,
        cropping.top,
        cropping.width,
        cropping.height,
      );
      return patternCanvas;
    };
  }, []);

  useEffect(() => {
    if (canvasIsRender) {
      initMosaic();
    }
  }, [canvasIsRender]);

  const handleMosaicTrigger = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    if (currentMenuRef.current !== MENU_TYPE_ENUM.mosaic) {
      /** 启动马赛克 */
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = mosaicBrush.current;
      let brush = canvas.freeDrawingBrush;
      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
      brush.width = 30;
      brush.shadow = new fabric.Shadow({
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
      });
    } else {
      canvas.isDrawingMode = false;
    }
    setCurrentMenu(
      currentMenuRef.current === MENU_TYPE_ENUM.mosaic
        ? MENU_TYPE_ENUM.default
        : MENU_TYPE_ENUM.mosaic,
    );
  }, [initMosaic]);

  const handleSizeChange = (size: number) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    blockSize = size;
    let brush = canvas.freeDrawingBrush;
    if (brush.getPatternSrc) {
      brush.source = brush.getPatternSrc.call(brush);
    }
  };
  return { currentMenu, handleMosaicTrigger, handleSizeChange };
};

/**
 * 马赛克
 */
const Mosaic = () => {
  const {
    lang = LANG.en
  } = useContext(EditorContext);
  const { currentMenu, handleMosaicTrigger, handleSizeChange } = useMosaic();
  return (
    <>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-mosaic',
          {
            ['tie-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.mosaic,
          },
        )}
      >
        <MosaicPop
          open={currentMenu === MENU_TYPE_ENUM.mosaic}
          onChange={handleSizeChange}
        >
          <Popover content={MENU_TYPE_TEXT.mosaic[lang]} placement="top">
            <i
              className="tie-image-editor_icon"
              onClick={handleMosaicTrigger}
            />
          </Popover>
        </MosaicPop>
      </div>
    </>
  );
};

export default Mosaic;
