<template>
  <div class="AdminConsolePage">
    <h2 class="text-h4 py-4 pb-8">
      Admin Console
    </h2>

    <div class="AdminConsolePage__search d-flex pb-0">
      <v-text-field
        v-model="searchQuery"
        label="Search"
        variant="outlined"
        type="text"
      />
      <v-spacer />
      <v-spacer />
    </div>

    <v-table class="AdminConsolePage__table">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              User name
            </th>
            <th class="text-left">
              Product name
            </th>
            <th class="text-left">
              Calories
            </th>
            <th class="text-left">
              Price
            </th>
            <th class="text-left">
              Date
            </th>
            <th class="text-left d-flex" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in renderedFoodEntries"
            :key="item.foodEntry.foodEntryId"
          >
            <td>{{ item.userFullName }}</td>
            <td>{{ item.foodEntry.name }}</td>
            <td>{{ item.foodEntry.calories }}</td>
            <td>{{ item.foodEntry.price }}</td>
            <td>{{ item.date }}</td>

            <td class="AdminConsolePage__rowActions d-flex align-center">
              <v-btn icon flat size="small" @click="() => (entryToEdit = item.foodEntry)">
                <v-icon size="small" color="grey">
                  mdi-pencil
                </v-icon>
              </v-btn>

              <v-btn icon flat size="small" @click="() => (entryToDelete = item.foodEntry)">
                <v-icon size="small" color="grey">
                  mdi-delete
                </v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>

  <!-- Dialog shown when we click on Delete icon -->
  <ConfirmDialogSmall
    :model-value="Boolean(entryToDelete)"
    :activator="false"
    width="300px"
    title="Delete entry?"
    confirm-text="Delete"
    confirm-color="red text-white"
    cancel-color="grey"
    actions-class="justify-space-between px-4"
    @confirm="onDeleteConfirmed"
    @cancel="() => (entryToDelete = null)"
  />

  <!-- Dialog shown when we click on Edit icon -->
  <FoodEntryDialog
    :model-value="Boolean(entryToEdit)"
    :food-entry="entryToEdit"
    :mode="FoodEntryDialogMode.EDIT"
    :activator="false"
    @food-entry="onFoodEntryEdited"
    @cancel="() => (entryToEdit = null)"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { AdminFoodEntry, formatFoodEntryDate, useFoodEntryAdmin } from '@/datasources/serverApollo/modules/foodEntry/useFoodEntry';
import FoodEntryDialog, { FoodEntryData, FoodEntryDialogMode } from '../../foodFeed/components/FoodEntryDialog.vue';
import ConfirmDialogSmall from '@/modules/core/components/ConfirmDialogSmall.vue';

interface RenderedFoodEntry {
  foodEntry: AdminFoodEntry;
  userFullName: string;
  date: string;
}

const AdminConsolePage = defineComponent({
  name: 'AdminConsolePage',
  components: {
    FoodEntryDialog,
    ConfirmDialogSmall,
  },
  setup() {
    const searchQuery = ref<string>('');
    const entryToDelete = ref<AdminFoodEntry | null>(null);
    const entryToEdit = ref<AdminFoodEntry | null>(null);

    const { foodEntries, getFoodEntries, deleteFoodEntry, updateFoodEntry } = useFoodEntryAdmin();
    getFoodEntries();

    const renderedFoodEntries = computed(() => foodEntries.value
      .map((foodEntry ): RenderedFoodEntry => ({
        foodEntry,
        userFullName: `${foodEntry.user.firstName} ${foodEntry.user.lastName}`,
        date: formatFoodEntryDate(foodEntry.date),
      }))
      .filter((foodEntry) => {
        const query = searchQuery.value.toLowerCase();
        // Skip if nothing to search by
        if (!query) return true;

        const filterableFields = [
          foodEntry.userFullName,
          foodEntry.date,
          foodEntry.foodEntry.name,
          foodEntry.foodEntry.calories,
          foodEntry.foodEntry.price
        ];

        return filterableFields.some((fieldValue) => `${fieldValue}`.toLowerCase().includes(query));
      })
    );

    const onDeleteConfirmed = (): void => {
      if (!entryToDelete.value) return;

      deleteFoodEntry({
        foodEntryId: entryToDelete.value.foodEntryId,
        userId: entryToDelete.value.user.userId,
      }).finally(() => {
        entryToDelete.value = null;
      });
    };

    const onFoodEntryEdited = (newFoodEntryData: FoodEntryData): void => {
      const oldEntry = entryToEdit.value;
      if (!oldEntry) return;

      // TODO: ADD SNACKBAR NOTIFS FOR SUCCESS / FAIL
      updateFoodEntry({
        userId: oldEntry.user.userId,
        foodEntry: {
          ...newFoodEntryData,
          foodEntryId: oldEntry.foodEntryId,
        },
      }).finally(() => {
        entryToEdit.value = null;
      });
    };

    return {
      renderedFoodEntries,
      searchQuery,
      entryToDelete,
      entryToEdit,
      onDeleteConfirmed,
      onFoodEntryEdited,
      FoodEntryDialogMode,
    };
  },
});

export default AdminConsolePage;
</script>

<style lang="scss">
.AdminConsolePage {
  &__table {
    max-width: 1000px !important;
  }

  &__rowActions {
    gap: 8px;
  }
}
</style>
