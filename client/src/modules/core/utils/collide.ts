type Rect = Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>;

export const rectsCollide = (rect1: Rect, rect2: Rect): boolean => {
  return !(
    rect1.top > rect2.bottom ||
    rect1.right < rect2.left ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right
  );
};

export const elementsCollide = (
  el1: HTMLElement,
  el2: HTMLElement,
): boolean => {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return rectsCollide(rect1, rect2);
};

export const elementCollidesWithMouseEvent = (
  el: HTMLElement,
  event: MouseEvent,
): boolean => {
  const elRect = el.getBoundingClientRect();
  const eventRect: Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'> = {
    top: event.y,
    bottom: event.y + 1,
    left: event.x,
    right: event.x + 1,
  };

  return rectsCollide(elRect, eventRect);
};
