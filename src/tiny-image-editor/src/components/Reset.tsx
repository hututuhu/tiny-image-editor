import { fabric } from 'fabric';
import React, { useContext } from 'react';
import { ACTION, MENU_TYPE_ENUM } from '../constants';
import { EditorContext } from '../util';
import Popover from './setting/Popover';

const useReset = () => {
  const {
    setCurrentMenu,
    initCanvasJson,
    currentMenuRef,
    canvasInstanceRef,
    historyRef,
  } = useContext(EditorContext);

  const handleReset = () => {
    if (currentMenuRef.current !== MENU_TYPE_ENUM.reset) {
      setCurrentMenu(MENU_TYPE_ENUM.reset);
    }

    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    /** 先清空，再重新设置背景 */
    canvas.clear();

    /** 将缩放也重置 */
    const center = canvas.getCenter();
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), 1);
    /** 设置背景图 */
    canvas.clear().renderAll();
    canvas.loadFromJSON(JSON.parse(initCanvasJson.current), () => {
      canvas.renderAll();
      historyRef.current.updateCanvasState(ACTION.add);
    });
  };

  return { handleReset };
};

/** 重置 */
export const Reset = () => {
  const { handleReset } = useReset();
  return (
    <div className="tie-image-editor_tool-item tie-image-editor_tool-reset">
      <Popover content="重置" placement="top">
        <i className="tie-image-editor_icon" onClick={handleReset} />
      </Popover>
    </div>
  );
};
