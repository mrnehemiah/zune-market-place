import {supabase} from "./supabase.service.js";
import {listDemo,setDemo} from "./storage.service.js";
const demoProducts=[
{id:"d1",title:"Smartphone Android 128GB",description:"Simu ya kisasa yenye kamera nzuri, battery imara na storage ya 128GB.",price:450000,stock_quantity:8,category:"Simu na Accessories",image_url:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900",vendor_id:"store1",store_name:"Mlimani Digital",verified:true,is_featured:true},
{id:"d2",title:"Sneakers Premium",description:"Viatu vya mtindo na ubora kwa matumizi ya kila siku.",price:65000,stock_quantity:15,category:"Fashion",image_url:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",vendor_id:"store2",store_name:"Urban Wear",verified:true,is_deal:true},
{id:"d3",title:"Headphones Wireless",description:"Sauti safi, comfort na battery ya muda mrefu.",price:85000,stock_quantity:12,category:"Electronics",image_url:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",vendor_id:"store1",store_name:"Mlimani Digital",verified:true},
{id:"d4",title:"Smart Watch Series",description:"Smart watch yenye health tracking na notifications.",price:120000,stock_quantity:6,category:"Electronics",image_url:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",vendor_id:"store3",store_name:"Tech Zone",verified:false},
{id:"d5",title:"Kiti cha Kisasa",description:"Kiti cha nyumbani chenye muundo safi na comfort.",price:185000,stock_quantity:4,category:"Furniture",image_url:"https://images.unsplash.com/photo-1503602642458-232111445657?w=900",vendor_id:"store4",store_name:"Home Style",verified:false},
{id:"d6",title:"Skincare Essentials",description:"Seti ya skincare kwa matumizi ya kila siku.",price:42000,stock_quantity:20,category:"Beauty",image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=900",vendor_id:"store5",store_name:"Glow Shop",verified:true}
];
export async function getProducts({search="",category="",limit=40}={}){
 if(!supabase){let rows=listDemo("products");if(!rows.length)rows=demoProducts;return rows.filter(p=>(!category||p.category===category)&&(!search||(p.title+" "+p.description+" "+p.category).toLowerCase().includes(search.toLowerCase()))).slice(0,limit);}
 let q=supabase.from("products").select("id,vendor_id,title,description,price,stock_quantity,image_url,created_at,category,is_featured,is_deal,discount_percent,image_urls").gt("stock_quantity",0).order("created_at",{ascending:false}).limit(limit);
 if(category)q=q.eq("category",category);if(search)q=q.ilike("title",`%${search}%`);
 const {data,error}=await q;if(error)throw error;
 const ids=[...new Set((data||[]).map(p=>p.vendor_id).filter(Boolean))];
 let profiles={};if(ids.length){const {data:owners}=await supabase.from("profiles").select("id,full_name,role,is_verified,vendor_code").in("id",ids);(owners||[]).forEach(p=>profiles[p.id]=p);}
 return (data||[]).map(p=>({...p,store_name:profiles[p.vendor_id]?.full_name||"Duka la ZUNE",verified:profiles[p.vendor_id]?.role==="vendor" && !!profiles[p.vendor_id]?.is_verified}));
}
export async function getProduct(id){const all=await getProducts({limit:100});return all.find(p=>String(p.id)===String(id))||null;}
export async function createProduct(userId,product){
 if(!supabase){const rows=listDemo("products");const item={...product,id:"local-"+Date.now(),vendor_id:userId,verified:false,store_name:"Duka Langu"};setDemo("products",[item,...rows]);return item;}
 const payload={vendor_id:userId,title:product.title,description:product.description,price:Number(product.price),stock_quantity:Number(product.stock_quantity),image_url:product.image_url||null,category:product.category||"Vingine"};
 const {data,error}=await supabase.from("products").insert(payload).select().single();if(error)throw error;return data;
}
export async function deleteProduct(id,userId){
 if(!supabase){setDemo("products",listDemo("products").filter(p=>p.id!==id));return true;}
 const {error}=await supabase.from("products").delete().eq("id",id).eq("vendor_id",userId);if(error)throw error;return true;
}