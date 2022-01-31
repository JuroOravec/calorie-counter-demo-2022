import { ref, Ref } from 'vue';

/**
 * Convert an async function into a composable that tracks
 * when the function is in progress / failed / finished.
 */
export const useAsync = <TArgs extends any[], TResult>(
  asyncFn: (...args: TArgs) => Promise<TResult>,
  options: { defaultValue: TResult },
) => {
  const { defaultValue } = options || {};

  const loading: Ref<boolean> = ref(false);
  const error: Ref<null | Error | string> = ref(null);
  const value = ref(defaultValue) as Ref<TResult>;

  const call = async (...args: TArgs) => {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    await asyncFn(...args)
      .then((res) => {
        value.value = res;
      })
      .catch((err) => {
        error.value = err;
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
    call,
    loading,
    error,
    value,
  };
};
