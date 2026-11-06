const answers=[
{keys:["seller","muuzaji","kuuza","duka"],text:"Ili uwe muuzaji, fungua Account kisha chagua “Become a Seller”. Jaza taarifa za duka na subiri idhini ya timu ya ZUNE kupitia ZUNE PREMIUM ADMIN."},
{keys:["order","oda","agizo"],text:"Unaweza kufuatilia oda zako kwenye Account → My Orders. Hali ya oda itaonekana pale taarifa zitakapopatikana kwenye akaunti yako."},
{keys:["verified","uthibitisho","badge"],text:"Badge ya blue ni ya maduka yaliyothibitishwa. Badge ya gold ni ya wanunuzi waliothibitishwa. Hali ya badge inatokana na taarifa za Supabase na idhini ya ZUNE PREMIUM ADMIN."},
{keys:["cart","kikapu"],text:"Bonyeza Add to Cart kwenye bidhaa, kisha fungua Cart kwenye navigation ya chini ili kuona bidhaa zako."},
{keys:["whatsapp","channel"],text:"Unaweza kujiunga na ZUNE WhatsApp Channel kupitia kitufe cha “Jiunge WhatsApp Channel” kwenye ukurasa wa Account au footer."},
{keys:["payment","malipo","lipa"],text:"Mfumo wa malipo ya ZUNE Marketplace utaunganishwa katika hatua ya mwisho. Kwa sasa checkout inakusanya taarifa za oda tu; haichukui malipo."},
{keys:["account","akaunti","login","ingia"],text:"Fungua Account ili kuingia, kujisajili, kubadilisha taarifa zako au kuona oda zako."}
];
export async function askZuneAI(question){const q=question.toLowerCase();const hit=answers.find(a=>a.keys.some(k=>q.includes(k)));return hit?.text||"Nipo kukusaidia kutumia ZUNE Marketplace. Unaweza kuniuliza kuhusu kutafuta bidhaa, akaunti, oda, kuwa muuzaji, verification au WhatsApp Channel.";}