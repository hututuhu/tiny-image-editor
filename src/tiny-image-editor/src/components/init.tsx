/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fabric } from 'fabric';
import { useEffect, useRef, useState } from 'react';

import {
  ACTION,
  IDownloadBody,
  MENU_TYPE_ENUM,
  WORK_SPACE_ID,
  stayRemain,
} from '../constants';

interface IProps {
  url: string;
}

/** 初始化图像编辑组件 */
export const useInit = ({ url }: IProps) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const imageInstanceRef = useRef<any>();
  const canvasInstanceRef = useRef<any>();
  const wrapperInstanceRef = useRef<HTMLDivElement>(null);

  const [canvasIsRender, setCanvasIsRender] = useState(false);

  /** 当前菜单 */
  const [currentMenu, _setCurrentMenu] = useState(MENU_TYPE_ENUM.default);
  const currentMenuRef = useRef(MENU_TYPE_ENUM.default);

  /** canvas 初始化 */
  const initCanvasJson = useRef<string>('{}');

  /** 不应该保存历史 */
  const unSaveHistory = useRef<boolean>(false);

  /** 历史实例 */
  const historyRef = useRef<{
    updateCanvasState: (
      action: ACTION,
      remove: boolean,
      append: boolean,
    ) => void;
  }>({
    updateCanvasState: () => {},
  });

  /** 下载 */
  const downloadRef = useRef<{
    downLoad: (auto?: boolean) => Promise<IDownloadBody>;
  }>({
    downLoad: () => Promise.resolve({}),
  });

  /** 缩放比例 */
  const [zoom, setZoom] = useState(1);

  /** 更新菜单 */
  const setCurrentMenu = (newMenu: MENU_TYPE_ENUM) => {
    _setCurrentMenu(newMenu);
    currentMenuRef.current = newMenu;
    /** 清空自由画状态 */
    if (
      ![MENU_TYPE_ENUM.draw, MENU_TYPE_ENUM.mosaic].includes(newMenu) &&
      canvasInstanceRef.current &&
      canvasInstanceRef.current.isDrawingMode
    ) {
      canvasInstanceRef.current.isDrawingMode = false;
    }
  };

  /** 初始化画布 */
  const initCanvas = () => {
    if (wrapperInstanceRef.current && canvasEl.current) {
      try {
        const { width, height } =
          wrapperInstanceRef.current.getBoundingClientRect();
        const canvas = new fabric.Canvas(canvasEl.current, {
          containerClass: 'bre-image-editor_canvas',
          // enableRetinaScaling: false,
          // isDrawingMode: true,
          // fireRightClick: true, // 启用右键，button的数字为3
          // stopContextMenu: true, // 禁止默认右键菜单
          // controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
          width: width,
          height: height,
        });

        canvasInstanceRef.current = canvas;
        /** 通知其他组件，canvas已经实例化 */
        setCanvasIsRender(true);
        try {
          /** 第一次初始化 */
          initCanvasJson.current = JSON.stringify(canvas.toJSON(stayRemain));
        } catch (error) {
          console.error('initCanvasJson 初始化失败');
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  /** 初始化背景图 */
  const initBackGroundImage = (
    imageUrl: string = '',
    justBackground: boolean = false,
    callback?: () => void,
  ) => {
    const canvas = canvasInstanceRef.current;
    if (imageUrl.trim() && canvas && wrapperInstanceRef.current) {
      const { height } = wrapperInstanceRef.current.getBoundingClientRect();

      imageInstanceRef.current = fabric.Image.fromURL(
        imageUrl,
        (oImg: any) => {
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
          canvas.setBackgroundImage(oImg, canvas.renderAll.bind(canvas));

          /** 仅仅替换背景 */
          if (justBackground) {
            callback && callback();
            return;
          }

          try {
            /** 加载图片后再初始化一次 */
            initCanvasJson.current = JSON.stringify(canvas.toJSON(stayRemain));
          } catch (error) {
            console.error('initCanvasJson 初始化失败');
          }

          callback && callback();
        },
        {
          crossOrigin: 'anonymous',
        },
      );
    }
  };

  useEffect(() => {
    initCanvas();
  }, [canvasEl, wrapperInstanceRef]);

  useEffect(() => {
    initBackGroundImage(url);
  }, [url, canvasInstanceRef, wrapperInstanceRef]);

  return {
    canvasEl,
    imageInstanceRef,
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
  };
};
