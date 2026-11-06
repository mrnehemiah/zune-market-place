import {supabase} from "./supabase.service.js";import {listDemo,setDemo} from "./storage.service.js";
export async function getConversations(userId){if(!supabase)return listDemo("conversations");const {data,error}=await supabase.from("chat_conversations").select("id,buyer_id,seller_id,product_id,created_at,updated_at,chat_messages(id,message,sender_id,created_at,is_read)").or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).order("updated_at",{ascending:false});if(error)throw error;return data||[];}
export async function sendMessage(userId,conversationId,message){if(!supabase){const rows=listDemo("messages");rows.push({id:"local-"+Date.now(),conversation_id:conversationId,sender_id:userId,message,created_at:new Date().toISOString()});setDemo("messages",rows);return true;}const {error}=await supabase.from("chat_messages").insert({conversation_id:conversationId,sender_id:userId,message});if(error)throw error;return true;}
export async function startConversation(userId,sellerId,productId,message){if(!supabase){const rows=listDemo("conversations");let c=rows.find(x=>x.seller_id===sellerId&&x.product_id===productId);if(!c){c={id:"local-"+Date.now(),buyer_id:userId,seller_id:sellerId,product_id:productId};rows.unshift(c);setDemo("conversations",rows);}await sendMessage(userId,c.id,message);return c;}
 const {data:existing}=await supabase.from("chat_conversations").select("id").eq("buyer_id",userId).eq("seller_id",sellerId).eq("product_id",productId).maybeSingle();
 let conversation=existing;if(!conversation){const {data,error}=await supabase.from("chat_conversations").insert({buyer_id:userId,seller_id:sellerId,product_id:productId}).select().single();if(error)throw error;conversation=data;}
 await sendMessage(userId,conversation.id,message);return conversation;
}
export async function getConversationMessages(conversationId){
 if(!supabase)return listDemo("messages").filter(m=>m.conversation_id===conversationId);
 const {data,error}=await supabase.from("chat_messages").select("id,conversation_id,sender_id,message,image_url,is_read,created_at").eq("conversation_id",conversationId).order("created_at",{ascending:true});
 if(error)throw error;return data||[];
}
