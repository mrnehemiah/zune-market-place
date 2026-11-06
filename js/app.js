import {header,bottomNav,footer} from "../components/layout.js";
import {toast,refreshIcons,modal,icon,escapeHTML,money} from "../components/ui.js";
import {homePage} from "../pages/home.page.js";
import {categoriesPage} from "../pages/categories.page.js";
import {authPage} from "../pages/auth.page.js";
import {accountPage} from "../pages/account.page.js";
import {sellerApplyPage} from "../pages/seller-apply.page.js";
import {sellerCenterPage} from "../pages/seller-center.page.js";
import {cartPage} from "../pages/cart.page.js";
import {checkoutPage} from "../pages/checkout.page.js";
import {ordersPage} from "../pages/orders.page.js";
import {wishlistPage} from "../pages/wishlist.page.js";
import {profileEditPage} from "../pages/profile-edit.page.js";
import {notificationsPage} from "../pages/notifications.page.js";
import {messagesPage} from "../pages/messages.page.js";
import {aiPage} from "../pages/ai.page.js";
import {productPage} from "../pages/product.page.js";
import {verificationPage} from "../pages/verification.page.js";
import {helpPage} from "../pages/help.page.js";
import {legalPage} from "../pages/legal.page.js";
import {getSession,signUp,signIn,signOut,resetPassword,onAuthChange} from "../services/auth.service.js";
import {getProfile,updateProfile} from "../services/profile.service.js";
import {getProducts,getProduct,createProduct,deleteProduct} from "../services/products.service.js";
import {getSellerApplication,submitSellerApplication} from "../services/seller.service.js";
import {getCart,addToCart,removeCartItem,clearCart} from "../services/cart.service.js";
import {getWishlist,toggleWishlist} from "../services/wishlist.service.js";
import {getOrders,placeOrder} from "../services/orders.service.js";
import {getConversations,startConversation,getConversationMessages,sendMessage} from "../services/messaging.service.js";
import {getNotifications} from "../services/notifications.service.js";
import {askZuneAI} from "../services/ai.service.js";
import {joinChannel,contactSupport} from "../services/whatsapp.service.js";

const state={session:null,user:null,profile:null,application:null,products:[],cart:[],wishlist:[],orders:[],conversations:[],notifications:[],route:"home",search:"",category:"",authMode:"login"};
const app=document.querySelector("#app");
const route=()=>{const raw=location.hash.replace(/^#\/?/,"")||"home";const [name,param]=raw.split("/");return {name:name||"home",param};};
const go=(name,param="")=>{location.hash=`/${name}${param?"/"+encodeURIComponent(param):""}`;};
const currentUser=()=>state.session?.user||state.user;
async function loadUser(){
 try{state.session=await getSession();state.user=state.session?.user||null;state.profile=state.user?await getProfile(state.user):null;state.application=state.user?await getSellerApplication(state.user.id):null;}
 catch(e){console.warn(e);state.profile=state.user?{id:state.user.id,full_name:state.user.email,role:"buyer",account_status:"active"}:null;}
}
async function loadCore(){
 try{state.products=await getProducts({search:state.search,category:state.category,limit:60});}catch(e){console.warn("products",e);state.products=[];}
 if(state.user){const jobs=await Promise.allSettled([getCart(state.user.id),getWishlist(state.user.id),getOrders(state.user.id,state.profile?.role==="vendor"?"vendor":"buyer"),getConversations(state.user.id),getNotifications(state.user.id)]);[state.cart,state.wishlist,state.orders,state.conversations,state.notifications]=jobs.map((j)=>j.status==="fulfilled"?j.value:[]);}
 else {const rawCart=JSON.parse(localStorage.getItem("zune:cart")||"[]");state.cart=rawCart.map(x=>({...x,product:state.products.find(p=>String(p.id)===String(x.product_id))})).filter(x=>x.product);state.wishlist=JSON.parse(localStorage.getItem("zune:wishlist")||"[]");}
}
function resolveProduct(id){return state.products.find(p=>String(p.id)===String(id));}
function cartCount(){return state.cart.reduce((n,x)=>n+(x.quantity||1),0);}
function navRoute(name){if(name==="seller-center"&&state.profile?.role!=="vendor"){toast("Seller Center hufunguliwa baada ya idhini ya ZUNE.","error");go("seller-apply");return;}if(["orders","wishlist","messages","profile-edit","verification","notifications","seller-apply","seller-center","checkout"].includes(name)&&!state.user){toast("Ingia kwanza ili kuendelea.");go("login");return;}go(name);}
function render(){
 const r=route();state.route=r.name;
 let content="";
 switch(r.name){
 case "home":content=homePage(state.products);break;
 case "categories":content=categoriesPage(state.products,state.category);break;
 case "login":content=authPage("login");break;
 case "signup":content=authPage("signup");break;
 case "account":content=accountPage(state.user,state.profile,state.application);break;
 case "seller-apply":content=sellerApplyPage(state.application);break;
 case "seller-center":content=state.profile?.role==="vendor"?sellerCenterPage(state.products.filter(p=>p.vendor_id===state.user?.id),state.orders,state.profile):sellerApplyPage(state.application);break;
 case "cart":content=cartPage(state.cart);break;
 case "checkout":content=checkoutPage(state.cart);break;
 case "orders":content=ordersPage(state.orders);break;
 case "wishlist":{const ids=state.wishlist.map(x=>x.product_id);content=wishlistPage(state.products.filter(p=>ids.includes(p.id)||ids.includes(String(p.id))));break;}
 case "profile-edit":content=profileEditPage(state.profile);break;
 case "notifications":content=notificationsPage(state.notifications);break;
 case "messages":content=messagesPage(state.conversations);break;
 case "ai":content=aiPage();break;
 case "product":content=productPage(resolveProduct(decodeURIComponent(r.param)));break;
 case "verification":content=verificationPage(state.profile);break;
 case "help":content=helpPage();break;
 case "privacy":case "terms":content=legalPage(r.name);break;
 default:content=`<main class="page-wrap"><div class="empty-state"><h3>Ukurasa haujapatikana</h3><button class="btn btn-primary" data-route="home">Rudi Home</button></div></main>`;
 }
 app.innerHTML=header(state.profile,state.search)+content+footer()+bottomNav(r.name);
 if(!["login","signup","product","privacy","terms"].includes(r.name)) app.insertAdjacentHTML("beforeend",`<button class="whatsapp-float" data-action="whatsapp-contact">${icon("message-circle",18)} WhatsApp</button>`);
 bindEvents();refreshIcons();
}
function requireUser(){if(!state.user){toast("Tafadhali ingia kwanza.");go("login");return false;}return true;}
async function refresh(){await loadUser();await loadCore();render();}
function bindEvents(){
 document.querySelectorAll("[data-route]").forEach(el=>el.addEventListener("click",()=>navRoute(el.dataset.route)));
 document.querySelectorAll("[data-category]").forEach(el=>el.addEventListener("click",()=>{state.category=el.dataset.category;go("categories");loadCore().then(render);}));
 document.querySelectorAll("[data-product]").forEach(el=>el.addEventListener("click",()=>go("product",el.dataset.product)));
 document.querySelectorAll("[data-add-cart]").forEach(el=>el.addEventListener("click",async e=>{e.stopPropagation();try{if(state.user){await addToCart(state.user.id,el.dataset.addCart);state.cart=await getCart(state.user.id);}else{const rows=JSON.parse(localStorage.getItem("zune:cart")||"[]");const found=rows.find(x=>x.product_id===el.dataset.addCart);if(found)found.quantity++;else rows.push({id:"guest-"+Date.now(),product_id:el.dataset.addCart,quantity:1});localStorage.setItem("zune:cart",JSON.stringify(rows));state.cart=rows;}toast("Bidhaa imeongezwa kwenye Cart.");}catch(err){toast(err.message||"Imeshindikana kuongeza bidhaa.","error");}}));
 document.querySelectorAll("[data-wishlist]").forEach(el=>el.addEventListener("click",async e=>{e.stopPropagation();try{if(state.user){await toggleWishlist(state.user.id,el.dataset.wishlist);state.wishlist=await getWishlist(state.user.id);}else{const rows=JSON.parse(localStorage.getItem("zune:wishlist")||"[]");const i=rows.findIndex(x=>x.product_id===el.dataset.wishlist);if(i>=0)rows.splice(i,1);else rows.push({id:"guest-"+Date.now(),product_id:el.dataset.wishlist});localStorage.setItem("zune:wishlist",JSON.stringify(rows));state.wishlist=rows;}toast("Wishlist imesasishwa.");}catch(err){toast(err.message||"Imeshindikana.","error");}}));
 document.querySelectorAll("[data-remove-cart]").forEach(el=>el.addEventListener("click",async()=>{try{if(state.user){await removeCartItem(el.dataset.removeCart,state.user.id);state.cart=await getCart(state.user.id);}else{state.cart=state.cart.filter(x=>x.id!==el.dataset.removeCart);localStorage.setItem("zune:cart",JSON.stringify(state.cart));}render();toast("Bidhaa imeondolewa.");}catch(e){toast(e.message,"error");}}));
 document.querySelectorAll("[data-auth-mode]").forEach(el=>el.addEventListener("click",()=>go(el.dataset.authMode==="signup"?"signup":"login")));
 const authForm=document.querySelector("#auth-form");if(authForm)authForm.addEventListener("submit",handleAuth);
 const sellerForm=document.querySelector("#seller-application");if(sellerForm)sellerForm.addEventListener("submit",handleSellerApplication);
 const profileForm=document.querySelector("#profile-form");if(profileForm)profileForm.addEventListener("submit",handleProfileSave);
 const checkoutForm=document.querySelector("#checkout-form");if(checkoutForm)checkoutForm.addEventListener("submit",handleCheckout);
 const aiForm=document.querySelector("#ai-form");if(aiForm)aiForm.addEventListener("submit",handleAI);
 document.querySelectorAll("[data-action]").forEach(el=>el.addEventListener("click",()=>handleAction(el.dataset.action)));
 document.querySelectorAll("[data-delete-product]").forEach(el=>el.addEventListener("click",async()=>{if(!confirm("Una uhakika unataka kufuta bidhaa hii?"))return;try{await deleteProduct(el.dataset.deleteProduct,state.user.id);await refresh();toast("Bidhaa imefutwa.");}catch(e){toast(e.message,"error");}}));
 document.querySelectorAll("[data-conversation]").forEach(el=>el.addEventListener("click",()=>openConversation(el.dataset.conversation)));
 document.querySelectorAll("[data-contact-seller]").forEach(el=>el.addEventListener("click",async()=>{if(!requireUser())return;try{await startConversation(state.user.id,el.dataset.contactSeller,el.dataset.productId,"Habari, naomba maelezo zaidi kuhusu bidhaa hii.");toast("Mazungumzo yameanzishwa.");go("messages");await refresh();}catch(e){toast(e.message||"Imeshindikana kuanzisha mazungumzo.","error");}}));
 const search=document.querySelector("#global-search");if(search){search.addEventListener("keydown",async e=>{if(e.key==="Enter"){state.search=search.value.trim();state.category="";go("categories");await loadCore();render();}});}
}

async function openConversation(conversationId){
 try{
  const messages=await getConversationMessages(conversationId);
  const modalRef=modal("Mazungumzo",`<div id="conversation-messages" class="chat-box">${messages.map(m=>`<div class="chat-bubble ${m.sender_id===state.user?.id?"mine":""}">${escapeHTML(m.message||"")}</div>`).join("")||'<div class="small muted">Anza mazungumzo hapa.</div>'}</div><form id="conversation-send" class="chat-compose"><input name="message" placeholder="Andika ujumbe..." required><button class="btn btn-primary">${icon("send",16)}</button></form>`);
  const box=modalRef.el.querySelector("#conversation-messages");box.scrollTop=box.scrollHeight;
  modalRef.el.querySelector("#conversation-send").addEventListener("submit",async e=>{e.preventDefault();const message=new FormData(e.currentTarget).get("message");try{await sendMessage(state.user.id,conversationId,message);const latest=await getConversationMessages(conversationId);box.innerHTML=latest.map(m=>`<div class="chat-bubble ${m.sender_id===state.user?.id?"mine":""}">${escapeHTML(m.message||"")}</div>`).join("");box.scrollTop=box.scrollHeight;e.currentTarget.reset();}catch(err){toast(err.message||"Ujumbe haukutumwa.","error");}});
 }catch(err){toast(err.message||"Mazungumzo hayajafunguka.","error");}
}

async function handleAuth(e){
 e.preventDefault();const f=new FormData(e.currentTarget);const mode=route().name;
 try{if(mode==="signup"){const data=await signUp({fullName:f.get("fullName"),email:f.get("email"),phone:f.get("phone"),password:f.get("password")});if(data.session){toast("Akaunti imetengenezwa.");}else{toast("Angalia email yako kuthibitisha akaunti.");}await refresh();go("account");}
 else{await signIn({email:f.get("email"),password:f.get("password")});toast("Umeingia kikamilifu.");await refresh();go("account");}}
 catch(err){toast(err.message||"Imeshindikana. Jaribu tena.","error");}
}
async function handleSellerApplication(e){
 e.preventDefault();if(!requireUser())return;const form=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{state.application=await submitSellerApplication(state.user.id,form);toast("Ombi lako limetumwa kwa ukaguzi.");render();}catch(err){toast(err.message||"Imeshindikana kutuma ombi.","error");}
}
async function handleProfileSave(e){e.preventDefault();try{state.profile=await updateProfile(state.user.id,Object.fromEntries(new FormData(e.currentTarget).entries()));toast("Taarifa zimehifadhiwa.");render();}catch(err){toast(err.message||"Imeshindikana kuhifadhi taarifa.","error");}}
async function handleCheckout(e){
 e.preventDefault();if(!requireUser())return;const delivery=Object.fromEntries(new FormData(e.currentTarget).entries());
 try{for(const item of state.cart){const p=item.products||item.product||resolveProduct(item.product_id);if(!p)continue;await placeOrder(state.user.id,p,item.quantity||1,delivery);}await clearCart(state.user.id);state.cart=[];await refresh();toast("Oda yako imetumwa. Malipo yataunganishwa baadaye.");go("orders");}
 catch(err){toast(err.message||"Oda haikutumwa. Hakikisha taarifa zako.","error");}
}
async function handleAI(e){e.preventDefault();const f=new FormData(e.currentTarget);const q=String(f.get("question")||"").trim();if(!q)return;const box=document.querySelector("#ai-chat");box.insertAdjacentHTML("beforeend",`<div class="chat-bubble mine">${escapeHTML(q)}</div>`);e.currentTarget.reset();const reply=await askZuneAI(q);box.insertAdjacentHTML("beforeend",`<div class="chat-bubble">${escapeHTML(reply)}</div>`);box.scrollTop=box.scrollHeight;}
async function handleAction(action){
 if(action==="logout"){try{await signOut();state.user=null;state.session=null;state.profile=null;toast("Umetoka kwenye akaunti.");await refresh();go("home");}catch(e){toast(e.message,"error");}}
 if(action==="forgot-password"){const m=modal("Rejesha Password",`<form id="reset-form"><div class="field"><label>Email yako</label><input name="email" type="email" required></div><button class="btn btn-primary" style="margin-top:14px;width:100%">Tuma kiungo cha reset</button></form>`);m.el.querySelector("#reset-form").addEventListener("submit",async e=>{e.preventDefault();try{await resetPassword(new FormData(e.currentTarget).get("email"));m.close();toast("Angalia email yako kwa kiungo cha reset.");}catch(err){toast(err.message,"error");}});}
 if(action==="add-product"){if(!requireUser())return;const m=modal("Ongeza Bidhaa",`<form id="add-product-form" class="form-grid"><div class="field full"><label>Jina la bidhaa</label><input name="title" required></div><div class="field"><label>Bei (TZS)</label><input name="price" type="number" min="1" required></div><div class="field"><label>Stock</label><input name="stock_quantity" type="number" min="0" value="1" required></div><div class="field"><label>Category</label><select name="category">${window.ZUNE_CONFIG.categories.map(c=>`<option>${escapeHTML(c.name)}</option>`).join("")}</select></div><div class="field"><label>Picha URL (hiari)</label><input name="image_url" type="url"></div><div class="field full"><label>Maelezo</label><textarea name="description"></textarea></div><div class="field full"><button class="btn btn-primary">Hifadhi Bidhaa</button></div></form>`);m.el.querySelector("form").addEventListener("submit",async e=>{e.preventDefault();try{await createProduct(state.user.id,Object.fromEntries(new FormData(e.currentTarget).entries()));m.close();await refresh();toast("Bidhaa imeongezwa.");}catch(err){toast(err.message||"Hifadhi imeshindikana.","error");}});}
 if(action==="whatsapp-contact")contactSupport();
}
async function init(){
 await refresh();
 onAuthChange(async session=>{state.session=session;state.user=session?.user||null;await refresh();});
 window.addEventListener("hashchange",async()=>{const r=route();if(r.name==="product"&&!resolveProduct(decodeURIComponent(r.param))){await loadCore();}render();});
 if(!location.hash)history.replaceState(null,"",location.pathname+location.search+"#/home");
 render();
}
init().catch(e=>{console.error(e);app.innerHTML=`<main class="page-wrap"><div class="empty-state"><h3>ZUNE imeshindwa kufunguka</h3><p>${escapeHTML(e.message||"Jaribu tena.")}</p><button class="btn btn-primary" onclick="location.reload()">Jaribu tena</button></div></main>`;});
