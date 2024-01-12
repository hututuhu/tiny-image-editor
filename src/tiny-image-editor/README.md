## API

| 参数(prop) | 类型(type)                     | 默认值(defaultValue) | 说明(description) |
| ---------- | ------------------------------ | -------------------- | ----------------- |
| url        | string                         | -                    | 图片 URL          |
| style      | React.CSSProperties            | -                    | 内联样式          |
| menus      | MENU_TYPE_ENUM[]               | -                    | 菜单              |
| lang       | zh or en                       | en                   | 语言-language     |
| onDownLoad | (param: IDownloadBody) => void | -                    | 下载回调          |

## MENU_TYPE_ENUM

```
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
```

## IDownloadBody

```
export interface IDownloadBody {
  downLoadUrl?: string;
}
```
