import { useEffect, useState } from 'react'
import { getUsers, type User } from './api'

export default function UsersPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [list, setList] = useState<User[]>([])
  const [q, setQ] = useState<string>("")

  // 分页相关状态
  const [page, setPage] = useState<number>(0)     // 后端页码从 0 开始
  const [size, setSize] = useState<number>(10)    // 每页条数
  const [total, setTotal] = useState<number>(0)   // 总条数（来自后端 totalElements）

  // 计算总页数
  const totalPages = Math.max(1, Math.ceil(total / size))

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
  }, [page, size, q])   // 当 页码、每页条数、搜索关键字 改变时都会重新执行

  
  return (
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
      </div>

      {loading && <div>加载中...</div>}
      {error && <div style={{ color: 'red' }}>错误：{error}</div>}

      <table width="100%" cellPadding={8} style={{ borderCollapse: 'collapse', background: '#fff' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #eee' }}>ID</th>
            <th style={{ border: '1px solid #eee' }}>用户名</th>
            <th style={{ border: '1px solid #eee' }}>邮箱</th>
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id}>
              <td style={{ border: '1px solid #eee' }}>{u.id}</td>
              <td style={{ border: '1px solid #eee' }}>{u.username}</td>
              <td style={{ border: '1px solid #eee' }}>{u.email}</td>
            </tr>
          ))}
          {list.length === 0 && !loading && !error && (
            <tr><td colSpan={3} style={{ textAlign: 'center', padding: 16 }}>暂无数据</td></tr>
          )}
        </tbody>
      </table>

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

    </div>
  )
}
