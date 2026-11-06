import {supabase} from "./supabase.service.js";
import {getDemo,setDemo} from "./storage.service.js";
export async function getProfile(user){
 if(!user)return null;
 if(!supabase)return getDemo("profile",user);
 const {data,error}=await supabase.from("profiles").select("id,full_name,phone_number,email,role,is_verified,zune_id,vendor_code,account_status,created_at").eq("id",user.id).maybeSingle();
 if(error) throw error;
 return data || {id:user.id,full_name:user.user_metadata?.full_name||user.email, email:user.email,role:"buyer",account_status:"active"};
}
export async function updateProfile(userId,patch){
 if(!supabase){const old=getDemo("profile",{});const next={...old,...patch};setDemo("profile",next);return next;}
 const allowed={full_name:patch.full_name,phone_number:patch.phone_number};
 Object.keys(allowed).forEach(k=>allowed[k]===undefined&&delete allowed[k]);
 const {data,error}=await supabase.from("profiles").update(allowed).eq("id",userId).select().single();
 if(error) throw error;return data;
}