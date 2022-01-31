<template>
  <div class="AdminReportPage">
    <h2 class="text-h4 py-4 pb-8">
      Admin Report
    </h2>

    <div class="AdminReportPage__cards d-flex">
      <AdminReportChangeCard
        title="Entries added"
        :new-value="foodEntryMetrics.numOfEntriesThisWeek"
        new-value-text="This week"
        :old-value="foodEntryMetrics.numOfEntriesLastWeek"
        old-value-text="Last week"
      />

      <AdminReportChangeCard
        title="Average calories per user"
        :new-value="foodEntryMetrics.avgOfCaloriesPerUserThisWeek"
        new-value-text="This week"
        :old-value="foodEntryMetrics.avgOfCaloriesPerUserLastWeek"
        old-value-text="Last week"
      />
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useFoodEntryMetrics } from '@/datasources/serverApollo/modules/metrics/useMetrics';
import AdminReportChangeCard from '../components/AdminReportChangeCard.vue';

const AdminReportPage = defineComponent({
  name: 'AdminReportPage',
  components: {
    AdminReportChangeCard,
  },
  setup() {
    const foodEntryMetrics = useFoodEntryMetrics();

    return {
      foodEntryMetrics,
    };
  },
});

export default AdminReportPage;
</script>

<style lang="scss">
.AdminReportPage {
  &__cards {
    gap: 30px;
  }
}
</style>
