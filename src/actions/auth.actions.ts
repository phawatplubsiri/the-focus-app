'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { AuthActionResponse } from '@/types/auth'

export async function login(prevState: AuthActionResponse | null, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, success: null }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(prevState: AuthActionResponse | null, formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    if (error.message.toLowerCase().includes("already registered") || error.status === 422) {
      return { 
        error: "This Email is already in our system. Try Logging in instead.", 
        success: null 
      }
    }
    return { error: error.message, success: null }
  }

  // ดักจับกรณี "Fake Success" (เมื่อเปิด Prevent Account Enumeration ใน Dashboard)
  // ถ้าสมัครสำเร็จแต่ identities เป็น array ว่าง แปลว่ามีอีเมลนี้อยู่แล้ว
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { 
      error: "This Email is already in our system. Try Logging in instead.", 
      success: null 
    }
  }

  revalidatePath('/', 'layout')
  redirect(`/verify?email=${encodeURIComponent(email)}`)
}

export async function verifyOtp(prevState: AuthActionResponse | null, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const token = formData.get('token') as string

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'signup',
  })

  if (error) {
    return { error: error.message, success: null }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  
  const headerList = await headers()
  
  // ใช้ x-forwarded-host (Vercel ใส่ให้เสมอ) หรือ host header แทน origin ที่ไม่น่าเชื่อถือ
  const host = headerList.get('x-forwarded-host') || headerList.get('host') || 'localhost:3000'
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const origin = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`
  
  const redirectUrl = `${origin.replace(/\/$/, '')}/auth/callback`
  console.log("Supabase Auth Redirect URL:", redirectUrl)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })

  if (error) {
    redirect('/login?error=' + encodeURIComponent(error.message))
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function forgotPassword(prevState: AuthActionResponse | null, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?next=/reset-password`
  })

  if (error) {
    return { error: error.message, success: null }
  }

  return { error: null, success: 'Reset link sent! Please check your email.' }
}

export async function updatePassword(prevState: AuthActionResponse | null, formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string

  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message, success: null }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
