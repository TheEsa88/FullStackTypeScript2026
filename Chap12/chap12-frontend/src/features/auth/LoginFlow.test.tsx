// "Mocking the API layer": koko client-puolen kulku (lomake -> Redux -> navigointi)
// ilman käynnissä olevaa backendiä. Mock on verkkorajalla (api/endpoints).
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter, Routes, Route } from 'react-router'
import { configureStore } from '@reduxjs/toolkit'
import * as endpoints from '../../api/endpoints'
import authReducer from './authSlice'
import { LoginPage } from './LoginPage'

vi.mock('../../api/endpoints', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    refresh: vi.fn(),
    logout: vi.fn(),
  },
  postsApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
  },
}))

function renderLogin() {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: {
      auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
    },
  })
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<h1>Home page</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )
  return store
}

describe('Login flow (mocked API)', () => {
  it('logs in, updates Redux and navigates home', async () => {
    vi.mocked(endpoints.authApi.login).mockResolvedValue({
      user: { id: 1, email: 'jon@example.com', username: 'jon', role: 'USER' },
      accessToken: 'fake-token',
    })
    const store = renderLogin()

    await userEvent.type(screen.getByPlaceholderText('Email'), 'jon@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Home page')).toBeInTheDocument()
    expect(store.getState().auth.isAuthenticated).toBe(true)
    expect(store.getState().auth.user?.username).toBe('jon')
  })

  it('shows the server error on failed login', async () => {
    vi.mocked(endpoints.authApi.login).mockRejectedValue(
      new Error('Invalid email or password'),
    )
    renderLogin()

    await userEvent.type(screen.getByPlaceholderText('Email'), 'jon@example.com')
    await userEvent.type(screen.getByPlaceholderText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /log in/i }))

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
  })
})
