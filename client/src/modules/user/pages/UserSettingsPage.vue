<template>
  <div class="UserSettingsPage">
    <h2 class="text-h4 py-4 pb-8">
      Settings
    </h2>

    <v-form :disabled="isLoading">
      <UserSettingsForm
        :user-settings="userSettings"
        @user-settings="(newVal) => (userSettingsFormData = newVal)"
      />

      <v-btn
        color="primary"
        :disabled="isLoading"
        @click="onSave"
      >
        Save
        <v-progress-circular
          v-if="updateUserSettingsLoading"
          indeterminate
          class="ml-2"
          size=20
          color="secondary"
        />
      </v-btn>
    </v-form>

    <p v-if="updateUserSettingsError" class="text-red text-body-2">
      Failed to save: {{ updateUserSettingsError }}
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { useUserSettings } from '@/datasources/serverApollo/modules/userSettings/useUserSettings';
import type { UserSettingsData } from '../components/UserSettingsForm.vue';
import UserSettingsForm from '../components/UserSettingsForm.vue';

const UserSettingsPage = defineComponent({
  name: 'UserSettingsPage',
  components: {
    UserSettingsForm,
  },
  setup() {
    const userSettingsFormData = ref<UserSettingsData>({
      priceLimitMonthly: null,
      caloriesLimitDaily: null,
    });

    const {
      userSettings,
      getUserSettingsLoading,
      getUserSettingsError,
      updateUserSettings,
      updateUserSettingsError,
      updateUserSettingsLoading,
    } = useUserSettings();

    const isLoading = computed((): boolean => getUserSettingsLoading.value || updateUserSettingsLoading.value);

    const onSave = (): void => {
      updateUserSettings({
        userSettings: userSettingsFormData.value
      });
    };

    return {
      userSettingsFormData,
      userSettings,
      isLoading,
      updateUserSettingsLoading,
      updateUserSettingsError,
      onSave,
    };
  },
});

export default UserSettingsPage;
</script>

<style lang="scss">
.UserSettingsPage {
}
</style>
