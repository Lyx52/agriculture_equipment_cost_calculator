import { defineStore } from 'pinia'
import { ErrorTranslations, getBackendUri, parseJwt, validateProblem } from '@/utils.ts'
import type { IAuthStore } from '@/stores/interface/IAuthStore.ts'
import emitter from '@/stores/emitter.ts'

export const useAuthStore = defineStore('auth', {
  state(): IAuthStore {
    return {
      loading: false,
      token: null,
      expiration: null,
    }
  },
  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.token = null;
      try {
        const response = await fetch(`${getBackendUri()}/Auth/Login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (response.status == 401) {
          emitter.emit('error', ErrorTranslations["LOGIN_FAILED"]);
          return;
        }
        if (await validateProblem(response)) return;
        const data = await response.json();
        this.token = data?.token;
        this.expiration = data?.expiration;
      } catch (e) {
        console.log(e);
      } finally {
        this.loading = false
      }
    },
    async register(email: string, password: string) {
      this.loading = true;
      try {
        const response = await fetch(`${getBackendUri()}/Auth/Register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        await validateProblem(response);
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.token = null
    },
    validateExpiration() {
      if (this.expiration && new Date(this.expiration) < new Date()) {
        this.token = null;
        this.expiration = null
      }
    }
  },
  getters: {
    isLoggedIn(state: IAuthStore) {
      return !!state?.token?.length;
    },
    email(state: IAuthStore) {
      if (!state.token) return '';
      const tokenInfo = parseJwt(state.token);
      return tokenInfo?.email || '';
    }
  },
  persist: {
    serializer: {
      deserialize: (data: string) => {
        const stateData = JSON.parse(data);
        return {
          token: stateData.token,
          expiration: stateData.expiration,
          loading: false
        } as IAuthStore
      },
      serialize: (data) => {
        return JSON.stringify({
          token: data.token,
          expiration: data.expiration
        })
      }
    }
  }
})
