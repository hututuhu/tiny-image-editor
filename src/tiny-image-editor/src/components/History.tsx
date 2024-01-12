/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
// import { Icon, Popover } from '@casstime/bricks';
import classNames from 'classnames';
import React from 'react';

import {
  ACTION,
  ACTION_TEXT,
  LANG,
  MAX_HISTORY_LEN,
  MENU_TYPE_ENUM,
  MENU_TYPE_TEXT,
  WORK_SPACE_ID,
  stayRemain,
} from '../constants';
import { EditorContext, IHistory } from '../util';
import Popover from './setting/Popover';

export const useHistory = () => {
  const {
    canvasInstanceRef,
    canvasIsRender,
    currentMenuRef,
    initCanvasJson,
    unSaveHistory,
  } = useContext(EditorContext);

  const [history, setHistory] = useState<IHistory[]>([] as IHistory[]);
  const [currentId, setCurrentId] = useState('');

  /**
   * action:操作类型
   * remove：是否移除最后一项
   * append：是否追加最新项目
   */
  const updateCanvasState = useCallback(
    (action: ACTION, remove: boolean = false, append: boolean = false) => {
      if (!canvasInstanceRef.current || unSaveHistory.current) {
        return;
      }

      const canvas = canvasInstanceRef.current;

      try {
        /** 列表为空 */
        const jsonData = canvas.toJSON(stayRemain);
        const canvasAsJson = JSON.stringify(jsonData);
        const id = Date.now() + '_' + Math.floor(Math.random() * 10000);

        const currentIndex = history.findIndex(
          ({ id: hId = '' }) => hId === currentId,
        );

        /**
         * （如果当前索引在中间，需要把索引后边的历史去掉）
         * 1、根据remove决定是否移除最后一条
         * 2、根据append决定是否追加一条
         * 3、根据MAX_HISTORY_LEN，最多存 MAX_HISTORY_LEN 条历史
         * */
        const newHistory = history.slice(0, currentIndex + 1 - +remove).concat(
          append || (!remove && !append)
            ? [
                {
                  id,
                  data: canvasAsJson,
                  type:
                    action !== ACTION.delete
                      ? currentMenuRef.current
                      : MENU_TYPE_ENUM.default,
                  action,
                },
              ]
            : [],
        );
        setHistory(
          newHistory.slice(Math.max(0, history.length - MAX_HISTORY_LEN)),
        );
        setCurrentId(id);
      } catch (error) {
        console.error(error);
      }
    },
    [history, currentId],
  );

  const objectModified = useCallback(
    (e: any) => {
      if (e.target.id === WORK_SPACE_ID || (e.action === undefined && e.e)) {
        return;
      }
      updateCanvasState(ACTION.modified);
    },
    [updateCanvasState],
  );

  const objectAdd = useCallback(
    (e: any) => {
      if (e.action === undefined && e.e) {
        return;
      }

      updateCanvasState(ACTION.add);
    },
    [updateCanvasState],
  );

  useEffect(() => {
    const canvas = canvasInstanceRef.current;
    if (!canvas) {
      return;
    }

    if (canvas && canvasIsRender) {
      canvas.on('object:modified', objectModified);

      canvas.on('object:added', objectAdd);
    }

    return () => {
      canvas.off('object:modified', objectModified);
      canvas.off('object:added', objectAdd);
    };
  }, [canvasInstanceRef, canvasIsRender, objectModified, objectAdd]);

  const renderNewCanvas = useCallback(
    (id: string = '') => {
      const canvas = canvasInstanceRef.current;

      if (!canvas) {
        return;
      }

      if (id === currentId) {
        return;
      }

      const newCanvasStr =
        history.find(({ id: cId }) => cId === id)?.data ||
        initCanvasJson.current;

      unSaveHistory.current = true;
      canvas.loadFromJSON(newCanvasStr, () => {
        canvas.renderAll();
        unSaveHistory.current = false;
      });
      setCurrentId(id);
    },
    [currentId, history],
  );

  /** 前进 */
  const handleRedo = useCallback(() => {
    if (!canvasInstanceRef.current || !history.length) {
      return;
    }

    let newId = '';

    if (!currentId) {
      newId = history[0]?.id;
    } else {
      history.forEach(({ id }, index) => {
        if (id === currentId) {
          newId = history[index + 1]?.id;
        }
      });
    }

    renderNewCanvas(newId);
  }, [currentId, history]);

  /** 后退 */
  const handleUndo = useCallback(() => {
    if (!canvasInstanceRef.current || !history.length) {
      return;
    }

    let newId = '';
    history.forEach(({ id }, index) => {
      if (id === currentId) {
        newId = history[index - 1]?.id;
      }
    });

    renderNewCanvas(newId);
  }, [currentId, history]);

  return {
    history,
    currentId,
    renderNewCanvas,
    handleRedo,
    handleUndo,
    updateCanvasState,
  };
};

/** 历史 */
export const History = forwardRef((props, ref) => {
  const { lang = LANG.en } = useContext(EditorContext);

  const {
    history,
    currentId,
    renderNewCanvas,
    handleRedo,
    handleUndo,
    updateCanvasState,
  } = useHistory();

  useImperativeHandle(ref, () => ({
    updateCanvasState,
  }));

  return (
    <>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-history',
          {
            'tie-image-editor_tool-item--disabled': !history.length,
          },
        )}
      >
        <Popover
          content={
            <div className="tie-image-editor-history_pop">
              {!!history.length && (
                <>
                  <div className="tie-image-editor-history_pop-title">
                    {ACTION_TEXT.title[lang]}
                    <span className="tie-image-editor-history_pop-len">
                      （{history.length}）
                    </span>
                  </div>
                  <div
                    onClick={() => renderNewCanvas('')}
                    className={classNames('tie-image-editor-history_pop-item', {
                      'tie-image-editor-history_pop-item--checked': !currentId,
                    })}
                  >
                    <span className="tie-image-editor-history_pop-item-num">
                      1.
                    </span>
                    {ACTION_TEXT.init[lang]}
                    {!currentId && (
                      <i className="tie-image-editor-history_pop-item-icon" />
                    )}
                  </div>
                </>
              )}
              {!history.length && <span>{ACTION_TEXT.placeholder[lang]}</span>}
              {history.map(({ action = '', id, type }, index) => (
                <div
                  key={id}
                  onClick={() => renderNewCanvas(id)}
                  className={classNames('tie-image-editor-history_pop-item', {
                    'tie-image-editor-history_pop-item--checked':
                      id === currentId,
                  })}
                >
                  <span className="tie-image-editor-history_pop-item-num">
                    {index + 2}.
                  </span>
                  {!!ACTION_TEXT[action] && ACTION_TEXT[action][lang]}{' '}
                  {!!MENU_TYPE_TEXT[type] && MENU_TYPE_TEXT[type][lang]}
                  {id === currentId && (
                    <i className="tie-image-editor-history_pop-item-icon" />
                  )}
                </div>
              ))}
            </div>
          }
          placement="bottom"
          className="tie-image-editor-history_target"
        >
          <i className={classNames('tie-image-editor_icon')} />
        </Popover>
      </div>
      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-redo',
          {
            'tie-image-editor_tool-item--disabled':
              !history.length || currentId === history[history.length - 1]?.id,
          },
        )}
      >
        <Popover content={MENU_TYPE_TEXT.redo[lang]} placement="top">
          <i
            className={classNames('tie-image-editor_icon')}
            onClick={
              !history.length || currentId === history[history.length - 1]?.id
                ? undefined
                : handleRedo
            }
          />
        </Popover>
      </div>

      <div
        className={classNames(
          'tie-image-editor_tool-item tie-image-editor_tool-undo',
          {
            'tie-image-editor_tool-item--disabled':
              !history.length || !currentId,
          },
        )}
      >
        <Popover content={MENU_TYPE_TEXT.undo[lang]} placement="top">
          <i
            className={classNames('tie-image-editor_icon')}
            onClick={!history.length || !currentId ? undefined : handleUndo}
          />
        </Popover>
      </div>
    </>
  );
});

History.displayName = 'History';
