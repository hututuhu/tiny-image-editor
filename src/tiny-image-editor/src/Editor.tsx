import React, { forwardRef, useImperativeHandle } from 'react';

/** 工具 */
import {
  EMPTY_ARR,
  EMPTY_STR,
  IEditorProps,
  MENU_TYPE_ENUM,
  LANG
} from './constants';
import { EditorContext } from './util';

/** 小组件 */
import { Arrow } from './components/Arrow';
import { Circle } from './components/Circle';
import { Control } from './components/Control';
import { Crop } from './components/Crop';
import { Download } from './components/Download';
import { Drag } from './components/Drag';
import { Draw } from './components/Draw';
import { Flip } from './components/Flip';
import { History } from './components/History';
import Mosaic from './components/Mosaic';
import { Rect } from './components/Rect';
import { Reset } from './components/Reset';
import { Rotate } from './components/Rotate';
import { Scale } from './components/Scale';
import { Text } from './components/Text';
import { Upload } from './components/Upload';
import { useInit } from './components/init';

/** 图像编辑器组件 */
export const Editor = forwardRef(
  (
    { url = EMPTY_STR, style, menus = EMPTY_ARR, onDownLoad,lang = LANG.en }: IEditorProps,
    ref,
  ) => {
    const {
      canvasEl,
      canvasInstanceRef,
      wrapperInstanceRef,
      currentMenu,
      setCurrentMenu,
      currentMenuRef,
      canvasIsRender,
      initCanvasJson,
      unSaveHistory,
      historyRef,
      initBackGroundImage,
      downloadRef,
      zoom,
      setZoom,
    } = useInit({ url });

    /** 将下载方法透出去 */
    useImperativeHandle(
      ref,
      () => ({
        downloadRef: downloadRef,
      }),
      [],
    );

    return (
      <EditorContext.Provider
        value={{
          canvasInstanceRef,
          wrapperInstanceRef,
          currentMenuRef,
          currentMenu,
          setCurrentMenu,
          canvasIsRender,
          canvasEl,
          url,
          onDownLoad,
          initCanvasJson,
          unSaveHistory,
          historyRef,
          initBackGroundImage,
          zoom,
          setZoom,
          lang
        }}
      >
        <div className="tie-image-editor" style={style}>
          <Control />
          <div className="tie-image-editor_tool clearfix">
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.rect)) && <Rect />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.circle)) && (
              <Circle />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.arrow)) && (
              <Arrow />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.draw)) && <Draw />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.text)) && <Text />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.mosaic)) && (
              <Mosaic />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.crop)) && <Crop />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.download)) && (
              <Download ref={downloadRef} />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.upload)) && (
              <Upload />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.drag)) && <Drag />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.reset)) && (
              <Reset />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.rotate)) && (
              <Rotate />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.flip)) && <Flip />}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.scale)) && (
              <Scale />
            )}
            {(!menus.length || menus.includes(MENU_TYPE_ENUM.history)) && (
              <History ref={historyRef} />
            )}
          </div>
          <div
            ref={wrapperInstanceRef}
            className="tie-image-editor_modal__wrapper"
          >
            <canvas ref={canvasEl} />
          </div>
        </div>
      </EditorContext.Provider>
    );
  },
);

Editor.displayName = 'Editor';
