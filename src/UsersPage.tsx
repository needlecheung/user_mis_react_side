import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, deleteUser, type User } from './api'
import UserTable from "./UserTable"
import UserForm from "./UserForm"

export default function UsersPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [list, setList] = useState<User[]>([])
  const [q, setQ] = useState<string>("")
  const [refresh, setRefresh] = useState<number>(0)   // 用于新增、修改、删除后自动刷新页面

  // 分页相关状态
  const [page, setPage] = useState<number>(0)     // 后端页码从 0 开始
  const [size, setSize] = useState<number>(10)    // 每页条数
  const [total, setTotal] = useState<number>(0)   // 总条数（来自后端 totalElements）

  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(total / size))

  // 控制弹层表单
  const [showForm, setShowForm] = useState<boolean>(false)
  // 表单字段
  const [form, setForm] = useState<{ username: string; email: string; password: string }>({
    username: "",
    email: "",
    password: ""
  })

  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUsers(page, size, q.trim() || undefined) // ← 传递 page/size/q
        setList(data.content)
        setTotal(data.totalElements)                                   // ← 保存总条数
      } catch (e: any) {
        setError(e.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [page, size, q, refresh])   // 当 页码、每页条数、搜索关键字、refresh值 改变时都会重新执行

  
  return (// 这里和flutter太像了，语法也类似，只是关键字等不同而已，思想和原理是一样的，就是返回一个界面。
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 16 }}>
      <h2>用户管理（最小版）</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          placeholder="Search by username or email"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(0) }}   // 搜索关键字改变时，设置为第1页，防止不改变页码，比如此时是第5页，那很可能是没有搜索结果的。
          style={{ padding: "6px 8px", marginRight: 8 }}
        />

        <button onClick={() => { /* 手动触发搜索时什么也不用做，因为 q 已经绑定了 */ }}>
          Search
        </button>
        <button onClick={() => { setForm({ username: "", email: "", password: "" }); setShowForm(true) }}>
          新增用户
        </button>

      </div>

      {loading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>错误：{error}</div>}

      <UserTable
        list={list}
        onEdit={(u) => {
          setEditingId(u.id)
          setForm({ username: u.username, email: u.email, password: "" })
          setShowForm(true)
        }}
        onDelete={async (u) => {
          if (window.confirm(`确定要删除用户 ${u.username} 吗？`)) {
            await deleteUser(u.id)
            setRefresh(r => r + 1)
          }
        }}
      />

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12 }}>
        <button disabled={page <= 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
          上一页
        </button>
        <span>第 {page + 1} / {totalPages} 页</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(p => p + 1)}>
          下一页
        </button>

        <span style={{ marginLeft: 12 }}>每页</span>
        <select
          value={size}
          onChange={(e) => { setSize(Number(e.target.value)); setPage(0) }} // 改每页条数后，回到第 1 页
        >
          {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <span>条，共 {total} 条</span>
      </div>

      {showForm && (
        <UserForm
          initial={form}
          editingId={editingId}
          onCancel={() => setShowForm(false)}
          onSubmit={async (data) => {
            if (editingId) {
              await updateUser(editingId, { username: data.username, email: data.email })
            } else {
              await createUser(data)
            }
            setShowForm(false)
            setEditingId(null)
            setRefresh(r => r + 1)
          }}
        />
      )}

    </div>
  )
}
