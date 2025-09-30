
import { createContext, useContext } from "react"

interface CurrentUser {
  username: string
  email: string
}

// 默认值（可以是空）
const UserContext = createContext<CurrentUser | null>(null)

// 提供一个 Hook，简化调用
export function useUser() {
  return useContext(UserContext)
}

export default UserContext
