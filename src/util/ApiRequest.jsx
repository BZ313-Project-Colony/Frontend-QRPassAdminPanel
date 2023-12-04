import axios from "axios";
import httpStatus from "http-status";
import { useAuth } from "../context/AuthContext";

async function ApiRequest(method, path, data, onSuccess, onFailure) {
    let endpoint = `${process.env.REACT_APP_QR_PASS_API_URL}${path}`
    let bearerToken = localStorage.getItem('authToken')
    try {
        const response = await axios({
            method: method,
            url: endpoint,
            data: data,
            headers: bearerToken ? {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json'
            } : null
        });
        onSuccess(response.data)
        console.log(response.data);
    } catch (error) {
        console.error('Server responded with an error:', error.response.data);
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
        if (error.response.status == 401) {
            onFailure(error.response.status, "Giriş kimliğinizin süresi doldu! Yeniden giriş yapmanı gerekli!");
        } else onFailure(error.response.status, httpStatus[error.response.status]);
    }
}

export default ApiRequest