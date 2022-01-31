<template>
  <ConfirmDialog
    class="FoodEntryDialog"
    content-class="FoodEntryDialog__dialog"
    content-wrapper-class="pa-6"
    actions-class="justify-space-between"
    :confirm-text="submitText"
    cancel-color="secondary"
    :error="error"
    @confirm="submit"
    @update:modelValue="onDialogOpenChange"
  >
    <template #activator="activatorProps">
      <slot name="activator" v-bind="activatorProps" />
    </template>

    <template #dialog-content>
      <h3 class="text-h6 pb-8">
        {{ title }}
      </h3>

      <v-text-field
        v-model="entryName"
        label="Product name"
        type="text"
        variant="outlined"
      />
      <v-text-field
        v-model="entryDate"
        label="Date"
        type="date"
        variant="outlined"
      />
      <v-text-field
        :model-value="entryCalories"
        label="Calories"
        type="number"
        variant="outlined"
        @update:modelValue="onCalorieChange"
      />
      <v-text-field
        :model-value="entryPrice"
        label="Price"
        type="number"
        variant="outlined"
        @update:modelValue="onPriceChange"
      />
    </template>
  </ConfirmDialog>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, triggerRef, PropType, toRefs, watch } from 'vue';
import max from 'lodash/max';

import { FoodEntry, formatFoodEntryDate } from '@/datasources/serverApollo/modules/foodEntry/useFoodEntry';
import ConfirmDialog from '../../core/components/ConfirmDialog.vue';

export type FoodEntryData = Omit<FoodEntry, 'foodEntryId' | 'date'> & {
  date: string;
};

export enum FoodEntryDialogMode {
  CREATE = 'FoodEntryDialogMode__CREATE',
  EDIT = 'FoodEntryDialogMode__EDIT',
}

const defaultDate = () => formatFoodEntryDate(new Date());

const dialogModeData: Record<FoodEntryDialogMode, {
  title: string;
  submitText: string;
}> = {
  [FoodEntryDialogMode.CREATE]: {
    title: 'Add new entry',
    submitText: 'Create entry',
  },
  [FoodEntryDialogMode.EDIT]: {
    title: 'Edit entry',
    submitText: 'Save changes',
  },
}

const FoodEntryDialog = defineComponent({
  name: 'FoodEntryDialog',
  components: {
    ConfirmDialog,
  },
  props: {
    mode: { type: String as PropType<FoodEntryDialogMode>, required: false, default: FoodEntryDialogMode.CREATE },
    foodEntry: { type: Object as PropType<FoodEntry>, required: false, default: null },
    loading: { type: Boolean, required: false, default: false },
    error: { type: String, required: false },
  },
  emits: {
    'food-entry': (_: FoodEntryData) => {},
  },
  setup(props, { emit }) {
    const { mode, foodEntry } = toRefs(props);

    const entryName: Ref<string> = ref('');
    const entryDate: Ref<string> = ref(defaultDate());
    const entryCalories: Ref<number> = ref(0);
    const entryPrice: Ref<number | null> = ref(null);

    const clearInput = () => {
      entryName.value = '';
      entryDate.value = defaultDate();
      entryCalories.value = 0;
      entryPrice.value = null;
    };

    const title = computed((): string => dialogModeData[mode.value]?.title);
    const submitText = computed((): string => dialogModeData[mode.value]?.submitText);

    // Clear form data when its closed
    const onDialogOpenChange = (isDialogOpen): void => {
      if (!isDialogOpen) clearInput();
    };

    // Set or clear form data when given entry is set / unset
    watch(foodEntry, (newFoodEntry): void => {
      if (!newFoodEntry) {
        clearInput();
        return;
      }

      entryName.value = newFoodEntry.name;
      entryDate.value = formatFoodEntryDate(newFoodEntry.date);
      entryCalories.value = newFoodEntry.calories;
      entryPrice.value = newFoodEntry.price;
    });

    const onCalorieChange = (newVal: number | string) => {
      if (typeof newVal !== 'number') {
        // Trigger so the current value is written again into the input
        triggerRef(entryCalories);
        return;
      }
      entryCalories.value = max([0, newVal])!;
    };

    const onPriceChange = (newVal: number | string) => {
      if (typeof newVal !== 'number') {
        // Trigger so the current value is written again into the input
        triggerRef(entryPrice);
        return;
      }
      entryPrice.value = max([0, newVal])!;
    };

    const foodEntryData = computed((): FoodEntryData => ({
      name: entryName.value,
      date: entryDate.value,
      calories: entryCalories.value,
      price: entryPrice.value ?? null,
    }));

    // TODO: Add validation
    const submit = () => {
      emit('food-entry', foodEntryData.value)
    };

    return {
      onDialogOpenChange,
      entryName,
      entryDate,
      entryCalories,
      entryPrice,
      onCalorieChange,
      onPriceChange,
      submit,
      title,
      submitText,
    };
  },
});

export default FoodEntryDialog;
</script>

<style lang="scss">
.FoodEntryDialog {
  &__dialog {
    min-width: 500px !important;
  }
}
</style>
