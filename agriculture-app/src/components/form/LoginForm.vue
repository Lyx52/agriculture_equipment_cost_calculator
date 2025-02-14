<template>
  <BContainer class="mt-5">
    <BRow align-h="center">
      <BCol cols="12" md="6">
        <BCard title="Pieslēgties" class="mb-3">
          <BForm @submit.prevent="onSubmit" class="d-flex flex-column mb-3">
            <BFormGroup
              class="my-3"
              label="E-pasta adrese"
              label-for="email-input"
            >
              <BFormInput
                id="email-input"
                v-model="email"
                type="email"
                placeholder="E-pasta adrese"
                required
              />
            </BFormGroup>
            <BFormGroup
              class="my-3"
              label="Parole"
              label-for="password-input"
            >
              <BFormInput
                id="password-input"
                v-model="password"
                type="password"
                placeholder="Parole"
                required
              />
            </BFormGroup>
            <span class="w-100">
              <router-link to="/auth/register">Reģistrēties šeit</router-link>
            </span>
            <BButton class="ms-auto" type="submit" variant="primary">Pieslēgties</BButton>
          </BForm>
          <Checkbox v-model="captchaResponse" action="submit" />
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { BContainer, BRow, BCol, BCard, BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
  import { Checkbox } from 'vue-recaptcha';
  import { useAuthStore } from '@/stores/auth.ts'
  import router from '@/router'
  import emitter from '@/stores/emitter.ts'

  const email = ref('');
  const password = ref('');
  const authStore = useAuthStore();
  const captchaResponse = ref(undefined);
  const onSubmit = async () => {
    if (!captchaResponse.value) {
      emitter.emit('error', 'Lūdzu apstipriniet, ka neesat robots');
      return;
    }
    await authStore.login(email.value, password.value);
    if (authStore.token?.length) {
      await router.push('/');
    }
  }
</script>

<style scoped>
</style>
