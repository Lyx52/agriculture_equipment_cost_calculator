<template>
  <BContainer class="mt-5">
    <BRow align-h="center">
      <BCol cols="12" md="6">
        <BCard title="Reģistrēties" class="mb-3">
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
              :state="passwordMeetsRequirements"
              :invalid-feedback="passwordRequirementMessage"
              :validated="validated"
            >
              <BFormInput
                @input="onInput"
                id="password-input"
                v-model="password"
                type="password"
                placeholder="Parole"
                required
              />
            </BFormGroup>
            <BFormGroup
              class="my-3"
              label="Parole atkārtoti"
              label-for="password-input-repeat"
              :state="passwordNotMatch"
              invalid-feedback="Paroles nesakrīt"
            >
              <BFormInput
                @input="onInput"
                id="password-input-repeat"
                v-model="passwordRepeat"
                type="password"
                placeholder="Parole atkārtoti"
                required
              />
            </BFormGroup>
            <span class="w-100">
              <router-link to="/auth/login">Pieslēgties šeit</router-link>
            </span>
            <BButton class="ms-auto" type="submit" variant="primary">Reģistrēties</BButton>
          </BForm>
          <Checkbox v-model="captchaResponse" action="submit" />
        </BCard>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BContainer, BRow, BCol, BCard, BForm, BFormGroup, BFormInput, BButton } from 'bootstrap-vue-next'
  import { useAuthStore } from '@/stores/auth.ts'
  import { Checkbox } from 'vue-recaptcha';
  import emitter from '@/stores/emitter.ts'
  import router from '@/router'
  const email = ref('');
  const password = ref('');
  const passwordRepeat = ref('');
  const validated = ref(false);
  const passwordNotMatch = computed(() => validated.value ? password.value == passwordRepeat.value : undefined);
  const passwordRequirementMessage = computed(() => {
    if (!validated.value) return undefined;

    if (password.value.length < 6) {
      return 'Paroles garumam jābūt vismaz 6 simboliem';
    }

    if (!/[A-Z]/.test(password.value)) {
      return 'Parolei jāsatur vismaz viens lielais burts';
    }

    if (!/[a-z]/.test(password.value)) {
      return 'Parolei jāsatur vismaz viens mazais burts';
    }

    if (!/[0-9]/.test(password.value)) {
      return 'Parolei jāsatur vismaz viens cipars';
    }

    if (!/[^A-Za-z0-9]/.test(password.value)) {
      return 'Parolei jāsatur vismaz viens speciālais simbols';
    }

    return '';
  });
  const passwordMeetsRequirements = computed(() => validated.value ? (passwordRequirementMessage.value ?? '').length <= 0 : undefined);
  const onInput = () => {
    validated.value = true;
  };
  const authStore = useAuthStore();
  const captchaResponse = ref(undefined);
  const onSubmit = async () => {
    if (!passwordMeetsRequirements.value) return;
    if (!captchaResponse.value) {
      emitter.emit('error', 'Lūdzu apstipriniet, ka neesat robots');
      return;
    }
    await authStore.register(email.value, password.value);
    await router.push('/auth/login');
  }
</script>

<style scoped>
</style>
