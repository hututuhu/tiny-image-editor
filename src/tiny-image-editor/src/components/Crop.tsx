import { useCallback, useContext, useEffect, useRef } from 'react';
// import { Popover, Toast } from '@casstime/bricks';
import classNames from 'classnames';
import { fabric } from 'fabric';
import React from 'react';

import {
  ACTION,
  IMAGE_NAME,
  MENU_TYPE_ENUM,
  WORK_SPACE_ID,
  keyCodes,
} from '../constants';
import Cropzone from '../helpers/CropZone';
import { EditorContext, clamp } from '../util';
import CropPop from './setting/CropPop';

const MOUSE_MOVE_THRESHOLD = 10;

export const useCrop = () => {
  const {
    canvasInstanceRef,
    currentMenuRef,
    setCurrentMenu,
    canvasIsRender,
    currentMenu,
    wrapperInstanceRef,
    historyRef,
    unSaveHistory,
  } = useContext(EditorContext);

  /** 裁剪框实例 */
  const cropzone = useRef<any>(null);
  /** 裁剪开始X */
  const startX = useRef(0);
  /** 裁剪开始Y */
  const startY = useRef(0);
  /** 是否有ShiftKey */
  const withShiftKey = useRef(false);

  /** 计算裁剪框坐标 */
  const calcRectDimensionFromPoint = useCallback(
    (x: number, y: number, presetRatio = null) => {
      const canvas = canvasInstanceRef.current;
      if (!canvas) {
        return;
      }
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const startXNew = startX.current;
      const startYNew = startY.current;
      let left = clamp(x, 0, startXNew);
      let top = clamp(y, 0, startYNew);
      let width = clamp(x, startXNew, canvasWidth) - left; // 开始坐标小于鼠标坐标小于画布坐标
      let height = clamp(y, startYNew, canvasHeight) - top; //

      if (withShiftKey.current && !presetRatio) {
        if (width > height) {
          height = width;
        } else if (height > width) {
          width = height;
        }

        if (startXNew >= x) {
          left = startXNew - width;
        }

        if (startYNew >= y) {
          top = startYNew - height;
        }
      } else if (presetRatio) {
        height = width / presetRatio;

        if (startXNew >= x) {
          left = clamp(startXNew - width, 0, canvasWidth);
        }

        if (startYNew >= y) {
          top = clamp(startYNew - height, 0, canvasHeight);
        }

        if (top + height > canvasHeight) {
          height = canvasHeight - top;
          width = height * presetRatio;

          if (startXNew >= x) {
            left = clamp(startXNew - width, 0, canvasWidth);
          }

          if (startYNew >= y) {
            top = clamp(startYNew - height, 0, canvasHeight);
          }
        }
      }

      return {
        left,
        top,
        width,
        height,
      };
    },
    [],
  );

  const keydown = useCallback((e: any) => {
    if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
      return;
    }

    if (e.keyCode === keyCodes.SHIFT) {
      withShiftKey.current = true;
    }
  }, []);

  const keyup = useCallback((e: any) => {
    if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
      return;
    }

    if (e.keyCode === keyCodes.SHIFT) {
      withShiftKey.current = false;
    }
  }, []);

  const mousemove = useCallback(
    (fEvent: any) => {
      const canvas = canvasInstanceRef.current;
      if (!canvas) {
        return;
      }

      if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
        return;
      }

      const pointer = canvas.getPointer(fEvent.e);
      const { x, y } = pointer;
      const cropzoneNew = cropzone.current;

      if (!cropzoneNew) {
        return;
      }

      if (
        Math.abs(x - startX.current) + Math.abs(y - startY.current) >
        MOUSE_MOVE_THRESHOLD
      ) {
        canvas.remove(cropzoneNew);
        cropzoneNew.set(
          calcRectDimensionFromPoint(x, y, cropzoneNew.presetRatio),
        );
        canvas.add(cropzoneNew);
        canvas.setActiveObject(cropzoneNew);
      }
    },
    [canvasIsRender],
  );
  const mouseup = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
      return;
    }

    const cropzoneNew = cropzone.current;

    canvas.setActiveObject(cropzoneNew);

    canvas.off('mouse:move', mousemove);
    canvas.off('mouse:up', mouseup);
  }, [canvasIsRender]);

  const mousedown = useCallback(
    (fEvent: any) => {
      if (fEvent.target) {
        return;
      }

      const canvas = canvasInstanceRef.current;
      if (!canvas) {
        return;
      }

      if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
        return;
      }

      canvas.selection = false;
      const coord = canvas.getPointer(fEvent.e);

      startX.current = coord.x;
      startY.current = coord.y;

      canvas.on('mouse:move', mousemove);
      canvas.on('mouse:up', mouseup);
    },
    [canvasIsRender],
  );

  const start = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !canvasIsRender) {
      return;
    }

    if (cropzone.current) {
      return;
    }

    /** 不让触发ObjectAdd事件 */
    unSaveHistory.current = true;

    canvas.getObjects().forEach((obj: any) => {
      obj.evented = false;
    });

    cropzone.current = new Cropzone(canvasInstanceRef.current, {
      left: 0,
      top: 0,
      width: 0.5,
      height: 0.5,
      strokeWidth: 0,
      cornerSize: 16,
      cornerColor: 'blue',
      fill: 'transparent',
      hasRotatingPoint: false,
      hasBorders: false,
      lockScalingFlip: true,
      lockRotation: true,
      lockSkewingX: true,
      lockSkewingY: true,
      cornerStyle: 'circle',
      cornerStrokeColor: 'blue',
      transparentCorners: false,
      lineWidth: 2,
      borderColor: 'blue',
    } as any);

    canvas.discardActiveObject();
    canvas.add(cropzone.current);
    canvas.on('mouse:down', mousedown);
    canvas.selection = false;
    canvas.defaultCursor = 'crosshair';

    fabric.util.addListener(document as any, 'keydown', keydown);
    fabric.util.addListener(document as any, 'keyup', keyup);
  }, [canvasIsRender]);

  const end = useCallback(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    const cropzoneNew = cropzone.current;

    if (!cropzoneNew) {
      return;
    }
    canvas.remove(cropzoneNew);
    canvas.selection = true;
    canvas.defaultCursor = 'default';
    canvas.off('mouse:down', mousedown);
    canvas.off('mouse:move', mousemove);
    canvas.off('mouse:up', mouseup);

    canvas.forEachObject((obj: any) => {
      obj.evented = true;
    });

    cropzone.current = null;

    fabric.util.removeListener(document as any, 'keydown', keydown);
    fabric.util.removeListener(document as any, 'keyup', keyup);
    /** 解除，可以触发ObjectAdd事件 */
    unSaveHistory.current = false;
  }, [canvasIsRender]);

  /** 切换裁剪 */
  const handleCropTrigger = () => {
    if (currentMenuRef.current !== MENU_TYPE_ENUM.crop) {
      start();
    } else {
      end();
    }
    setCurrentMenu(
      currentMenuRef.current !== MENU_TYPE_ENUM.crop
        ? MENU_TYPE_ENUM.crop
        : MENU_TYPE_ENUM.default,
    );
  };

  /** 获取裁剪框参数 */
  const getCropzoneRect = () => {
    const cropzoneNew = cropzone.current;

    if (!cropzoneNew || !cropzoneNew.isValid()) {
      return null;
    }

    return {
      left: cropzoneNew.left,
      top: cropzoneNew.top,
      width: cropzoneNew.width,
      height: cropzoneNew.height,
    };
  };

  /** 获取裁剪部分图片数据 */
  const getCroppedImageData = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    const containsCropzone = canvas.contains(cropzone.current);
    const cropRect = getCropzoneRect();

    if (!cropRect) {
      return null;
    }

    if (containsCropzone) {
      canvas.remove(cropzone.current);
    }

    const imageData = {
      imageName: IMAGE_NAME,
      url: canvas.toDataURL(cropRect),
    };

    if (containsCropzone) {
      canvas.add(cropzone.current);
    }

    return imageData;
  };

  /** 确认或取消裁剪 */
  const handleCropChange = (value: boolean) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    if (!value) {
      end();
      start();
    } else {
      const data = getCroppedImageData();
      if (!data) {
        return;
      }

      if (!data.url.includes('base64')) {
        // Toast.warn('请划分裁剪区域', 1500);
        return;
      }

      canvas.clear();
      canvas.setBackgroundImage(data.url, function () {
        let oImg = canvas.backgroundImage;

        const { height } = wrapperInstanceRef.current.getBoundingClientRect();
        const center = canvas.getCenter();

        const imgHeight = oImg.height;
        /** 图片过大，使其大小正好跟容器一致 */
        oImg.scale(height / imgHeight);
        /** 使得图片在canvas中间 */
        oImg.set({
          left: center.left - (oImg.width * (height / imgHeight)) / 2,
          top: center.top - (oImg.height * (height / imgHeight)) / 2,
        });
        /** 不让直接操作图片 */
        oImg.selectable = false;
        oImg.id = WORK_SPACE_ID;
        canvas.renderAll();

        /** 准备下一次裁剪 */
        end();

        historyRef.current.updateCanvasState(ACTION.add);

        start();
      });
    }
  };

  useEffect(() => {
    if (currentMenu !== MENU_TYPE_ENUM.crop && cropzone.current) {
      /** 切换到其他菜单时清空 */
      end();
    }
  }, [currentMenu]);

  return { handleCropTrigger, handleCropChange, currentMenu };
};

/** 裁剪 */
export const Crop = () => {
  const { handleCropTrigger, handleCropChange, currentMenu } = useCrop();
  return (
    <>
      <div
        className={classNames(
          'bre-image-editor_tool-item bre-image-editor_tool-crop',
          {
            ['bre-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.crop,
          },
        )}
      >
        <CropPop
          open={currentMenu === MENU_TYPE_ENUM.crop}
          onChange={handleCropChange}
        >
          {/* <Popover content="裁剪" placement="top"> */}
          <i className="bre-image-editor_icon" onClick={handleCropTrigger} />
          {/* </Popover> */}
        </CropPop>
      </div>
    </>
  );
};
