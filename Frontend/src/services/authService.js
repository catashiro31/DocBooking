import api from "./api"

export const login = async(email, password) => {
    const res = await api.post("/auth/signin", {
        email, password
    });
    const token = res.data.token;
    localStorage.setItem("token", token); 
    return res.data;
}

export const logout = async() => {
    const token = localStorage.getItem("token")
    await api.post("/auth/signout", {token})
    localStorage.removeItem("token")
}

export const register = async(email, password, fullName, confirm, phoneNumber, role) => {
    const res = await api.post("/auth/signup", {
        email, password, fullName, confirm, phoneNumber, role
    })
    return res.data
}