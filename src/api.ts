export type User = {
  id: number
  username: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export type PageResp<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number   // 当前页（0 开始）
  size: number
}

const BASE = import.meta.env.VITE_API_BASE || '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      msg = (j && (j.message || j.error)) || msg
    } catch {}
    throw new Error(msg)
  }
  return res.json()
}

// 仅用于本步：固定 page=0 size=10
export function getUsersFirstPage() {
  return request<PageResp<User>>(`${BASE}/users?page=0&size=10`)
}
