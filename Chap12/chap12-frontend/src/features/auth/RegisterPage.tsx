// src/features/auth/RegisterPage.tsx
// Kirja näyttää vain action handlerin; muu rakenne kuten LoginPagessa.
import { useActionState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { register } from './authSlice'
import { useNavigate, Link } from 'react-router'

export function RegisterPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { error } = useAppSelector((state) => state.auth)

  const [, submitAction, isPending] = useActionState(
    async (_prev: null, formData: FormData) => {
      const email = formData.get('email') as string
      const password = formData.get('password') as string
      const username = formData.get('username') as string
      const result = await dispatch(register({ email, password, username }))
      if (register.fulfilled.match(result)) {
        navigate('/', { replace: true })
      }
      return null
    },
    null,
  )

  return (
    <form action={submitAction}>
      <h1>Register</h1>
      {error && <p className="error">{error}</p>}
      <input name="username" placeholder="Username" minLength={2} required />
      <input name="email" type="email" placeholder="Email" required />
      {/* Sama sääntö kuin backendin Zod-skeemassa: 8-128 merkkiä (UX, ei tietoturva) */}
      <input
        name="password"
        type="password"
        placeholder="Password (min 8 characters)"
        minLength={8}
        maxLength={128}
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </button>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
  )
}
