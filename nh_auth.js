/*   NestHub franchise authentication*/
const SESSION_KEY='nesthub_session';
/*   Set to the exact URL of the cloned NestHub login endpoint after Xano setup*/
export const LOGIN_ENDPOINT='';
export function readNestHubSession(){
try{const value=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');return value&&typeof value.token==='string'&&value.token?value:null}catch{return null}
}
export function clearNestHubSession(){sessionStorage.removeItem(SESSION_KEY)}
export async function signInNestHub(email,password){
if(!LOGIN_ENDPOINT)throw new Error('NestHub login endpoint is not connected yet.');
const response=await fetch(LOGIN_ENDPOINT,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify({email,password})});
const data=await response.json().catch(()=>({}));
if(!response.ok)throw new Error(data.message||data.error||'Incorrect email or password.');
const token=data.authToken||data.auth_token||data.token;
const user=data.user||data.franchise_user||null;
if(!token||!user||!user.id||!user.franchise_id)throw new Error('Login response is missing the franchise identity or token.');
const session={token,user:{id:user.id,name:user.name||user.full_name||'',email:user.email||email,franchise_id:user.franchise_id}};
sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
return session;
}
