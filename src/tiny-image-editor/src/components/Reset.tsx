import { fabric } from 'fabric';
import React, { useContext } from 'react';
import { ACTION, LANG, MENU_TYPE_ENUM, MENU_TYPE_TEXT } from '../constants';
import { EditorContext } from '../util';
import Popover from './setting/Popover';

const useReset = () => {
  const { setCurrentMenu, currentMenuRef, canvasInstanceRef, historyRef } =
    useContext(EditorContext);

  const handleReset = () => {
    if (currentMenuRef.current !== MENU_TYPE_ENUM.reset) {
      setCurrentMenu(MENU_TYPE_ENUM.reset);
    }

    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    /** 清空除了背景之外的图形 */
    canvas.getObjects().forEach((o: any) => {
      if (o !== canvas.backgroundImage) {
        canvas.remove(o);
      }
    });

    /** 将缩放也重置 */
    const center = canvas.getCenter();
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), 1);

    /** 将画布拖回初始值位置 */
    const viewportTransform = canvas.viewportTransform;
    viewportTransform[4] = 0;
    viewportTransform[5] = 0;
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();

    /** 保存历史 */
    historyRef.current.updateCanvasState(ACTION.add);
  };

  return { handleReset };
};

/** 重置 */
export const Reset = () => {
  const { lang = LANG.en } = useContext(EditorContext);
  const { handleReset } = useReset();
  return (
    <div className="tie-image-editor_tool-item tie-image-editor_tool-reset">
      <Popover content={MENU_TYPE_TEXT.reset[lang]} placement="top">
        <i className="tie-image-editor_icon" onClick={handleReset} />
      </Popover>
    </div>
  );
};
