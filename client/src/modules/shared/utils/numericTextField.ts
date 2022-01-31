import { Ref, triggerRef } from 'vue';

/**
 * v-text-field doesn't work very well with numeric inputs.
 *
 * Use this helper to assign the numeric value to `numRef`.
 */
export const createTextFieldNumericValueHandler =
  <T>({
    numRef,
    transform,
  }: {
    numRef: Ref<T>;
    transform: (val: number) => T;
  }) =>
  (val: number | string) => {
    if (typeof val !== 'number') {
      // Trigger so the current value is written again into the input
      triggerRef(numRef);
      return;
    }
    numRef.value = transform(val);
  };
