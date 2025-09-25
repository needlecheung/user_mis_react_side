import { useEffect, useState } from 'react'
import { getUsersFirstPage, type User } from './api'

export default function UsersPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [list, setList] = useState<User[]>([])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getUsersFirstPage()
        setList(data.content)
      } catch (e: any) {
        setError(e.message || '加载失败')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: 16 }}>
      <h2>用户管理（最小版）</h2>

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
    </div>
  )
}
