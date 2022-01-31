<template>
  <v-card class="AdminReportChangeCard pa-6 elevation-4">
    <h4 class="text-h5 pb-4">
      {{ title }}
    </h4>

    <div class="AdminReportChangeCard__cardContent d-flex">

      <div class="AdminReportChangeCard__valueWrapper d-flex flex-column justify-space-between">
        <p>
          {{ newValueText }}
        </p>
        <p class="AdminReportChangeCard__newValue">
          {{ newValue }}
        </p>
      </div>

      <div class="AdminReportChangeCard__valueWrapper d-flex flex-column justify-space-between">
        <p>
          {{ oldValueText }}
        </p>
        <p class="AdminReportChangeCard__oldValue">
          {{ oldValue }}
        </p>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

/**
 * Presentational component for when we want to show two value
 * that indicate change from the old value to new.
 */
const AdminReportChangeCard = defineComponent({
  name: 'AdminReportChangeCard',
  props: {
    title: { type: String, required: true, default: 'Value' },
    newValue: { required: true },
    newValueText: { type: String, required: true, default: 'New Value' },
    oldValue: { required: true },
    oldValueText: { type: String, required: true, default: 'New Value' },
  },
});

export default AdminReportChangeCard;
</script>

<style lang="scss">
.AdminReportChangeCard {
  &__cardContent {
    gap: 30px;
  }

  &__valueWrapper {
    gap: 8px;
  }

  &__newValue {
    font-size: 36px;
    line-height: 1;
  }

  &__oldValue {
    font-size: 24px;
    line-height: 1;
  }
}
</style>
