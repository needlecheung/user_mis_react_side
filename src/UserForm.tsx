import { useState } from "react"

interface Props {
  initial: { username: string; email: string; password?: string }
  editingId: number | null
  onCancel: () => void
  onSubmit: (data: { username: string; email: string; password?: string }) => void
}

export default function UserForm({ initial, editingId, onCancel, onSubmit }: Props) {
  const [form, setForm] = useState(initial)

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}
        style={{ background: "#fff", padding: 16, width: 400, borderRadius: 8 }}
      >
        <h3>{editingId ? "编辑用户" : "新增用户"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <label>
            用户名：
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </label>
          <label>
            邮箱：
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          {!editingId && (
            <label>
              初始密码：
              <input
                type="password"
                value={form.password || ""}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </label>
          )}
        </div>
        <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel}>取消</button>
          <button type="submit">保存</button>
        </div>
      </form>
    </div>
  )
}
