// Optional server-side AI integration scaffold. Not deployed by this ZIP.
// Configure AI_PROVIDER_URL and AI_PROVIDER_KEY as Supabase Function secrets before enabling.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", {headers:cors});
  if (req.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:cors});
  const url = Deno.env.get("SUPABASE_URL");
  const publishable = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  const auth = req.headers.get("Authorization");
  if (!url || !publishable || !auth) return new Response(JSON.stringify({error:"Authentication required"}),{status:401,headers:cors});
  const client = createClient(url,publishable,{global:{headers:{Authorization:auth}}});
  const {data:{user},error} = await client.auth.getUser();
  if(error || !user) return new Response(JSON.stringify({error:"Invalid session"}),{status:401,headers:cors});
  const body = await req.json().catch(()=>({}));
  const question = String(body.question ?? "").trim().slice(0,1200);
  if(!question) return new Response(JSON.stringify({error:"Question required"}),{status:400,headers:cors});
  const providerUrl = Deno.env.get("AI_PROVIDER_URL");
  const providerKey = Deno.env.get("AI_PROVIDER_KEY");
  if(!providerUrl || !providerKey) return new Response(JSON.stringify({reply:"ZUNE AI online haijawezeshwa bado. Tumia mwongozo wa ndani wa ZUNE AI kwenye app."}),{headers:cors});
  const upstream = await fetch(providerUrl,{method:"POST",headers:{"Authorization":`Bearer ${providerKey}`,"Content-Type":"application/json"},body:JSON.stringify({question,locale:"sw-TZ"})});
  if(!upstream.ok) return new Response(JSON.stringify({error:"AI provider unavailable"}),{status:502,headers:cors});
  const result = await upstream.json();
  return new Response(JSON.stringify({reply:String(result.reply ?? result.answer ?? "Sina jibu kwa sasa.")}),{headers:cors});
});