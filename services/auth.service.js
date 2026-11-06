import {supabase} from "./supabase.service.js";
import {getDemo, setDemo, clearDemo} from "./storage.service.js";
export async function getSession(){
  if(!supabase) return getDemo("session",null);
  const {data,error}=await supabase.auth.getSession(); if(error) throw error; return data.session;
}
export async function signUp({fullName,email,phone,password}){
  if(!supabase){const user={id:"demo-"+Date.now(),email,full_name:fullName,phone_number:phone,role:"buyer",is_verified:false,account_status:"active"};setDemo("session",{user});setDemo("profile",user);return {user,session:{user}};}
  const {data,error}=await supabase.auth.signUp({email,password,options:{data:{full_name:fullName,phone_number:phone}}});
  if(error) throw error; return data;
}
export async function signIn({email,password}){
  if(!supabase){const user={id:"demo-"+Date.now(),email,full_name:email.split("@")[0],role:"buyer",account_status:"active"};setDemo("session",{user});setDemo("profile",user);return {user};}
  const {data,error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;return data;
}
export async function signOut(){if(supabase){const {error}=await supabase.auth.signOut();if(error)throw error;}clearDemo("session");clearDemo("profile");}
export async function resetPassword(email){if(!supabase) return true;const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname+"#/account"});if(error)throw error;return true;}
export function onAuthChange(callback){if(!supabase)return ()=>{};const {data}=supabase.auth.onAuthStateChange((_event,session)=>callback(session));return ()=>data.subscription.unsubscribe();}