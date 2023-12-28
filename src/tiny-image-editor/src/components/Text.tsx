/* eslint-disable @typescript-eslint/no-unused-expressions */
import { fabric } from 'fabric';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
// import { Popover } from '@casstime/bricks';
import classNames from 'classnames';

import { IPaintTypes, LANG, MENU_TYPE_ENUM, MENU_TYPE_TEXT, paintConfig } from '../constants';
import { EditorContext } from '../util';
import Paint from './setting/Paint';
import Popover from './setting/Popover';

export const useText = () => {
  const {
    canvasInstanceRef,
    currentMenuRef,
    setCurrentMenu,
    canvasIsRender,
    currentMenu,
  } = useContext(EditorContext);
  const paintConfigValue = useRef({
    color: paintConfig.colors[0],
    size: paintConfig.fontSizes[0],
  });

  const mouseup = useCallback((o: any) => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    if (
      canvas.getActiveObject() ||
      currentMenuRef.current !== MENU_TYPE_ENUM.text
    ) {
      return;
    }

    const pointer = canvas.getPointer(o.e);

    const text = new fabric.IText('输入内容', {
      left: pointer.x,
      top: pointer.y,
      fontSize: paintConfigValue.current.size,
      id: Math.random() * 4 + '_' + Date.now(),
      fill: paintConfigValue.current.color,
    } as any);

    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, []);

  const initText = () => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    canvas.on('mouse:up', mouseup);
  };

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas || !canvasIsRender) {
      return;
    }
    initText();

    return () => {
      canvas.off('mouse:up', mouseup);
    };
  }, [canvasIsRender]);

  const handleTextTrigger = () => {
    setCurrentMenu(
      currentMenuRef.current !== MENU_TYPE_ENUM.text
        ? MENU_TYPE_ENUM.text
        : MENU_TYPE_ENUM.default,
    );
  };

  const handlePaintChange = (type: IPaintTypes, value: number | string) => {
    if (!canvasInstanceRef.current) {
      return;
    }

    const canvas = canvasInstanceRef.current;
    const activeObject = canvas.getActiveObjects()[0];

    if (type === IPaintTypes.color) {
      paintConfigValue.current.color = value as string;
      activeObject && activeObject.set('fill', value);
    } else {
      paintConfigValue.current.size = value as number;
      activeObject && activeObject.set('fontSize', value);
    }
    canvas.renderAll();
  };

  return { handleTextTrigger, handlePaintChange, currentMenu };
};

export const Text = () => {
  const {
    lang = LANG.en
  } = useContext(EditorContext);
  const { handleTextTrigger, handlePaintChange, currentMenu } = useText();
  return (
    <>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-text',
          {
            ['tie-image-editor_tool-item--checked']:
              currentMenu === MENU_TYPE_ENUM.text,
          },
        )}
      >
        <Paint
          open={currentMenu === MENU_TYPE_ENUM.text}
          onChange={handlePaintChange}
          type={MENU_TYPE_ENUM.text}
        >
          <Popover content={MENU_TYPE_TEXT.text[lang]} placement="top">
            <i className="tie-image-editor_icon" onClick={handleTextTrigger} />
          </Popover>
        </Paint>
      </div>
    </>
  );
};
