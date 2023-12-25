// import { Popover } from '@casstime/bricks';
import React, { useContext } from 'react';
import { ACTION, MENU_TYPE_ENUM } from '../constants';
import { EditorContext } from '../util';

const useUpload = () => {
  const {
    canvasInstanceRef,
    canvasEl,
    currentMenuRef,
    historyRef,
    setCurrentMenu,
    initBackGroundImage,
  } = useContext(EditorContext);

  const handleUpload = (e: any) => {
    const canvas = canvasInstanceRef.current;
    if (
      !canvas ||
      !canvasEl.current ||
      !e.target.files.length ||
      !e.target.files[0]?.type?.includes('image')
    ) {
      return;
    }

    if (currentMenuRef.current !== MENU_TYPE_ENUM.upload) {
      setCurrentMenu(MENU_TYPE_ENUM.upload);
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      if (!event || !event.target) {
        return;
      }

      let imgObj = new Image();
      imgObj.src = event.target.result as string;
      initBackGroundImage(event.target.result as string, true, () => {
        historyRef.current.updateCanvasState(ACTION.add);
      });
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  return { handleUpload };
};

/** 上传 */
export const Upload = () => {
  const { handleUpload } = useUpload();
  return (
    <div className="bre-image-editor_tool-item bre-image-editor_tool-upload">
      {/* <Popover content="上传" placement="top"> */}
      <i className="bre-image-editor_icon">
        <input
          onChange={handleUpload}
          type="file"
          className="bre-image-editor_tool-upload-input"
          accept="image/*"
        />
      </i>
      {/* </Popover> */}
    </div>
  );
};
