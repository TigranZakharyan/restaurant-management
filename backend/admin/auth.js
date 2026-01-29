import { Config } from '../core/config.js'

export const authenticate = async (email, password) => {
    if(email === Config.ADMIN_LOGIN && password === Config.ADMIN_PASSWORD)
        return { email: Config.ADMIN_LOGIN }
}
