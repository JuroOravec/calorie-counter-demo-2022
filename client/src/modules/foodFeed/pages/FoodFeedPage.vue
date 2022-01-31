<template>
  <div class="FoodFeedPage">
    <div class="d-flex justify-space-between">
      <FoodEntryDialog
        :loading="createFoodEntryLoading"
        :error="createFoodEntryError"
        @foodEntry="onCreateFoodEntry"
      >
        <template #activator="{props}">
          <v-btn v-bind="props" icon color="#26D6CF" class="text-white">
            <div :style="{ fontSize: '3em', fontWeight: 300}" >
              +
            </div>
          </v-btn>
        </template>
      </FoodEntryDialog>

      <div class="FoodFeedPage__filters align-center d-flex mt-4">
        <v-text-field
          v-model="filterDateFrom"
          label="From"
          type="date"
          variant="outlined"
        />
        <v-text-field
          v-model="filterDateTo"
          label="To"
          type="date"
          variant="outlined"
        />
      </div>
    </div>

    <div
      v-for="{
        monthId,
        formattedMonth,
        entriesByDay,
        totalMonthlyPrice,
        isPriceOverLimit
      } in renderedFoodEntriesByMonthAndDay"
      :key="monthId"
      class="FoodFeedPage__entries py-6"
    >
      <div class="pt-4 pb-2">

        <div class="d-flex justify-space-between align-start">
          <h4 class="text-h5 font-weight-bold">
            {{ formattedMonth }}
          </h4>

          <div class="d-flex flex-column align-end">
            <div>
              <span class="text-body-1 font-weight-bold">${{ totalMonthlyPrice }}</span>
              <span class="text-caption"> spent</span>
            </div>

            <p v-if="isPriceOverLimit" class="text-red font-weight-bold text-body-2">
              You are over your monthly spend limit of ${{ priceLimitMonthly }}!
            </p>
          </div>
        </div>
      </div>

      <div class="FoodFeedPage__dayCards d-flex flex-column">
        <v-card
          v-for="{
            dayId,
            dayEntries,
            formattedDay,
            totalDailyCalories,
            isCaloriesOverLimit
          } in entriesByDay"
          :key="dayId"
          class="FoodFeedPage__dayCard py-4"
        >
          <div class="px-4">
            <div class="d-flex justify-space-between align-start pb-2">
              <h5 class="text-h6">
                {{ formattedDay }}
              </h5>

              <div class="d-flex flex-column align-end">
                <div>
                  <span class="text-body-1 font-weight-bold">{{ totalDailyCalories }}</span>
                  <span class="text-caption"> / {{ caloriesLimitDaily }} kcal</span>
                </div>

                <p v-if="isCaloriesOverLimit" class="text-amber font-weight-bold text-body-2">
                  You are over your daily caloric limit of {{ caloriesLimitDaily }} kcal!
                </p>
              </div>
            </div>
          </div>

          <v-divider class="mx-4" />

          <v-table class="AdminConsolePage__table">
            <template v-slot:default>
              <tbody>
                <tr
                  v-for="entry in dayEntries"
                  :key="entry.orig.foodEntryId"
                >
                  <td>{{ entry.orig.name }}</td>
                  <td>{{ entry.orig.calories }} kcal</td>
                  <td>{{ entry.price }}</td>

                  <td class="AdminConsolePage__rowActions d-flex align-center justify-end">
                    <v-btn icon flat size="small" @click="() => (entryToEdit = entry.orig)">
                      <v-icon size="small" color="grey">
                        mdi-pencil
                      </v-icon>
                    </v-btn>

                    <v-btn icon flat size="small" @click="() => (entryToDelete = entry.orig)">
                      <v-icon size="small" color="grey">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-table>
        </v-card>
      </div>
    </div>
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
import groupBy from 'lodash/groupBy';
import sumBy from 'lodash/sumBy';
import orderBy from 'lodash/orderBy';
import isNil from 'lodash/isNil';
import { format, isAfter, isBefore } from 'date-fns';

import { formatFoodEntryDate, useFoodEntry, FoodEntry } from '@/datasources/serverApollo/modules/foodEntry/useFoodEntry';
import { useUserSettings } from '@/datasources/serverApollo/modules/userSettings/useUserSettings';
import ConfirmDialogSmall from '@/modules/core/components/ConfirmDialogSmall.vue';
import FoodEntryDialog, { FoodEntryData, FoodEntryDialogMode } from '../components/FoodEntryDialog.vue';

const FoodFeedPage = defineComponent({
  name: 'FoodFeedPage',
  components: {
    FoodEntryDialog,
    ConfirmDialogSmall,
  },
  setup() {
    const entryToDelete = ref<FoodEntry | null>(null);
    const entryToEdit = ref<FoodEntry | null>(null);

    const filterDateFrom = ref<string | null>(null);
    const filterDateTo = ref<string | null>(null);

    const {
      foodEntries,
      createFoodEntry,
      createFoodEntryError,
      createFoodEntryLoading,
      getFoodEntries,
      deleteFoodEntry,
      deleteFoodEntryError,
      deleteFoodEntryLoading,
      updateFoodEntry,
      updateFoodEntryError,
      updateFoodEntryLoading,
    } = useFoodEntry();

    getFoodEntries();

    const { userSettings } = useUserSettings();

    const priceLimitMonthly = computed(() => userSettings.value?.priceLimitMonthly ?? null);
    const caloriesLimitDaily = computed(() => userSettings.value?.caloriesLimitDaily ?? null);

    const transformEntry = (entry: FoodEntry) => ({
      orig: entry,
      price: isNil(entry.price) ? 'N/A' : `$${entry.price}`,
    });

    const filterEntry = ({ entry, dateFrom, dateTo }: { entry: FoodEntry, dateFrom: Date | null, dateTo: Date | null }): boolean => {
      if (dateFrom && isBefore(entry.date, dateFrom)) return false;
      if (dateTo && isAfter(entry.date, dateTo)) return false;

      return true;
    };

    const renderedFoodEntriesByMonthAndDay = computed(() => {
      const dateFrom = filterDateFrom.value ? new Date(filterDateFrom.value) : null;
      const dateTo = filterDateTo.value ? new Date(filterDateTo.value) : null;

      const entriesByMonth = groupBy(
        foodEntries.value,
        (entry) => format(entry.date, 'yyyy-MM'),
      );

      const entriesByMonthAndDay = Object.entries(entriesByMonth).map(([monthId, monthEntries]) => {
        const entriesByDay = groupBy(
          monthEntries,
          (entry) => formatFoodEntryDate(entry.date),
        );

        const totalMonthlyPrice = sumBy(monthEntries, (entry) => entry.price ?? 0);
        const isPriceOverLimit = isNil(priceLimitMonthly.value) ? false : totalMonthlyPrice > priceLimitMonthly.value;

        const dayEntries = Object.entries(entriesByDay).map(([dayId, dayEntries]) => {
          const totalDailyCalories = sumBy(dayEntries, (entry) => entry.calories);
          return {
            dayId,
            formattedDay: format(new Date(dayId), 'iii dd/MM/yyyy'),
            dayEntries: dayEntries.filter((entry) => filterEntry({ entry, dateFrom, dateTo })).map(transformEntry),
            totalDailyCalories,
            isCaloriesOverLimit: isNil(caloriesLimitDaily.value) ? false : totalDailyCalories > caloriesLimitDaily.value,
          };
        }).filter(
          // Show only those days where we have entries that passed the filter
          (dayData) => dayData.dayEntries.length
        );

        return {
          monthId,
          formattedMonth: format(new Date(monthId), 'MMM yyyy'),
          entriesByDay: orderBy(dayEntries, (entry) => entry.dayId, 'desc'),
          totalMonthlyPrice,
          isPriceOverLimit,
        };
      }).filter(
        // Show only those months where we have entries that passed the filter
        (monthData) => monthData.entriesByDay.length
      );

      return entriesByMonthAndDay;
    });

    const onCreateFoodEntry = (foodEntryData: FoodEntryData) => {
      createFoodEntry({ foodEntry: foodEntryData });
    };

    const onDeleteConfirmed = (): void => {
      if (!entryToDelete.value) return;

      deleteFoodEntry({
        foodEntryId: entryToDelete.value.foodEntryId,
      }).finally(() => {
        entryToDelete.value = null;
      });
    };

    const onFoodEntryEdited = (newFoodEntryData: FoodEntryData): void => {
      const oldEntry = entryToEdit.value;
      if (!oldEntry) return;

      // TODO: ADD SNACKBAR NOTIFS FOR SUCCESS / FAIL
      updateFoodEntry({
        foodEntry: {
          ...newFoodEntryData,
          foodEntryId: oldEntry.foodEntryId,
        },
      }).finally(() => {
        entryToEdit.value = null;
      });
    };

    return {
      entryToEdit,
      entryToDelete,
      filterDateFrom,
      filterDateTo,
      renderedFoodEntriesByMonthAndDay,
      priceLimitMonthly,
      caloriesLimitDaily,
      onCreateFoodEntry,
      onDeleteConfirmed,
      onFoodEntryEdited,
      FoodEntryDialogMode,
      createFoodEntryError,
      createFoodEntryLoading,
    };
  },
});

export default FoodFeedPage;
</script>

<style lang="scss">
.FoodFeedPage {
  max-width: 600px;
  margin: auto;

  &__dayCards {
    gap: 25px;
  }

  &__dayCard {
    border-left: 5px solid rgb(var(--v-theme-primary));
    box-shadow: 0px 0px 20px -2px rgb(0 0 0 / 20%);
  }

  &__filters {
    gap: 16px;

    .v-field__control {
      --v-input-control-height: 40px;
    }

    .v-text-field {
      font-size: 14px;

      .v-label {
        top: 3px;
        font-size: 12px;
      }

      .v-input__details {
        display: none;
      }
    }
  }

  .v-divider {
    color: rgb(var(--v-theme-primary));
  }
}
</style>
