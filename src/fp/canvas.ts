import { ReaderIO } from 'fp-ts/lib/ReaderIO';

export type Render<A> = ReaderIO<CanvasRenderingContext2D, A>;

export const getFillStyle: Render<string | CanvasGradient | CanvasPattern> =
  (ctx) => () =>
    ctx.fillStyle;

export const getFont: Render<string> = (ctx) => () => ctx.font;

export const setFillStyle: (
  style: string | CanvasGradient | CanvasPattern,
) => Render<CanvasRenderingContext2D> = (style) => (ctx) => () => {
  ctx.fillStyle = style;
  return ctx;
};

export const setFont: (font: string) => Render<CanvasRenderingContext2D> =
  (font) => (ctx) => () => {
    ctx.font = font;
    return ctx;
  };

export const fillRect: (rect: {
  x: number;
  y: number;
  width: number;
  height: number;
}) => Render<CanvasRenderingContext2D> =
  ({ x, y, width, height }) =>
  (ctx) =>
  () => {
    ctx.fillRect(x, y, width, height);
    return ctx;
  };

export const setTextAlign: (
  align: CanvasTextAlign,
) => Render<CanvasRenderingContext2D> = (align) => (ctx) => () => {
  ctx.textAlign = align;
  return ctx;
};

export const fillText: (text: {
  text: string;
  x: number;
  y: number;
  maxWidth?: number;
}) => Render<CanvasRenderingContext2D> =
  ({ text, x, y, maxWidth }) =>
  (ctx) =>
  () => {
    ctx.fillText(text, x, y, maxWidth);
    return ctx;
  };

export const measureText: (text: string) => Render<TextMetrics> =
  (text) => (ctx) => () =>
    ctx.measureText(text);
