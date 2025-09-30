import { type User } from "./api"

interface Props {
  list: User[]
  onEdit: (u: User) => void
  onDelete: (u: User) => void
}

export default function UserTable({ list, onEdit, onDelete }: Props) {
  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #eee' }}>ID</th>
          <th style={{ border: '1px solid #eee' }}>Username</th>
          <th style={{ border: '1px solid #eee' }}>Email</th>
          <th style={{ border: '1px solid #eee' }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {list.map((u) => (
          <tr key={u.id}>
            <td style={{ border: '1px solid #eee' }}>{u.id}</td>
            <td style={{ border: '1px solid #eee' }}>{u.username}</td>
            <td style={{ border: '1px solid #eee' }}>{u.email}</td>
            <td style={{ border: '1px solid #eee' }}>
              <button onClick={() => onEdit(u)}>编辑</button>
              <button style={{ marginLeft: 8 }} onClick={() => onDelete(u)}>删除</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
