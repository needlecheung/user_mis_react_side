import { BrowserRouter, Routes, Route, Link } from "react-router-dom"
import UsersPage from "./UsersPage"
import AboutPage from "./AboutPage"
import UserContext from "./UserContext"

export default function App() {
  const currentUser = { username: "admin", email: "admin@test.com" }

  return (
    <UserContext.Provider value={currentUser}>
      <BrowserRouter>
        <div style={{ padding: 20 }}>
          {/* 导航菜单 */}
          <nav style={{ marginBottom: 20 }}>
            <Link to="/users" style={{ marginRight: 12 }}>Users</Link>
            <Link to="/about">About</Link>
            <span style={{ marginLeft: 20 }}>
              欢迎 {currentUser.username}
            </span>
          </nav>

          {/* 路由配置 */}
          <Routes>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/about" element={<AboutPage />} />
          {/* 默认跳转到 /users */}
            <Route path="*" element={<UsersPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  )
}
