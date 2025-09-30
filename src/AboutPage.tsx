import { useUser } from "./UserContext"

export default function AboutPage() {
  const user = useUser()

  return (
    <div style={{ padding: 20 }}>
      <h2>About</h2>
      <p>This is a demo React app with routing.</p>
      {user && (
        <p>当前登录用户：{user.username} ({user.email})</p>
      )}
    </div>
  )
}
