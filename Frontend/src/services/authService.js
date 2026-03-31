import api from "./api"

/**
 * Đăng nhập
 * POST /auth/signin → { token, message }
 * Sau đó gọi /user/profile để lấy thông tin user
 */
export const login = async (email, password) => {
  const res = await api.post("/auth/signin", { email, password })
  const { token } = res.data

  // Lưu token
  localStorage.setItem("accessToken", token)

  // Gọi API lấy thông tin user
  const userInfo = await fetchUserProfile()

  return { token, user: userInfo }
}

/**
 * Đăng ký
 * POST /auth/signup → String message
 * Backend yêu cầu verify email trước khi login → KHÔNG auto-login
 */
export const register = async ({ email, password, fullName, phoneNumber, role }) => {
  const res = await api.post("/auth/signup", {
    email,
    password,
    fullName,
    phoneNumber,
    role
  })
  return res.data // String: "Vui lòng kiểm tra email để xác thực tài khoản!"
}

/**
 * Đăng xuất 
 * POST /auth/signout — chỉ cần Bearer token trong header (api.js interceptor tự thêm)
 */
export const logout = async () => {
  try {
    await api.post("/auth/signout")
  } catch (e) {
    // Nếu token đã hết hạn vẫn cho logout ở client
    console.warn("Logout API failed:", e)
  }
  localStorage.removeItem("accessToken")
  localStorage.removeItem("user")
}

/**
 * Quên mật khẩu
 * POST /auth/forgot-password?email=xxx → String message
 */
export const forgotPassword = async (email) => {
  const res = await api.post(`/auth/forgot-password?email=${encodeURIComponent(email)}`)
  return res.data // String: "Mật khẩu mới đã được gửi đến email của bạn!"
}

/**
 * Xác thực tài khoản qua email
 * GET /auth/verify?email=xxx&code=yyy → String message
 */
export const verifyAccount = async (email, code) => {
  const res = await api.get("/auth/verify", {
    params: { email, code }
  })
  return res.data // "Xác thực tài khoản thành công!"
}

/**
 * Lấy thông tin profile user đang login
 * GET /user/profile → { email, fullName, phoneNumber, avatarUrl }
 */
export const fetchUserProfile = async () => {
  try {
    const res = await api.get("/user/profile")
    const profile = res.data

    // Parse JWT để lấy userId
    const token = localStorage.getItem("accessToken")
    const payload = parseJwt(token)

    const user = {
      userId: payload?.sub,
      email: profile.email,
      fullName: profile.fullName,
      phoneNumber: profile.phoneNumber,
      avatarUrl: profile.avatarUrl,
      role: profile.role || null,
    }

    localStorage.setItem("user", JSON.stringify(user))
    return user
  } catch (e) {
    console.error("Không thể lấy thông tin user:", e)
    return null
  }
}

/**
 * Parse JWT token để lấy payload (không verify signature ở client)
 */
export const parseJwt = (token) => {
  if (!token) return null
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Lấy user hiện tại từ localStorage
 */
export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("user")
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * Kiểm tra đã đăng nhập chưa (token còn hạn)
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken")
  if (!token) return false

  const payload = parseJwt(token)
  if (!payload || !payload.exp) return false

  // Kiểm tra token hết hạn chưa
  return Date.now() < payload.exp * 1000
}