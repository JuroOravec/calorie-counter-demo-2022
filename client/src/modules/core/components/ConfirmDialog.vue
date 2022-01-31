<template>
  <div class="ConfirmDialog">
    <v-dialog
      v-model="isOpen"
      max-height="unset"
      v-bind="$attrs"
      :content-class="usedContentClass"
      @click:outside="cancel"
    >
      <template v-if="activator" #activator="activatorProps">
        <slot name="activator" v-bind="activatorProps">
          <v-btn color="primary" dark v-bind="activatorProps.attrs">
            Open
          </v-btn>
        </slot>
      </template>

      <div :style="dialogStyle">
        <slot name="default" v-bind="{ confirm, cancel }">
          <v-card :class="contentWrapperClass">
            <slot name="dialog-content" />

            <div class="ConfirmDialog__actions d-flex py-3" :class="actionsClass">
              <slot name="actions" v-bind="{ confirm, cancel }">
                <slot name="confirm-action" v-bind="{ confirm }">
                  <v-btn :disabled="confirmDisabled || confirmLoading || disabled" :color="confirmColor" dark @click="confirm">
                    {{ confirmText }}
                    <v-progress-circular
                      v-if="confirmLoading"
                      indeterminate
                      class="ml-2"
                      size=20
                      color="secondary"
                    />
                  </v-btn>
                </slot>

                <slot name="cancel-action" v-bind="{ cancel }">
                  <v-btn :disabled="cancelDisabled || cancelLoading || disabled" :color="cancelColor" variant="outlined" outlined dark @click="cancel">
                    {{ cancelText }}
                    <v-progress-circular
                      v-if="cancelLoading"
                      indeterminate
                      class="ml-2"
                      size=20
                      color="secondary"
                    />
                  </v-btn>
                </slot>
              </slot>
            </div>

            <p v-if="error" class="text-red text-body-2">
              {{ error }}
            </p>
          </v-card>
        </slot>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, computed, CSSProperties } from 'vue';

// Defined separately, so it can be reused by ConfirmDialogSmall
export const emits = {
  confirm: () => true,
  cancel: () => true,
  'update:modelValue': (val: boolean) => true,
};

/** Wrapper around v-dialog that handles open/close logic */
const ConfirmDialog = defineComponent({
  name: 'ConfirmDialog',
  inheritAttrs: false,
  props: {
    /** Whether the dialog is open */
    modelValue: { type: Boolean, required: false, default: false },
    /** Size of the dialog box */
    width: { type: String, required: false, default: 'auto' },
    height: { type: String, required: false, default: 'auto' },
    /** Override styling classes */
    contentClass: { type: String, required: false, default: undefined },
    contentWrapperClass: { type: String, required: false, default: undefined },
    actionsClass: { type: String, required: false, default: undefined },
    /** Whether to enable activator slot */
    activator: { type: Boolean, required: false, default: true },
    /** Action buttons */
    confirmText: { type: String, required: false, default: 'Confirm' },
    confirmColor: { type: String, required: false, default: 'primary' },
    confirmDisabled: { type: Boolean, required: false, default: false },
    confirmLoading: { type: Boolean, required: false, default: false },
    cancelText: { type: String, required: false, default: 'Cancel' },
    cancelColor: { type: String, required: false, default: 'primary' },
    cancelDisabled: { type: Boolean, required: false, default: false },
    cancelLoading: { type: Boolean, required: false, default: false },
    /** Disable all buttons */
    disabled: { type: Boolean, required: false, default: false },
    /** Show error */
    error: { type: String, required: false, default: undefined },
  },
  emits,
  setup(props, { emit }) {
    const { modelValue, contentClass, height, width } = toRefs(props);

    const isOpen = ref<boolean>(false);

    // Sync internal value and prop
    watch(modelValue, (newModelValue) => (isOpen.value = newModelValue));
    // Update v-model
    watch(isOpen, (newIsOpen) => emit('update:modelValue', newIsOpen));

    const confirm = (): void => {
      emit('confirm');
      isOpen.value = false;
    };
    const cancel = (): void => {
      emit('cancel');
      isOpen.value = false;
    };

    // Merge user-provided class and and our own
    const usedContentClass = computed((): string => `${contentClass.value} ConfirmDialog__dialog`);

    const dialogStyle = computed((): CSSProperties => ({
      height: height.value,
      width: width.value,
    }))

    return {
      isOpen,
      confirm,
      cancel,
      usedContentClass,
      dialogStyle,
    };
  },
});

export default ConfirmDialog;
</script>

<style lang="scss">
.ConfirmDialog {
  &__actions {
    justify-content: space-evenly;
    text-align: center;
  }

  &__dialog {
    max-height: unset !important;
    max-width: unset !important;
  }
}
</style>
