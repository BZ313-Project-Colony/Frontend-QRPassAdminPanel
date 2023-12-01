import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoutes = () => {
    const { authToken } = useAuth()
    return (
        authToken ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateRoutes