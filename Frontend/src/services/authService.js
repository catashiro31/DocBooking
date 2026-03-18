import api from "./api"

export const login = async (email, password) => { 
    const res = await api.post("/auth/signin", {
        email, password
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    // ĐÃ SỬA: refreshToken thay vì refeshToke
    localStorage.setItem("refreshToken", res.data.refreshToken); 
    return res.data;
}

export const logout = async () => {
    // ĐÃ SỬA: refreshToken
    const refreshToken = localStorage.getItem("refreshToken"); 
    // Gửi đúng tên trường refreshToken lên cho Spring Boot
    await api.post("/auth/signout", { refreshToken }); 
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
}

export const register = async (email, password, fullName, phoneNumber, role) => { 
    const res = await api.post("/auth/signup", {
        email, password, fullName, phoneNumber
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    // ĐÃ SỬA: refreshToken thay vì refeshToke
    localStorage.setItem("refreshToken", res.data.refreshToken); 
    return res.data;
}