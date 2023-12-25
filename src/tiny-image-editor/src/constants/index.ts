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
  default = '',
}

export const MENU_TYPE_TEXT: { [key: string]: string } = {
  [MENU_TYPE_ENUM.crop]: '裁剪',
  [MENU_TYPE_ENUM.history]: '历史记录',
  [MENU_TYPE_ENUM.download]: '下载',
  [MENU_TYPE_ENUM.draw]: '画笔',
  [MENU_TYPE_ENUM.flip]: '翻转',
  [MENU_TYPE_ENUM.reset]: '重置',
  [MENU_TYPE_ENUM.rotate]: '旋转',
  [MENU_TYPE_ENUM.rect]: '矩形',
  [MENU_TYPE_ENUM.circle]: '圆形',
  [MENU_TYPE_ENUM.text]: '文本',
  [MENU_TYPE_ENUM.upload]: '上传',
  [MENU_TYPE_ENUM.drag]: '拖拽',
  [MENU_TYPE_ENUM.scale]: '缩放',
  [MENU_TYPE_ENUM.arrow]: '箭头',
  [MENU_TYPE_ENUM.mosaic]: '马赛克',
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
  onDownLoad?: (param: IDownloadBody) => void;
}

export const keyCodes = {
  Z: 90,
  Y: 89,
  SHIFT: 16,
  BACKSPACE: 8,
  DEL: 46,
};

export const IMAGE_NAME = 'bre_image_editor';

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
