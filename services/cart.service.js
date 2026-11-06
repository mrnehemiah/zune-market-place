import {supabase} from "./supabase.service.js";
import {listDemo,setDemo} from "./storage.service.js";
export async function getCart(userId){
 if(!supabase)return listDemo("cart");
 const {data,error}=await supabase.from("cart_items").select("id,user_id,product_id,quantity,products(id,title,price,image_url,stock_quantity,vendor_id)").eq("user_id",userId).order("created_at",{ascending:false});if(error)throw error;return data||[];
}
export async function addToCart(userId,productId){
 if(!supabase){const rows=listDemo("cart");const found=rows.find(x=>x.product_id===productId);if(found)found.quantity++;else rows.push({id:"local-"+Date.now(),product_id:productId,quantity:1});setDemo("cart",rows);return rows;}
 const {data:found}=await supabase.from("cart_items").select("id,quantity").eq("user_id",userId).eq("product_id",productId).maybeSingle();
 if(found){const {error}=await supabase.from("cart_items").update({quantity:found.quantity+1}).eq("id",found.id);if(error)throw error;}
 else{const {error}=await supabase.from("cart_items").insert({user_id:userId,product_id:productId,quantity:1});if(error)throw error;}return true;
}
export async function removeCartItem(id,userId){if(!supabase){setDemo("cart",listDemo("cart").filter(x=>x.id!==id));return true;}const {error}=await supabase.from("cart_items").delete().eq("id",id).eq("user_id",userId);if(error)throw error;return true;}
export async function clearCart(userId){if(!supabase){setDemo("cart",[]);return true;}const {error}=await supabase.from("cart_items").delete().eq("user_id",userId);if(error)throw error;return true;}