import api from "./api"

export const login = async(email, password) => { //hàm nhận emai, password gửi lên server
    const res = await api.post("/signin", {
        email, password
    })
    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refeshToken", res.data.refeshToke)
    return res.data
}

export const logout = async() => {
    const refeshToke = localStorage.getItem("refeshToken") //yêu cầu refechToken hủy token
    await api.post("/sigout", {refeshToke})
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refeshToken")
}

export const register = async(email, password, fullName, confirm, phone, role) => { //hàm gửi emai, password,... gửi lên server
    const res = await api.post("/signup", {
        email, password, fullName, confirm, phone, role
    })
    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refeshToken", res.data.refeshToke)
    return res.data
}