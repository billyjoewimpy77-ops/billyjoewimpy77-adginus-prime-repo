
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

const AppContext = createContext(null);
function useApp(){ return useContext(AppContext); }

const AGENT_META = {
  strategist:{ label:"Strategist", icon:"📡", color:"#a78bfa" },
  creative:{ label:"Creative Dir.", icon:"🎨", color:"#f472b6" },
  media:{ label:"Media Genius", icon:"🖼️", color:"#22d3ee" },
  growth:{ label:"Growth Hacker", icon:"📈", color:"#34d399" },
  video:{ label:"Video Agent", icon:"🎬", color:"#fb923c" },
  audio:{ label:"Audio Agent", icon:"🎵", color:"#facc15" },
  compliance:{ label:"Compliance Officer", icon:"🛡️", color:"#ef4444" },
};

function AppProvider({children}){
  const [agents,setAgents]=useState({
    strategist:{status:"STANDBY",task:"",progress:0,mastery:0.12,tasks:4},
    creative:{status:"STANDBY",task:"",progress:0,mastery:0.34,tasks:7},
    media:{status:"STANDBY",task:"",progress:0,mastery:0.28,tasks:5},
    growth:{status:"STANDBY",task:"",progress:0,mastery:0.41,tasks:9},
    video:{status:"STANDBY",task:"",progress:0,mastery:0.22,tasks:3},
    audio:{status:"STANDBY",task:"",progress:0,mastery:0.18,tasks:2},
    compliance:{status:"STANDBY",task:"",progress:0,mastery:0.95,tasks:14},
  });
  const [voidActive,setVoidActive]=useState(true);
  const [memories,setMemories]=useState([
    {id:1,text:"User prefers energetic tone for Instagram",tag:"style",ts:Date.now()-90000},
    {id:2,text:"Target: 18-34 tech-forward contractors",tag:"strategy",ts:Date.now()-60000},
    {id:3,text:"Brand palette: violet, cyan, white/black",tag:"creative",ts:Date.now()-30000},
    {id:4,text:"FEC HARD GATE blocks Paid for by [PENDING]",tag:"compliance",ts:Date.now()-10000},
    {id:5,text:"No creator has to introduce themselves twice - I remember",tag:"philosophy",ts:Date.now()-5000},
  ]);
  const memIdRef=useRef(6);
  const [streamLog,setStreamLog]=useState([
    {agent:"SYSTEM",msg:"ADGINUS PRIME NEXUS ELEVEN v2.0 PERFECT BUILD booted. 7 agents online. Mycelium Bus active. FEC HARD GATE ACTIVE.",ts:Date.now()-3000},
  ]);
  const streamRef=useRef(null);
  const [busMessages,setBusMessages]=useState([
    {id:0,from:"SCHOOL_PRINCIPAL",message:"Cross-agent dream session completed",tags:["dream","school"],significance:0.9,timestamp:new Date().toISOString()},
  ]);
  const busIdRef=useRef(1);
  const [fecChain,setFecChain]=useState([]);
  const fecIdRef=useRef(0);
  const [schoolCycle,setSchoolCycle]=useState(6);
  const [chambers,setChambers]=useState({
    strategy:[{id:1,name:"Q3 Campaign Brief",type:"brief",preview:"Summer push — Gen Z focus, TikTok + IG Reels"}],
    creative:[{id:2,name:"Hero Hook — Video Ad",type:"copy",preview:'"Stop scrolling. This changes everything." — 94% thumb-stop'}],
    trend:[{id:3,name:"Trending Audio Jul 26",type:"trend",preview:"Top 20 sounds by engagement velocity"}],
  });
  const chamberIdRef=useRef(4);
  const [atlas,setAtlas]=useState({
    characters:[{id:1,name:"Nova",role:"Brand Mascot",attributes:"Futuristic, bold",lore:"Born from data"}],
    locations:[{id:1,name:"The Void",type:"Virtual",desc:"Where intelligence converges"}],
    lore:[{id:1,title:"ADGINUS Origin",content:"Seven minds. One advertising intelligence. I remember."}],
  });
  const [brief,setBrief]=useState({goal:"",platform:"Instagram",format:"Video Ad",tone:"Energetic",keywords:"",saveToChip:"creative",videoStyle:"Cinematic",audioMood:"Energetic",committeeId:"C00123456",disclaimer:"Paid for by ADGINUS Enterprise",address:"123 Main St, Thorsby, AL 35171"});
  const [lastGenerated,setLastGen]=useState(null);
  const [myceliumMsgs,setMyceliumMsgs]=useState([
    {id:1,from:"Sarah M.",platform:"gmail",content:"Are you coming Saturday?",draft:"Hey Sarah! Yes I'll be there — what should I bring?",unread:true},
    {id:2,from:"Marcus T.",platform:"messenger",content:"You see the game last night?? 🔥",draft:"Man I know!! That ending was insane lol",unread:true},
  ]);
  const [videoJobs,setVideoJobs]=useState([{id:1,name:"Summer Campaign Hero",style:"Cinematic",status:"ready",duration:"0:30"}]);
  const [audioJobs,setAudioJobs]=useState([{id:1,name:"Brand Jingle v1",mood:"Upbeat",status:"ready",format:"MP3"}]);
  const jobIdRef=useRef(2);

  const addLog=useCallback((agent,msg)=>{setStreamLog(l=>[...l.slice(-49),{agent,msg,ts:Date.now()}]);},[]);
  const publishBus=useCallback((from,message,tags,significance=0.6)=>{setBusMessages(b=>[...b.slice(-29),{id:busIdRef.current++,from,message,tags:tags||[],significance,timestamp:new Date().toISOString()}]);},[]);
  const absorbMemory=useCallback((text,tag="general")=>{if(!voidActive)return;setMemories(m=>[...m,{id:memIdRef.current++,text,tag,ts:Date.now()}]);},[voidActive]);
  const setAgentStatus=useCallback((name,status,task="",progress=0)=>{setAgents(a=>({...a,[name]:{...a[name],status,task,progress}}));},[]);

  function simpleHash(s){let h=0;for(let i=0;i<s.length;i++){h=((h<<5)-h)+s.charCodeAt(i);h|=0;}return Math.abs(h).toString(16).slice(0,16);}
  function verifyFEC(adCopy,committeeId,disclaimer,address){
    const reasons=[];
    if(adCopy.includes("[PENDING]")||adCopy.includes("Paid for by [PENDING]"))reasons.push("Contains [PENDING] placeholder");
    if(!committeeId||!committeeId.trim())reasons.push("Missing FEC committee ID (e.g. C00123456)");
    if(!disclaimer||!disclaimer.includes("Paid for by"))reasons.push("Missing or invalid disclaimer");
    if(!address)reasons.push("Missing committee address");
    if(committeeId&&!/^C\d{8}$/.test(committeeId.trim()))reasons.push(`Committee ID format invalid: ${committeeId}`);
    const blocked=reasons.length>0;
    const timestamp=new Date().toISOString();
    const ad_hash=simpleHash(adCopy+timestamp);
    const prev_hash=fecChain.length>0?fecChain[fecChain.length-1].chain_hash:"GENESIS";
    const chain_hash=simpleHash(prev_hash+ad_hash+timestamp);
    const entry={id:fecIdRef.current++,timestamp,ad_hash,committee_id:committeeId,blocked,reasons,disclaimer,address,prev_hash,chain_hash,ad_preview:adCopy.slice(0,80)};
    setFecChain(c=>[...c,entry]);
    return {status:blocked?"BLOCKED":"PASSED",blocked,reasons,auditEntry:entry,chainLength:fecChain.length+1};
  }

  const runAgentPipeline=useCallback(async(payload)=>{
    const isCompliance = payload.committeeId || payload.goal.toLowerCase().includes("fec") || payload.goal.toLowerCase().includes("compliance");
    addLog("SYSTEM", `7-agent pipeline → "${payload.goal}" ${isCompliance?"[ENTERPRISE COMPLIANCE]":""}`);
    publishBus("SCHOOL_PRINCIPAL", `Routing: ${payload.goal}`, ["task"], 0.8);
    absorbMemory(`Task: ${payload.goal}`, "task");
    setSchoolCycle(c=>c+1);
    setAgentStatus("strategist","WORKING","Scanning trends",10); addLog("STRATEGIST", `Analyzing: ${payload.keywords||payload.goal}`); await new Promise(r=>setTimeout(r,600));
    setAgentStatus("strategist","COMPLETED","",100); publishBus("Strategist","Strategy ready",["strategy"],0.7);
    setAgentStatus("creative","WORKING","Building narrative",20); addLog("CREATIVE DIR.",`${payload.tone} voice for ${payload.platform}`); await new Promise(r=>setTimeout(r,500));
    setAgentStatus("creative","COMPLETED","",100); publishBus("Creative Director","Hooks ready",["creative"],0.7);
    setAgentStatus("media","WORKING","Generating visuals",25); setAgentStatus("video","WORKING","Rendering video",15); setAgentStatus("audio","WORKING","Composing audio",20);
    addLog("MEDIA GENIUS", `Composing ${payload.format}`); await new Promise(r=>setTimeout(r,600));
    setAgentStatus("media","COMPLETED","",100); setAgentStatus("video","COMPLETED","",100); setAgentStatus("audio","COMPLETED","",100);
    setAgentStatus("growth","WORKING","Pattern recognition",40); await new Promise(r=>setTimeout(r,500));
    setAgentStatus("growth","COMPLETED","",100);
    let complianceResult=null;
    if(isCompliance || payload.committeeId){
      setAgentStatus("compliance","WORKING","FEC HARD GATE",30); await new Promise(r=>setTimeout(r,400));
      complianceResult = verifyFEC(payload.goal, payload.committeeId||"C00123456", payload.disclaimer||"Paid for by ADGINUS", payload.address||"123 Main St");
      addLog("COMPLIANCE", complianceResult.blocked ? `BLOCKED: ${complianceResult.reasons.join("; ")}` : `PASSED: Chain ${complianceResult.auditEntry.chain_hash}`);
      publishBus("Compliance Officer", complianceResult.status, ["compliance"], 0.95);
      setAgentStatus("compliance","COMPLETED","",100);
    }
    const result={headline:`[${payload.tone.toUpperCase()}] ${payload.goal}`,hook:`"${payload.tone.toLowerCase()} ad that stops the scroll."`,body:`${payload.platform} · ${payload.format}`,compliance:complianceResult,};
    setLastGen(result);
    addLog("SYSTEM","✓ All 7 agents complete.");
    setTimeout(()=>{["strategist","creative","media","growth","video","audio","compliance"].forEach(a=>setAgentStatus(a,"STANDBY","",0));},3000);
  },[addLog,absorbMemory,setAgentStatus,publishBus,fecChain]);

  return (<AppContext.Provider value={{agents,voidActive,setVoidActive,memories,streamLog,streamRef,busMessages,fecChain,schoolCycle,chambers,atlas,setAtlas,brief,setBrief,lastGenerated,videoJobs,audioJobs,myceliumMsgs,runAgentPipeline,verifyFEC,addLog,absorbMemory,}}>{children}</AppContext.Provider>);
}

const PAGES=["Dashboard","Creative Studio","Media Lab","Data Chambers","World Atlas","Mycelium","Compliance"];
function Navbar({page,setPage}){const {voidActive,memories,busMessages,fecChain}=useApp();return(<nav style={{position:"fixed",top:0,width:"100%",background:"rgba(0,0,0,0.93)",borderBottom:"1px solid #111",zIndex:100}}><div style={{maxWidth:1400,margin:"0 auto",padding:"13px 28px",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{fontSize:20,fontWeight:800,color:"#fff"}}>ADGINUS PRIME <span style={{color:"#a78bfa",fontSize:12}}>NEXUS ELEVEN v2.0</span></div><div style={{display:"flex",gap:2}}>{PAGES.map(p=>(<button key={p} onClick={()=>setPage(p)} style={{background:page===p?"rgba(167,139,250,0.12)":"none",border:"none",cursor:"pointer",padding:"6px 13px",borderRadius:8,fontSize:12,fontWeight:page===p?700:400,color:page===p?"#a78bfa":"#555"}}>{p}</button>))}</div><div style={{fontSize:11,color:"#555"}}>VOID {memories.length} | BUS {busMessages.length} | CHAIN {fecChain.length}</div></div></nav>);}
function StatusBadge({status}){const c={STANDBY:"#34d399",WORKING:"#f59e0b",COMPLETED:"#a78bfa"}[status];return(<span style={{background:`${c}18`,color:c,fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:700}}>{status}</span>);}
function Dashboard(){const {agents,streamLog,streamRef,memories,runAgentPipeline,addLog,busMessages,fecChain,schoolCycle}=useApp();const [cmd,setCmd]=useState("");async function go(){if(!cmd.trim())return;addLog("USER",cmd);await runAgentPipeline({goal:cmd,platform:"Multi",format:"Video Ad",tone:"Energetic",keywords:cmd,videoStyle:"Dynamic",audioMood:"Energetic",saveToChip:"creative",committeeId:"C00123456",disclaimer:"Paid for by ADGINUS",address:"123 Main St"});setCmd("");}return(<div style={{minHeight:"100vh",background:"#050505",color:"#fff",paddingTop:76}}><div style={{maxWidth:1320,margin:"0 auto",padding:"28px"}}><h1 style={{fontSize:38,fontWeight:800}}>Welcome back, William 🖖🐲</h1><p style={{color:"#444"}}>7-agent network — Prime Nexus Eleven Perfect Build v2.0 — billyjoewimpy77-adginus-prime-repo</p><div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:12,margin:"24px 0"}}>{Object.entries(agents).map(([k,a])=>{const m={strategist:{label:"Strategist",icon:"📡",color:"#a78bfa"},creative:{label:"Creative Dir.",icon:"🎨",color:"#f472b6"},media:{label:"Media Genius",icon:"🖼️",color:"#22d3ee"},growth:{label:"Growth Hacker",icon:"📈",color:"#34d399"},video:{label:"Video Agent",icon:"🎬",color:"#fb923c"},audio:{label:"Audio Agent",icon:"🎵",color:"#facc15"},compliance:{label:"Compliance",icon:"🛡️",color:"#ef4444"}}[k];return(<div key={k} style={{background:"#0d0d0d",border:`1px solid ${a.status==="WORKING"?m.color:m.color+"22"}`,borderRadius:16,padding:18}}><div style={{fontSize:22}}>{m.icon}</div><div style={{fontSize:10,color:m.color}}>{m.label} · {Math.round(a.mastery*100)}%</div><StatusBadge status={a.status}/></div>);})}</div><div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:16}}><div style={{background:"#080808",border:"1px solid #141414",borderRadius:18,padding:22}}><div style={{fontSize:10,color:"#333",marginBottom:8}}>COORDINATION STREAM — Cycle {schoolCycle}</div><div ref={streamRef} style={{height:200,overflowY:"auto",fontFamily:"monospace",fontSize:11}}>{streamLog.map((l,i)=><div key={i}><span style={{color:"#2a2a2a"}}>{new Date(l.ts).toLocaleTimeString()} </span><span style={{color:"#34d399",fontWeight:700}}>[{l.agent}] </span><span style={{color:"#666"}}>{l.msg}</span></div>)}</div><div style={{display:"flex",gap:8,marginTop:12}}><input value={cmd} onChange={e=>setCmd(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="Command all 7 agents..." style={{flex:1,background:"#111",border:"1px solid #1e1e1e",borderRadius:9,padding:"8px 13px",color:"#fff"}}/><button onClick={go} style={{background:"#a78bfa",color:"#000",border:"none",borderRadius:9,padding:"8px 18px",fontWeight:700}}>Launch ↗</button></div></div><div style={{background:"#080808",border:"1px solid #22d3ee22",borderRadius:18,padding:22}}><div style={{fontSize:10,color:"#22d3ee"}}>THE VOID — {memories.length} memories</div><div style={{fontSize:10,color:"#a78bfa",marginTop:12}}>MYCELIUM BUS — {busMessages.length} shared</div>{busMessages.slice(-4).map(m=><div key={m.id} style={{fontSize:10,color:"#555",marginTop:6}}>{m.from}: {m.message.slice(0,40)}</div>)}<div style={{fontSize:10,color:"#ef4444",marginTop:12}}>FEC CHAIN — {fecChain.length} logs</div></div></div></div></div>);}
function Compliance(){const {fecChain,verifyFEC}=useApp();const [adCopy,setAdCopy]=useState("Vote for Summer Launch! Paid for by [PENDING]");const [committeeId,setCommitteeId]=useState("");const [disclaimer,setDisclaimer]=useState("");const [address,setAddress]=useState("");const [lastResult,setLastResult]=useState(null);function run(){setLastResult(verifyFEC(adCopy,committeeId,disclaimer,address));}return(<div style={{minHeight:"100vh",background:"#050505",color:"#fff",paddingTop:76}}><div style={{maxWidth:900,margin:"0 auto",padding:"28px"}}><h1 style={{fontSize:46,fontWeight:800}}>FEC HARD GATE <span style={{color:"#ef4444"}}>+ IMMUTABLE CHAIN</span></h1><p style={{color:"#444"}}>Enterprise $999 — Blocks $50k violations</p><div style={{background:"#0d0d0d",border:"1px solid #ef444422",borderRadius:22,padding:28,marginTop:24}}><textarea value={adCopy} onChange={e=>setAdCopy(e.target.value)} style={{width:"100%",height:80,background:"#080808",border:"1px solid #1e1e1e",borderRadius:12,padding:14,color:"#fff"}}/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:12}}><input value={committeeId} onChange={e=>setCommitteeId(e.target.value)} placeholder="C00123456" style={{background:"#080808",border:"1px solid #1e1e1e",borderRadius:10,padding:"11px",color:"#fff"}}/><input value={address} onChange={e=>setAddress(e.target.value)} placeholder="123 Main St" style={{background:"#080808",border:"1px solid #1e1e1e",borderRadius:10,padding:"11px",color:"#fff"}}/></div><input value={disclaimer} onChange={e=>setDisclaimer(e.target.value)} placeholder="Paid for by..." style={{width:"100%",background:"#080808",border:"1px solid #1e1e1e",borderRadius:10,padding:"11px",color:"#fff",marginTop:12}}/><button onClick={run} style={{width:"100%",padding:14,borderRadius:12,border:"none",background:"#ef4444",color:"#fff",fontWeight:700,marginTop:16}}>Verify — Run FEC HARD GATE ↗</button>{lastResult&&<div style={{marginTop:16,background:lastResult.blocked?"#ef444412":"#34d39912",border:"1px solid #333",borderRadius:12,padding:14}}><div style={{color:lastResult.blocked?"#ef4444":"#34d399",fontWeight:700}}>{lastResult.status} — {lastResult.auditEntry.chain_hash}</div><div style={{fontSize:11,color:"#555"}}>Prev: {lastResult.auditEntry.prev_hash}</div>{lastResult.reasons.map((r,i)=><div key={i} style={{fontSize:12,color:"#ef4444"}}>• {r}</div>)}</div>}</div><div style={{background:"#0d0d0d",borderRadius:18,padding:20,marginTop:20}}><div style={{fontSize:12,color:"#555"}}>AUDIT CHAIN — {fecChain.length} entries</div>{fecChain.slice(-10).reverse().map(e=><div key={e.id} style={{background:"#080808",borderRadius:8,padding:10,marginTop:8,borderLeft:`4px solid ${e.blocked?"#ef4444":"#34d399"}`}}><div style={{fontSize:11,color:e.blocked?"#ef4444":"#34d399"}}>{e.blocked?"BLOCKED":"PASSED"} {e.chain_hash} — {e.ad_preview}</div></div>)}</div></div></div>);}
function CreativeStudio(){const {brief,setBrief,runAgentPipeline}=useApp();const [running,setRunning]=useState(false);async function launch(){setRunning(true);await runAgentPipeline(brief);setRunning(false);}return(<div style={{minHeight:"100vh",background:"#050505",color:"#fff",paddingTop:76}}><div style={{maxWidth:880,margin:"0 auto",padding:"28px"}}><h1 style={{fontSize:46,fontWeight:800}}>Creative Studio</h1><div style={{background:"#0d0d0d",borderRadius:22,padding:32,marginTop:24}}><textarea value={brief.goal} onChange={e=>setBrief(b=>({...b,goal:e.target.value}))} placeholder="Campaign goal..." style={{width:"100%",height:100,background:"#080808",border:"1px solid #1e1e1e",borderRadius:12,padding:14,color:"#fff"}}/><button onClick={launch} style={{width:"100%",padding:15,borderRadius:12,border:"none",background:"linear-gradient(90deg,#a78bfa,#fb923c,#ef4444)",fontWeight:700,marginTop:16}}>{running?"Working...":"Launch All 7 Agents ↗"}</button></div></div></div>);}
function Placeholder({title}){return <div style={{minHeight:"100vh",background:"#050505",color:"#fff",paddingTop:76,display:"flex",alignItems:"center",justifyContent:"center"}}><h2>{title} — Ready</h2></div>;}
export default function App(){
  const [page,setPage]=useState("Dashboard");
  return (<AppProvider><Navbar page={page} setPage={setPage}/>{page==="Dashboard"&&<Dashboard/>}{page==="Creative Studio"&&<CreativeStudio/>}{page==="Compliance"&&<Compliance/>}{page==="Media Lab"&&<Placeholder title="Media Lab"/>}{page==="Data Chambers"&&<Placeholder title="Data Chambers"/>}{page==="World Atlas"&&<Placeholder title="World Atlas"/>}{page==="Mycelium"&&<Placeholder title="Mycelium"/>}</AppProvider>);
}
