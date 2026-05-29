import { useState } from "react";
import { TrendingUp, Eye, EyeOff, ArrowRight } from "lucide-react";
import { C } from "../constants/designTokens";
import { Btn } from "../primitives/Components";

export default function Login({ setPage }: { setPage: (p: string) => void }) {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setPage("statistics"); }, 1200);
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex" }}>
      <div style={{ width:"48%", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", justifyContent:"space-between", padding:56 }}>
        <div style={{ position:"absolute", top:"-15%", left:"-10%", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,#00E67620,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:"-10%", right:"-5%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,#448AFF18,transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", inset:0, opacity:0.035, backgroundImage:"linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize:"52px 52px", pointerEvents:"none" }}/>

        <div className="fade-up" style={{ display:"flex", alignItems:"center", gap:12, position:"relative", zIndex:1 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:linear-gradient(135deg,${C.green},${C.greenDim}), display:"flex", alignItems:"center", justifyContent:"center", boxShadow:0 6px 24px ${C.greenGlow} }}>
            <TrendingUp size={19} color="#050A04" strokeWidth={2.5}/>
          </div>
          <span style={{ color:C.t1, fontWeight:800, fontSize:20, letterSpacing:"-0.02em" }}>Finova</span>
        </div>

        <div className="fade-up-2" style={{ position:"relative", zIndex:1 }}>
          <div style={{ width:48, height:2, background:linear-gradient(90deg,${C.green},${C.blue}), borderRadius:2, marginBottom:28 }}/>
          <h2 style={{ color:C.t1, fontSize:38, fontWeight:800, lineHeight:1.18, marginBottom:16, letterSpacing:"-0.03em" }}>
            Prenez le contrôle<br/>
            <span style={{ background:linear-gradient(135deg,${C.green},${C.blue}), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>de vos finances.</span>
          </h2>
          <p style={{ color:C.t2, fontSize:14, lineHeight:1.7, maxWidth:340 }}>
            Analysez vos dépenses, suivez vos revenus et atteignez vos objectifs avec une précision chirurgicale.
          </p>
        </div>

        <div className="fade-up-3" style={{ display:"flex", gap:36, position:"relative", zIndex:1 }}>
          {[["98%","Satisfaction"],["2M+","Transactions"],["150k+","Utilisateurs"]].map(([v,l])=>(
            <div key={l}>
              <div style={{ color:C.t1, fontSize:22, fontWeight:800, letterSpacing:"-0.02em", background:linear-gradient(135deg,${C.t1},${C.t2}), WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ color:C.t3, fontSize:11 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
        <div className="fade-up" style={{ width:"100%", maxWidth:380 }}>
          <h1 style={{ color:C.t1, fontSize:28, fontWeight:800, marginBottom:6, letterSpacing:"-0.02em" }}>Bon retour</h1>
          <p style={{ color:C.t2, fontSize:13, marginBottom:36 }}>Connectez-vous à votre espace personnel</p>

<div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ color:C.t3, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", display:"block", marginBottom:8 }}>E-mail</label>
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="vous@exemple.com"/>
            </div>

            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                <label style={{ color:C.t3, fontSize:10, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase" }}>Mot de passe</label>
                <button style={{ background:"none", border:"none", color:C.green, fontSize:11, cursor:"pointer" }}>Oublié ?</button>
              </div>
              <div style={{ position:"relative" }}>
                <input type={showPwd?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={{ paddingRight:44 }}/>
                <button onClick={()=>setShowPwd(!showPwd)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:C.t3, cursor:"pointer", display:"flex" }}>
                  {showPwd?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>

            <Btn onClick={handleSubmit} disabled={loading} style={{ justifyContent:"center", padding:"14px", marginTop:4 }}>
              {loading ? <div style={{ width:16, height:16, border:"2px solid #05a04440", borderTop:"2px solid #050A04", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/> : <><span>Se connecter</span><ArrowRight size={15}/></>}
            </Btn>
          </div>

          <p style={{ color:C.t2, fontSize:12, textAlign:"center", marginTop:28 }}>
            Pas encore de compte ?{" "}
            <button onClick={()=>setPage("register")} style={{ background:"none", border:"none", color:C.green, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Syne',sans-serif" }}>Créer un compte</button>
          </p>
        </div>
      </div>
    </div>
  );
}
