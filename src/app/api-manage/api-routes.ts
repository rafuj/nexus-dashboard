
const API_VERSION = "/api/v1"

export const API_ROUTES = {
    // AUTH ROUTES
    LOGIN: `${API_VERSION}/login`,
    VERIFY_OTP: `${API_VERSION}/verify-otp`,
    LOGOUT: `${API_VERSION}/logout`,

    SEND_OTP_REG: `${API_VERSION}/send-otp-reg`,
    VERIFY_OTP_REG: `${API_VERSION}/verify-otp-reg`,
    USERS: `${API_VERSION}/users`,
    USERS_ME: `${API_VERSION}/users/me`,
    USERS_ROLES: `${API_VERSION}/users/roles`,
    
    // CABINETS
    CABINETS: `${API_VERSION}/cabinets`,
    SMART_CABINETS: `${API_VERSION}/cabinets/smart`,
    ASSET_TYPES: `${API_VERSION}/asset-types`,
    ASSETS: `${API_VERSION}/assets`,
    COMPONENT_TYPES: `${API_VERSION}/component-types`,
    CABINETS_INVENTORY: `${API_VERSION}/cabinets/inventory`,
    DEVICES: `${API_VERSION}/devices`,
    DEVICE_INSTALLATION: `${API_VERSION}/device-installations`,
    CABINET_BRANDS: `${API_VERSION}/cabinet-models/brands`,
    CABINET_MODELS: `${API_VERSION}/cabinet-models`,
    CABINET_CITIES: `${API_VERSION}/cabinets/cities`,
    SERIAL_CHECK: `${API_VERSION}/cabinets/serial-check`,
    IMEI_CHECK: `${API_VERSION}/devices/imei-check`,
    // dashboard
    DASHBOARD: `${API_VERSION}/dashboard/overview`,

}