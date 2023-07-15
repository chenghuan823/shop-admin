import { useCookies } from '@vueuse/integrations/useCookies'
const TokenKey="admin-token"
const TabList='tabList'
const cookies = useCookies()

export function setToken(token){
    return cookies.set(TokenKey,token)
}
export function getToken(){
    return cookies.get(TokenKey)
}
export function removeToken(){
    cookies.remove(TokenKey)
    cookies.remove(TabList)
}