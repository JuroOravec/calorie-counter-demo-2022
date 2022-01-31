<template>
  <ConfirmDialog
    class="ConfirmDialogSmall"
    v-bind="$attrs"
    :content-class="usedContentClass"
    @confirm="() => $emit('confirm')"
    @cancel="() => $emit('cancel')"
    @update:modelValue="(val) => $emit('update:modelValue', val)"
  >
    <!-- Pass on all slots. See https://gist.github.com/loilo/73c55ed04917ecf5d682ec70a2a1b8e2 -->
    <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <template #dialog-content>
      <v-card-title class="d-flex pb-0 px-4">
        {{ title }}
      </v-card-title>

      <v-card-text v-if="$slots['dialog-content']" class="d-flex px-4">
        <slot name="dialog-content" />
      </v-card-text>
    </template>
  </ConfirmDialog>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';

import ConfirmDialog, { emits } from './ConfirmDialog.vue';

/**
 * ConfirmDialog for small messages (like confirmation).
 *
 * Props, slots, and events are pass to/from ConfirmDialog.vue.
 * See that file for more details.
 */
const ConfirmDialogSmall = defineComponent({
  name: 'ConfirmDialogSmall',
  components: {
    ConfirmDialog,
  },
  inheritAttrs: false,
  props: {
    title: { type: String, required: false, default: 'Are you sure?' },
    contentClass: { type: String, required: false, default: undefined },
  },
  emits,
  setup(props) {
    const { contentClass } = toRefs(props);

    const usedContentClass = computed(
      (): string => `${contentClass.value} ConfirmDialogSmall__dialog`
    );

    return {
      usedContentClass,
    };
  },
});

export default ConfirmDialogSmall;
</script>

<style lang="scss">
.ConfirmDialogSmall {
  &__actions {
    flex: 0 0 auto;
    gap: 10px;
  }
}
</style>
