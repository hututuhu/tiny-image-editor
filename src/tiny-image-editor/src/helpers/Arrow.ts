/* eslint-disable no-param-reassign */
import { fabric } from 'fabric';

/** 自定义箭头 */
const Arrow = fabric.util.createClass(fabric.Line, {
  type: 'arrow',
  superType: 'drawing',
  initialize(points: any, options: any) {
    if (!points) {
      const { x1, x2, y1, y2 } = options;
      points = [x1, y1, x2, y2];
    }
    options = options || {};
    this.callSuper('initialize', points, options);
  },
  _render(ctx: any) {
    this.callSuper('_render', ctx);
    ctx.save();
    const xDiff = this.x2 - this.x1;
    const yDiff = this.y2 - this.y1;
    const angle = Math.atan2(yDiff, xDiff);
    ctx.translate((this.x2 - this.x1) / 2, (this.y2 - this.y1) / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    /** 箭头上的三角形大小 */
    ctx.moveTo(this.strokeWidth * 2, 0);
    ctx.lineTo(-this.strokeWidth * 2, this.strokeWidth * 2);
    ctx.lineTo(-this.strokeWidth * 2, -this.strokeWidth * 2);
    ctx.closePath();
    ctx.fillStyle = this.stroke;
    ctx.fill();
    ctx.restore();
  },
});

Arrow.fromObject = (options: any, callback: any) => {
  const { x1, x2, y1, y2 } = options;
  return callback(new (fabric as any).Arrow([x1, y1, x2, y2], options));
};

export default Arrow;
