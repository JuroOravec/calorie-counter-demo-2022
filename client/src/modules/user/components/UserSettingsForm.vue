<template>
  <div class="UserSettingsForm">
    <v-text-field
      :model-value="caloriesLimitDaily"
      label="Daily Calorie Goal"
      type="number"
      variant="outlined"
      @update:modelValue="onCaloriesLimitChange"
    />

    <v-text-field
      :model-value="priceLimitMonthly"
      label="Monthly Price Limit"
      type="number"
      variant="outlined"
      @update:modelValue="onPriceLimitChange"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref, PropType, toRefs, watch } from 'vue';
import max from 'lodash/max';
import round from 'lodash/round';

import { UserSettings } from '@/datasources/serverApollo/modules/userSettings/useUserSettings';
import { createTextFieldNumericValueHandler } from '@/modules/shared/utils/numericTextField';

export interface UserSettingsData {
  caloriesLimitDaily: number | null;
  priceLimitMonthly: number | null;
};

const UserSettingsForm = defineComponent({
  name: 'UserSettingsForm',
  props: {
    userSettings: { type: Object as PropType<UserSettings>, required: false, default: null },
  },
  emits: {
    'user-settings': (_: UserSettingsData) => true,
  },
  setup(props, { emit }) {
    const { userSettings } = toRefs(props);

    const caloriesLimitDaily: Ref<number | null> = ref(null);
    const priceLimitMonthly: Ref<number | null> = ref(null);

    const clearInput = () => {
      caloriesLimitDaily.value = null;
      priceLimitMonthly.value = null;
    };

    // Set or clear form data when value from props change
    watch(userSettings, (newUserSettings): void => {
      if (!newUserSettings) {
        clearInput();
        return;
      }

      caloriesLimitDaily.value = newUserSettings.caloriesLimitDaily;
      priceLimitMonthly.value = newUserSettings.priceLimitMonthly;
    }, { immediate: true });

    const onCaloriesLimitChange = createTextFieldNumericValueHandler({
      numRef: caloriesLimitDaily,
      transform: (val) => {
        const nonNegativeValue = max([0, val])!;
        return round(nonNegativeValue, 0);
      },
    });

    const onPriceLimitChange = createTextFieldNumericValueHandler({
      numRef: priceLimitMonthly,
      transform: (val) => {
        const nonNegativeValue = max([0, val])!;
        return round(nonNegativeValue, 0);
      },
    });

    const userSettingsData = computed((): UserSettingsData => ({
      caloriesLimitDaily: caloriesLimitDaily.value ?? null,
      priceLimitMonthly: priceLimitMonthly.value ?? null,
    }));

    watch(userSettingsData, (newUserSettingsData) => {
      emit('user-settings', newUserSettingsData)
    });

    return {
      caloriesLimitDaily,
      onCaloriesLimitChange,
      priceLimitMonthly,
      onPriceLimitChange,
    };
  },
});

export default UserSettingsForm;
</script>

<style lang="scss">
.UserSettingsForm {
  .v-text-field {
    max-width: 300px;
  }
}
</style>
