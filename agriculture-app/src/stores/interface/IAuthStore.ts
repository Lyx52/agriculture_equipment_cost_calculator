export interface IAuthStore {
  token: string|null;
  expiration: string|null;
  loading: boolean;
}
