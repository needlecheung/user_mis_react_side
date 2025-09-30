// 用户对象
export interface User {
  id: number
  username: string
  email: string
  createdAt?: string
  updatedAt?: string
}

// 通用分页响应
export interface PageResp<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number   // 当前页（0 开始）
  size: number
}

const BASE = import.meta.env.VITE_API_BASE || '/api'

// 通用请求函数（带泛型）
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
  return res.json() as Promise<T>   // 明确返回泛型
}

// 获取用户（分页 + 搜索）
export function getUsers(page = 0, size = 10, q?: string) {
  const p = new URLSearchParams({ page: String(page), size: String(size) })
  if (q) p.set("q", q)
  return request<PageResp<User>>(`${BASE}/users?${p.toString()}`)
}

// 新增用户
export function createUser(body: { username: string; email: string; password: string }) {
  return request<User>(`${BASE}/users`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// 更新用户
export function updateUser(id: number, body: { username: string; email: string }) {
  return request<User>(`${BASE}/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

// 删除用户（后端返回 204 No Content）
export async function deleteUser(id: number): Promise<void> {
  const res = await fetch(`${BASE}/users/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  // 不要返回res.json()，因为后端没返回内容
}
