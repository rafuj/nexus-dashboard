
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
    SMART_CABINETS: `${API_VERSION}/cabinets/monitor`,
    ASSET_TYPES: `${API_VERSION}/asset-types`,
    ASSETS: `${API_VERSION}/assets`,
    COMPONENT_TYPES: `${API_VERSION}/component-types`,
    CABINETS_INVENTORY: `${API_VERSION}/cabinets/inventory`,
    CABINET_BRANDS: `${API_VERSION}/cabinet-models/brands`,
    CABINET_MODELS: `${API_VERSION}/cabinet-models`,
    CABINET_CITIES: `${API_VERSION}/cabinets/cities`,
    SERIAL_CHECK: `${API_VERSION}/cabinets/serial-check`,
    // dashboard
    DASHBOARD: `${API_VERSION}/dashboard/overview`,
    
    // factory
    AVAILABLE_SERIAL_NUMBERS: `${API_VERSION}/factory/serial-numbers/available`,
    FACTORY_LOGS: `${API_VERSION}/factory/processed-units`,
    
    // devices
    DEVICE_MODELS: `${API_VERSION}/device-models`,
    DEVICES_INVENTORY: `${API_VERSION}/devices/inventory`,
    
    // device
    DEVICE_INSTALLATION: `${API_VERSION}/device-installations/factory`,
    DEVICES_IMEI_LINK: `${API_VERSION}/devices/imei-link`,
    DEVICES_RESERVE: `${API_VERSION}/devices/reserve`,
    IMEI_CHECK: `${API_VERSION}/devices/serial-check`,

    // activity
    ACTIVITY_TYPES: `${API_VERSION}/activity-types`,
    ACTIVITIES: `${API_VERSION}/activities`
}