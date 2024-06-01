import {
  type GenerationalId,
  type GenerationalArray,
} from '../util/generational_array';
import * as generational_array from '../util/generational_array';
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
    objects: generational_array.create(),
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
