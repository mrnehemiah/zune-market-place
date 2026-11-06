import {supabase} from "./supabase.service.js";
import {getDemo,setDemo} from "./storage.service.js";
export async function getSellerApplication(userId){
 if(!supabase)return getDemo("sellerApplication:"+userId,null);
 const {data,error}=await supabase.from("seller_applications").select("*").eq("user_id",userId).order("created_at",{ascending:false}).limit(1).maybeSingle();if(error)throw error;return data;
}
export async function submitSellerApplication(userId,form){
 const payload={user_id:userId,store_name:form.store_name,owner_name:form.owner_name,phone:form.phone,country:"Tanzania",city:form.city,region:form.region,district:form.district,address:form.address,street:form.street,email:form.email,category:form.category,business_name:form.business_name||form.store_name,tin_number:form.tin_number||null,id_type:form.id_type||null,id_number:form.id_number||null,status:"pending"};
 if(!supabase){setDemo("sellerApplication:"+userId,{...payload,id:"local-"+Date.now(),created_at:new Date().toISOString()});return getDemo("sellerApplication:"+userId,null);}
 const {data,error}=await supabase.from("seller_applications").insert(payload).select().single();if(error)throw error;return data;
}