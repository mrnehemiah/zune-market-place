import {supabase} from "./supabase.service.js";import {listDemo} from "./storage.service.js";
export async function getNotifications(userId){if(!supabase)return listDemo("notifications");const {data,error}=await supabase.from("announcements").select("*").order("created_at",{ascending:false}).limit(30);if(error)return [];return data||[];}
export async function markNotificationRead(id){return true;}