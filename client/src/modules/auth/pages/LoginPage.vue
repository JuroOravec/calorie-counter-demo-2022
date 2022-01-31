<template>
  <div class="LoginPage mx-auto pa-8 pt-8">
    <h2 class="text-h4 py-8">
      Login
    </h2>

    <v-form :disabled="isAuthLoading">
      <div class="LoginPage__col">
        <v-text-field v-model="firstName" label="First Name" type="text" autocomplete="given-name" variant="outlined"/>
        <v-text-field v-model="lastName" label="Last Name" type="text" autocomplete="family-name" variant="outlined" />
      </div>

      <v-text-field v-model="email" label="Email" type="email" autocomplete="email" variant="outlined" />

      <v-text-field
        v-model="password"
        label="Password"
        :type="isPasswordVisible ? 'text' : 'password'"
        autocomplete="current-password"
        variant="outlined"
      >
        <template #append>
          <v-btn
            icon
            @click="() => (isPasswordVisible = !isPasswordVisible)"
          >
            <v-icon>
              {{isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'}}
            </v-icon>
          </v-btn>
        </template>
      </v-text-field>

      <div class="LoginPage__col">
        <v-btn
          size="large"
          :disabled="isAuthLoading"
          @click="onLogin"
        >
          Login
          <v-progress-circular
            v-if="loginLoading"
            indeterminate
            class="ml-2"
            size=20
            color="secondary"
          />
        </v-btn>

        <v-btn
          size="large"
          :disabled="isAuthLoading"
          @click="onSignup"
        >
          Signup
          <v-progress-circular
            v-if="signupLoading"
            indeterminate
            class="ml-2"
            size=20
            color="secondary"
          />
        </v-btn>
      </div>
    </v-form>

    <p v-if="loginError" class="text-red text-body-2">
      Failed to login: {{ loginError }}
    </p>
    <p v-else-if="signupError" class="text-red text-body-2">
      Failed to signup: {{ signupError }}
    </p>

    <h3 class="text-h6 pt-16 pb-4">
      Or login as
    </h3>

    <div class="LoginPage__col">
      <v-btn
        v-for="acc in dummyAccounts"
        :key="acc.email"
        class="py-8 px-0"
        @click="() => loginWithDummyAcc(acc)"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="acc.imgUrl"></v-img>
          </v-list-item-avatar>

          <div class="ml-2">
            <v-list-item-title>
              {{acc.firstName}} {{acc.lastName}}
            </v-list-item-title>
            <v-list-item-subtitle>
              Roles: {{acc.userRoles.length ? acc.userRoles.join(', ') : 'None'}}
            </v-list-item-subtitle>
          </div >
        </v-list-item>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, Ref } from 'vue';
import { useRouter } from 'vue-router';

import { GqlUser, GqlUserRoleType } from '@/__generated__/graphql';
import type { SignUpInput } from '@/datasources/serverRest/endpoints/auth';
import thispersondoesnotexist1 from '@/assets/imgs/thispersondoesnotexist_1.jpeg';
import thispersondoesnotexist2 from '@/assets/imgs/thispersondoesnotexist_2.jpeg';
import thispersondoesnotexist3 from '@/assets/imgs/thispersondoesnotexist_3.jpeg';
import { AuthKey, UseAuth } from '../composables/useAuth';
import { AppRoute } from '@/plugins/vueRouter/router';

// TODO: REMOVE DUMMY ACCOUNTS
interface DummyAccountData extends Omit<GqlUser, 'userId' | 'userSettings'> {
  plaintextPassword: string;
  userRoles: GqlUserRoleType[];
  imgUrl: string;
}

const dummyAccounts: DummyAccountData[] = [{
  firstName: 'John',
  lastName: 'Sharp',
  email: 'john.sharp@sharp.io',
  plaintextPassword: '12345678',
  userRoles: [],
  imgUrl: thispersondoesnotexist1,
}, {
  firstName: 'Stacy',
  lastName: 'Walsh',
  email: 's.walsh@kmail.com',
  plaintextPassword: 'tr33b!rdnestTest',
  userRoles: [],
  imgUrl: thispersondoesnotexist2,
}, {
  firstName: 'Adam',
  lastName: 'Admin',
  email: 'adam@admin.co.uk',
  plaintextPassword: 'ee8dce792e83fe5255f43e4362e5e3e0',
  userRoles: [GqlUserRoleType.ADMIN],
  imgUrl: thispersondoesnotexist3,
}]

const LoginPage = defineComponent({
  name: 'LoginPage',
  setup() {
    const firstName: Ref<string> = ref('');
    const lastName: Ref<string> = ref('');
    const email: Ref<string> = ref('');
    const password: Ref<string> = ref('');

    const isPasswordVisible: Ref<boolean> = ref(false);

    const {
      login,
      loginError,
      loginLoading,
      signup,
      signupError,
      signupLoading,
    } = inject<UseAuth>(AuthKey)!;

    const router = useRouter();

    const isAuthLoading = computed(() => loginLoading.value || signupLoading.value);

    const formData = computed((): SignUpInput => ({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    }));

    const redirectFromLogin = () => {
      router.replace({ name: AppRoute.FOOD_FEED });
    }

    const onLogin = () => login(formData.value).then(redirectFromLogin);
    const onSignup = () => signup(formData.value).then(redirectFromLogin);

    const loginWithDummyAcc = (acc: DummyAccountData) => login({
      email: acc.email,
      password: acc.plaintextPassword,
    }).then(redirectFromLogin);

    return {
      firstName,
      lastName,
      email,
      password,
      isPasswordVisible,
      onLogin,
      loginLoading,
      loginError,
      onSignup,
      signupLoading,
      signupError,
      isAuthLoading,
      //
      dummyAccounts,
      loginWithDummyAcc,
    };
  },
});

export default LoginPage;
</script>

<style lang="scss">
.LoginPage {
  max-width: 600px;

  &__col {
    display: flex;
    gap: 20px;

    & > * {
      flex: 1 1 auto;
    }
  }

  .v-img {
    border-radius: 25px;
  }
}
</style>
