import {
  type GenerationalId,
  type GenerationalArray,
  createGenerationalArray,
} from '../util/generational_array';
import { type Time } from '../util/time';

export type Scene<O> = {
  objects: GenerationalArray<SceneObject<O>>;
};

export type SceneObject<O> = {
  appear: Time;
  disappear: Time;
  layer: number;
  value: O;
};

export const createEmptyScene = <O>(): Scene<O> => {
  return {
    objects: createGenerationalArray(),
  };
};

export const sceneAddObject = <O>(
  scene: Scene<O>,
  obj: O,
  appear: Time,
  disappear: Time,
  layer: number,
): GenerationalId => {
  return scene.objects.add({
    appear,
    disappear,
    layer,
    value: obj,
  });
};

export const sceneClearObjects = <O>(scene: Scene<O>) => {
  scene.objects.clear();
};

export const sceneRemoveDisappearedObjects = <O>(
  scene: Scene<O>,
  now: Time,
) => {
  let removeList: GenerationalId[] = [];
  scene.objects.forEach((object, id) => {
    if (object.disappear <= now) {
      removeList.push(id);
    }
  });
  removeList.forEach((id) => {
    scene.objects.remove(id);
  });
};

export const sceneForEachAppearingObjects = <O>(
  scene: Scene<O>,
  now: Time,
  callback: (object: O) => void,
) => {
  scene.objects.forEach((object) => {
    if (object.appear <= now && object.disappear > now) {
      callback(object.value);
    }
  });
};

/**
 * すべてのオブジェクトが登場済みで，登場済みのすべてのオブジェクトが永遠に存在し続けるならtrueを返す．
 * 未登場のオブジェクトがある場合や，登場済みオブジェクトが消える予定である場合はfalseを返す．
 * */
export const sceneIsFixed = <O>(scene: Scene<O>, now: Time): boolean => {
  let every = true;
  scene.objects.forEach((object) => {
    if (object.appear >= now) {
      every = false;
    } else if (isFinite(object.disappear)) {
      every = false;
    }
  });
  return every;
};
