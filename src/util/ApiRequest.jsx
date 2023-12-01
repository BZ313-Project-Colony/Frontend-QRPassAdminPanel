import axios from "axios";
import httpStatus from "http-status";

async function apiRequest(path, method, data, onSuccess, onFailure) {
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
        onFailure(httpStatus[error.response.status], error.response.status);
    }
}

export default apiRequest