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
    const refeshToke = localStorage.getItem("refeshToken") //yêu cầu refechToken hủy token
    await api.post("/auth/sigout", {refeshToke})
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refeshToken")
}

export const register = async(email, password, fullName, confirm, phone, role) => { //hàm gửi emai, password,... gửi lên server
    const res = await api.post("/auth/signup", {
        email, password, fullName, confirm, phone, role
    })
    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refeshToken", res.data.refeshToke)
    return res.data
}