import type { Prefetch } from '@/stores/enums/Prefetch.ts'

export interface IPrefetchStore {
  handles: Map<Prefetch, () => Promise<void>>;
  isLoading: boolean;
}
