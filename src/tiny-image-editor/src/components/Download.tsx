import React, { forwardRef, useContext, useImperativeHandle } from 'react';
import { IMAGE_NAME } from '../constants';
import { EditorContext, base64ToBlob, isSupportFileApi } from '../util';
import Popover from './setting/Popover';

const useDownload = () => {
  const { canvasInstanceRef, canvasEl, onDownLoad } = useContext(EditorContext);

  const handleDownload = (auto: boolean = false) => {
    console.log('heheh');
    const canvas = canvasInstanceRef.current;
    if (!canvas || !canvasEl.current) {
      return Promise.reject();
    }

    const dataURL = canvas.toDataURL();
    let imageName = Date.now() + IMAGE_NAME;
    let blob, type;

    if (onDownLoad) {
      onDownLoad({ downLoadUrl: dataURL });
      return Promise.resolve({ downLoadUrl: dataURL });
    }

    if (!auto) {
      return Promise.resolve({ downLoadUrl: dataURL });
    }

    if (isSupportFileApi() && (window as any).saveAs) {
      blob = base64ToBlob(dataURL);
      type = blob.type.split('/')[1];
      if (imageName.split('.').pop() !== type) {
        imageName += `.${type}`;
      }
      (window as any).saveAs(blob, imageName);
    } else {
      if (imageName.split('.').pop() !== type) {
        imageName += `.png`;
      }
      const anchorEl = document.createElement('a');
      anchorEl.href = dataURL;
      anchorEl.download = imageName;
      document.body.appendChild(anchorEl);
      anchorEl.click();
      anchorEl.remove();
    }

    return Promise.resolve({ downLoadUrl: dataURL });
  };

  return { handleDownload };
};

/** 下载 */
export const Download = forwardRef((props, ref) => {
  const { handleDownload } = useDownload();

  useImperativeHandle(
    ref,
    () => ({
      download: handleDownload,
    }),
    [handleDownload],
  );

  return (
    <div className="tie-image-editor_tool-item tie-image-editor_tool-download">
      <Popover content="下载" placement="top">
        <i
          className="tie-image-editor_icon"
          onClick={() => handleDownload(true)}
        />
      </Popover>
    </div>
  );
});

Download.displayName = 'Download';
