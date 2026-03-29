import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading, isAuthenticated } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div>Đang tải...</div>
            </div>
        )
    }

    if (!isAuthenticated()) {
        return <Navigate to="/signin" state={{ from: location }} replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />
    }

    return children
}

export default ProtectedRoute
