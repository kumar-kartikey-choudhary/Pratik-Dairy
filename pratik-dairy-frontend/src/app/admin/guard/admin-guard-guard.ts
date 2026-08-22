import { CanActivateFn } from '@angular/router';
import { authGuardGuard } from '../../guard/auth-guard-guard';

/**
 * Kept for backwards compatibility with existing imports — the admin rules now
 * live in a single place so the two guards can never drift apart.
 */
export const adminGuardGuard: CanActivateFn = authGuardGuard;
