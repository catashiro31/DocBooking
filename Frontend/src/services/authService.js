import api from "./api"

export const login = async(email, password) => { //hàm nhận emai, password gửi lên server
    const res = await api.post("/auth/signin", {
        email, password
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    // ĐÃ SỬA: refreshToken thay vì refeshToke
    localStorage.setItem("refreshToken", res.data.refreshToken); 
    return res.data;
}

export const logout = async() => {
    const refreshToken = localStorage.getItem("refreshToken") //yêu cầu refreshToken hủy token
    await api.post("/auth/signout", {refreshToken})
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
}

export const register = async(email, password, fullName, confirm, phoneNumber, role) => {
    const res = await api.post("/auth/signup", {
        email, password, fullName, confirm, phoneNumber, role
    })
    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refreshToken", res.data.refreshToken)
    return res.data
}