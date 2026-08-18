
const API_VERSION = "/api/v1"

export const API_ROUTES = {
    LOGIN: `${API_VERSION}/login`,
    VERIFY_OTP: `${API_VERSION}/verify-otp`,
    LOGOUT: `${API_VERSION}/logout`,

    SEND_OTP_REG: `${API_VERSION}/send-otp-reg`,
    VERIFY_OTP_REG: `${API_VERSION}/verify-otp-reg`,
    USERS: `${API_VERSION}/users`,
}