// src/features/auth/authSlice.test.ts
import { describe, it, expect } from 'vitest'
import authReducer, { clearError } from './authSlice'

// Huom: kirjassa id: '1' (string); meidän User-tyypissä id on number.
const testUser = { id: 1, username: 'Test', email: 'test@test.com', role: 'USER' as const }

describe('auth reducer', () => {
  const initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  }

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should clear error', () => {
    const stateWithError = { ...initialState, error: 'Something went wrong' }
    expect(authReducer(stateWithError, clearError())).toEqual(initialState)
  })

  it('should set user on login fulfilled', () => {
    const action = { type: 'auth/login/fulfilled', payload: testUser }
    const state = authReducer(initialState, action)
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(testUser)
    expect(state.isLoading).toBe(false)
  })

  it('should clear user on logout fulfilled', () => {
    const loggedInState = {
      ...initialState,
      isAuthenticated: true,
      user: testUser,
    }
    const action = { type: 'auth/logout/fulfilled' }
    const state = authReducer(loggedInState, action)
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
  })
})
