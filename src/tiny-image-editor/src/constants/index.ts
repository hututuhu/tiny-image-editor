export const eventNames = {
  OBJECT_ACTIVATED: 'objectActivated',
  OBJECT_MOVED: 'objectMoved',
  OBJECT_SCALED: 'objectScaled',
  OBJECT_CREATED: 'objectCreated',
  TEXT_EDITING: 'textEditing',
  TEXT_CHANGED: 'textChanged',
  ICON_CREATE_RESIZE: 'iconCreateResize',
  ICON_CREATE_END: 'iconCreateEnd',
  ADD_TEXT: 'addText',
  ADD_OBJECT: 'addObject',
  ADD_OBJECT_AFTER: 'addObjectAfter',
  MOUSE_DOWN: 'mousedown',
  MOUSE_UP: 'mouseup',
  MOUSE_MOVE: 'mousemove',
  // UNDO/REDO Events
  REDO_STACK_CHANGED: 'redoStackChanged',
  UNDO_STACK_CHANGED: 'undoStackChanged',
  SELECTION_CLEARED: 'selectionCleared',
  SELECTION_CREATED: 'selectionCreated',
};

/** 菜单 */
export enum MENU_TYPE_ENUM {
  crop = 'crop',
  history = 'history',
  download = 'download',
  draw = 'draw',
  flip = 'flip',
  reset = 'reset',
  rotate = 'rotate',
  rect = 'rect',
  circle = 'circle',
  text = 'text',
  upload = 'upload',
  drag = 'drag',
  scale = 'scale',
  arrow = 'arrow',
  mosaic = 'mosaic',
  undo = 'undo',
  redo = 'redo',
  default = '',
}

export enum LANG {
  zh = 'zh',
  en = 'en'
}

export const MENU_TYPE_TEXT: { [key: string]: {[LANG.zh]:string,[LANG.en]:string} } = {
  [MENU_TYPE_ENUM.crop]: {[LANG.zh]:'裁剪',[LANG.en]:MENU_TYPE_ENUM.crop},
  [MENU_TYPE_ENUM.history]: {[LANG.zh]:'历史记录',[LANG.en]:MENU_TYPE_ENUM.history},
  [MENU_TYPE_ENUM.download]: {[LANG.zh]:'下载',[LANG.en]:MENU_TYPE_ENUM.download},
  [MENU_TYPE_ENUM.draw]: {[LANG.zh]:'画笔',[LANG.en]:MENU_TYPE_ENUM.draw},
  [MENU_TYPE_ENUM.flip]: {[LANG.zh]:'翻转',[LANG.en]:MENU_TYPE_ENUM.flip},
  [MENU_TYPE_ENUM.reset]: {[LANG.zh]:'重置',[LANG.en]:MENU_TYPE_ENUM.reset},
  [MENU_TYPE_ENUM.rotate]: {[LANG.zh]:'旋转',[LANG.en]:MENU_TYPE_ENUM.rotate},
  [MENU_TYPE_ENUM.rect]: {[LANG.zh]:'矩形',[LANG.en]:MENU_TYPE_ENUM.rect},
  [MENU_TYPE_ENUM.circle]: {[LANG.zh]:'圆形',[LANG.en]:MENU_TYPE_ENUM.circle},
  [MENU_TYPE_ENUM.text]: {[LANG.zh]:'文本',[LANG.en]:MENU_TYPE_ENUM.text},
  [MENU_TYPE_ENUM.upload]: {[LANG.zh]:'上传',[LANG.en]:MENU_TYPE_ENUM.upload},
  [MENU_TYPE_ENUM.drag]: {[LANG.zh]:'拖拽',[LANG.en]:MENU_TYPE_ENUM.drag},
  [MENU_TYPE_ENUM.scale]: {[LANG.zh]:'缩放',[LANG.en]:MENU_TYPE_ENUM.scale},
  [MENU_TYPE_ENUM.arrow]: {[LANG.zh]:'箭头',[LANG.en]:MENU_TYPE_ENUM.arrow},
  [MENU_TYPE_ENUM.mosaic]: {[LANG.zh]:'马赛克',[LANG.en]:MENU_TYPE_ENUM.mosaic},
  [MENU_TYPE_ENUM.redo]:{[LANG.zh]:"前进",[LANG.en]:MENU_TYPE_ENUM.redo},
  [MENU_TYPE_ENUM.undo]:{[LANG.zh]:"后退",[LANG.en]:MENU_TYPE_ENUM.undo}
};

export enum ACTION {
  add = 'add',
  modified = 'modified',
  delete = 'delete',
}

export const ACTION_TEXT: { [key: string]: string } = {
  [ACTION.add]: '添加',
  [ACTION.modified]: '修改',
  [ACTION.delete]: '删除',
};

export enum FLIP_TYPE {
  flipX = 'flipX',
  flipY = 'flipY',
}

export const WORK_SPACE_ID = 'workspace';

export enum IPaintTypes {
  size = 'size', //尺寸
  color = 'color', //颜色
}

/** 一些绘画配置 */
export const paintConfig = {
  sizes: [5, 10, 20], //通用画笔尺寸
  colors: ['red', 'orange', 'yellow', 'green', 'blue', 'white'], //通用画笔颜色
  fontSizes: [30, 60, 90], //通用文字颜色
  rotates: [0, 45, 90, 135, 180, 225, 270, 315, 360], //通用旋转角度
  mosaicSizes: [10, 20, 30], //马赛克大小
};

/** 下载函数参数 */
export interface IDownloadBody {
  downLoadUrl?: string;
}

export interface IEditorProps {
  url?: string;
  style?: React.CSSProperties;
  menus?: MENU_TYPE_ENUM[];
  lang?:LANG;
  onDownLoad?: (param: IDownloadBody) => void;
}

export const keyCodes = {
  Z: 90,
  Y: 89,
  SHIFT: 16,
  BACKSPACE: 8,
  DEL: 46,
};

export const IMAGE_NAME = 'tie_image_editor';

export const DEFAULT_DIMENSION = 8;

/** 前进和回退时保留的属性 */
export const stayRemain = [
  'id',
  'gradientAngle',
  'selectable',
  'hasControls',
  'source',
  'editable',
];

/** 最大历史长度 */
export const MAX_HISTORY_LEN = 30;
/** 空值 */
export const EMPTY_STR = '';
export const EMPTY_ARR = [];
/** 原生dom事件的interface */
export type IDOMProps = React.DOMAttributes<HTMLElement>;
/** 通用的需要从 props 过滤掉的不属于 dom 的属性 */
export const INVALID_PROPS = [
  'onChange',
  'loadData',
  'onClick',
  'onSelect',
  'options',
  'name',
  'value',
  'defaultValue',
  'values',
  'defaultValues',
  'placeholder',
  'large',
  'small',
  'iconRender',
  'icon',
  'activeIndex',
  'swipeAble',
  'fixedArrows',
  'error',
  'onVisibleChange',
];
