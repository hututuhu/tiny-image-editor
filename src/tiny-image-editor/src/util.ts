import React from 'react';
import { ACTION, IEditorProps, MENU_TYPE_ENUM } from './constants';

export interface IEditorContextProps extends IEditorProps {
  canvasInstanceRef: React.MutableRefObject<any>;
  wrapperInstanceRef: React.MutableRefObject<any>;
  currentMenuRef: React.MutableRefObject<MENU_TYPE_ENUM>;
  currentMenu: MENU_TYPE_ENUM;
  setCurrentMenu: (value: MENU_TYPE_ENUM) => void;
  canvasIsRender: boolean;
  canvasEl: React.MutableRefObject<any>;
  initCanvasJson: React.MutableRefObject<any>;
  unSaveHistory: React.MutableRefObject<any>;
  historyRef: React.MutableRefObject<any>;
  zoom: number;
  setZoom: (zoom: number) => void;
  initBackGroundImage: (
    imageUrl: string,
    justBackground: boolean,
    callback?: () => void,
  ) => void;
}

export const EditorContext = React.createContext<IEditorContextProps>({
  canvasInstanceRef: { current: null },
  wrapperInstanceRef: { current: null },
  currentMenuRef: { current: MENU_TYPE_ENUM.default },
  currentMenu: MENU_TYPE_ENUM.default,
  setCurrentMenu: () => {},
  canvasIsRender: false,
  canvasEl: { current: null },
  initCanvasJson: { current: null },
  unSaveHistory: { current: null },
  historyRef: { current: () => {} },
  initBackGroundImage: () => {},
  zoom: 1,
  setZoom: () => {},
});

export interface IHistory {
  id: string; //唯一标识
  data: string;
  type: MENU_TYPE_ENUM;
  action: ACTION;
}

export const isSupportFileApi = () => {
  return !!(window.File && window.FileList && window.FileReader);
};

export const base64ToBlob = (data: any) => {
  const rImageType = /data:(image\/.+);base64,/;
  let mimeString = '';
  let raw, uInt8Array, i;

  raw = data.replace(rImageType, (header: any, imageType: any) => {
    mimeString = imageType;

    return '';
  });

  raw = atob(raw);
  const rawLength = raw.length;
  uInt8Array = new Uint8Array(rawLength); // eslint-disable-line

  for (i = 0; i < rawLength; i += 1) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: mimeString });
};

export const clamp = (value: number, minValue: number, maxValue: number) => {
  if (minValue > maxValue) {
    // eslint-disable-next-line no-param-reassign
    [minValue, maxValue] = [maxValue, minValue];
  }

  return Math.max(minValue, Math.min(value, maxValue));
};
