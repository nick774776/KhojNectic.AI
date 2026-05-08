"use client";

import React, { useState, useRef, useEffect } from "react";
import SearchComponent from "@/components/ui/animated-glowing-search-bar";
import { Button } from "@/components/ui/neon-button";
import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { GlowCard } from "@/components/ui/spotlight-card";
import { Clock, LayoutDashboard, MessageSquare, Info } from "lucide-react";

const EXAMPLES: Record<string, string> = {
  "5lox": `Zileuton, a selective 5-lipoxygenase (5-LOX) inhibitor, attenuates oxaliplatin-induced peripheral neuropathy (OIPN) by suppressing the 5-LOX/ferroptosis axis in dorsal root ganglion (DRG) sensory neurons. Hypothesis: oxaliplatin triggers membrane phospholipid stress → arachidonic acid release → 5-LOX activation → leukotriene synthesis and PUFA hydroperoxide accumulation → GPX4/GSH collapse → ferroptotic neuronal death → OIPN. Zileuton's upstream 5-LOX inhibition may prevent downstream ferroptotic cascade distinct from direct GPX4 activators.`,
  dili: `AI-based hepatotoxicity prediction using transcriptomics and multiomics integration for drug-induced liver injury (DILI) risk stratification. Combining liver-on-chip microphysiological systems with machine learning to predict DILI onset from early molecular signatures before clinical manifestation.`,
  herg: `Deep learning prediction of hERG channel inhibition for early cardiotoxicity screening in drug discovery. Integration of structural features, binding kinetics, and physiologically-based pharmacokinetic modeling to reduce cardiac safety attrition in pharmaceutical development.`,
  pd: `Neuroinflammatory mechanisms in Parkinson's disease progression: role of NLRP3 inflammasome activation in dopaminergic neuron death and potential therapeutic targeting with selective NLRP3 inhibitors for neuroprotection.`,
};

export default function App() {
  const [activePage, setActivePage] = useState("analyze");
  const [query, setQuery] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "ai",
      content:
        "<strong>खोजNetic AI chatbot</strong> ready.<br><br>I specialize in pharmaceutical research intelligence, toxicology, biomedical literature analysis, and scientific hypothesis generation. Ask me about research gaps, novelty opportunities, mechanism exploration, or literature synthesis.<br><br>What would you like to explore?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatTyping, setChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Focus effect for chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatTyping]);

  const loadExample = (key: string) => {
    setQuery(EXAMPLES[key]);
  };

  const clearAll = () => {
    setQuery("");
    setAnalysisResult(null);
    setPipelineStep(-1);
  };

  const runAnalysis = async () => {
    if (!query) {
      alert("Please enter a research topic");
      return;
    }

    setAnalyzing(true);
    setAnalysisResult(null);
    setPipelineStep(0);

    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      setPipelineStep(i);
      await new Promise((r) => setTimeout(r, 700));
    }

    // Mock API Call to backend
    try {
      const resp = await fetch("http://localhost:8000/research/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!resp.ok) {
        throw new Error("API not ready yet, using fallback mock data.");
      }
      const data = await resp.json();
      setAnalysisResult(data);
    } catch (e) {
      // Fallback mock data
      setAnalysisResult({
        novelty_score: 87,
        saturation_level: "Low",
        components: {
          semantic_distance: 88,
          topic_rarity: 82,
          citation_scarcity: 79,
          emerging_trend: 91,
          cross_domain: 75,
          methodological: 83,
        },
        analysis:
          "The proposed hypothesis connecting 5-LOX inhibition (via Zileuton) to the prevention of ferroptosis in oxaliplatin-induced peripheral neuropathy (OIPN) presents a highly novel intersection of distinct biological mechanisms.\n\nWhile the role of ferroptosis in OIPN is an emerging area of interest, positioning 5-LOX upstream of the GPX4/GSH collapse is a fresh methodological angle that diverges from traditional direct GPX4 activators.",
        similar_papers: [
          {
            title: "Ferroptosis in oxaliplatin-induced peripheral neuropathy",
            year: 2023,
            journal: "NeuroToxicology",
            similarity: 65,
            key_difference: "Focuses on GPX4, not 5-LOX",
          },
        ],
        recommendations: [
          {
            type: "opportunity",
            title: "Novel Biomarker Potential",
            description: "Investigate leukotriene synthesis byproducts as early markers for OIPN.",
          },
        ],
      });
    }

    setAnalyzing(false);
  };

  const sendCopilotMsg = async (preset?: string) => {
    const msg = preset || chatInput;
    if (!msg.trim()) return;

    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", content: msg }]);
    setChatTyping(true);

    try {
      const resp = await fetch("http://localhost:8000/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: chatHistory }),
      });
      if (!resp.ok) throw new Error("API not ready");
      const data = await resp.json();
      setChatHistory((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1500));
      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I'm running in offline prototype mode right now. Once the FastAPI backend is fully connected, I'll provide deep scientific insights using Claude Sonnet 3.5.",
        },
      ]);
    }
    setChatTyping(false);
  };

  return (
    <div className="relative grid grid-cols-[220px_1fr] grid-rows-[52px_1fr] min-h-screen">
      {/* ANIMATED BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <SmokeBackground smokeColor="#ffffff" />
      </div>
      {/* TOPBAR */}
      <div className="col-span-2 bg-white/5 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-5 py-3 sticky top-0 z-50">
        <div className="flex-1"></div>
        
        <div className="font-[var(--font-serif)] text-[26px] font-bold text-cyan-300 drop-shadow-[0_0_12px_rgba(103,232,249,0.8)] tracking-widest text-center">
          खोजNetic AI
        </div>

        <div className="flex-1 flex justify-end items-center gap-4">
          <div className="text-[12px] font-semibold flex items-center gap-1.5 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)] [text-shadow:0_0_10px_rgba(34,211,238,0.8),0_0_20px_rgba(34,211,238,0.5)]">
            <div className="w-1.5 h-1.5 bg-[#0e9f6e] rounded-full drop-shadow-[0_0_6px_#0e9f6e] shadow-[0_0_8px_#0e9f6e]"></div>
            PubMed · OpenAlex · Semantic Scholar
          </div>
          <button className="bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all px-3 py-1.5 rounded-md text-[13px] font-medium" onClick={() => setActivePage("analyze")}>
            + New Analysis
          </button>
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="bg-white/10 backdrop-blur-lg border-r border-white/20 p-4 pb-0 overflow-y-auto flex flex-col z-10">
        <div className="mb-5">
          <div className="text-[10px] font-medium text-white/50 tracking-widest uppercase px-2 mb-1.5">
            Platform
          </div>
          <NavItem active={activePage === "analyze"} onClick={() => setActivePage("analyze")} icon={<Clock size={16} strokeWidth={1.5} />} label="Analyze Research" />
          <NavItem active={activePage === "dashboard"} onClick={() => setActivePage("dashboard")} icon={<LayoutDashboard size={16} strokeWidth={1.5} />} label="Dashboard" />
          <NavItem active={activePage === "copilot"} onClick={() => setActivePage("copilot")} icon={<MessageSquare size={16} strokeWidth={1.5} />} label="AI Copilot" />
        </div>

        <div className="mb-5">
          <div className="text-[10px] font-medium text-white/50 tracking-widest uppercase px-2 mb-1.5">
            History
          </div>
          <div className="flex items-center gap-2 p-2 mb-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/30 text-white/80 transition-all" onClick={() => { loadExample("5lox"); setActivePage("analyze"); }}>
            <div className="text-[#0e9f6e] flex-shrink-0">◉</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] truncate">5-LOX Ferroptosis OIPN</div>
              <div className="text-[10px] text-white/50">Score: 87 · Today</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/30 text-white/80 transition-all" onClick={() => { loadExample("zileuton"); setActivePage("analyze"); }}>
            <div className="text-[#e3a008] flex-shrink-0">◉</div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] truncate">Zileuton Neuroprotection</div>
              <div className="text-[10px] text-white/50">Score: 79 · Yesterday</div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 p-6 md:p-8 overflow-y-auto">
        {/* ANALYZE PAGE */}
        <div className={activePage === "analyze" ? "block" : "hidden"}>
          <div className="mb-6 pb-4 border-b border-white/20">
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-cyan-300 mb-1 drop-shadow-[0_0_12px_rgba(103,232,249,0.6)]">Research Novelty Analysis</h1>
            <p className="text-[14px] text-cyan-100/70 drop-shadow-sm">Input your research topic, hypothesis, or abstract to receive AI-powered novelty intelligence</p>
          </div>

          <div className="mb-5">
            <div className="flex justify-center mb-4">
              <SearchComponent
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search research topics, hypotheses, mechanisms..."
                onKeyDown={(e) => e.key === "Enter" && runAnalysis()}
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Button variant="solid" size="lg" onClick={runAnalysis} disabled={analyzing} className="flex items-center gap-2 cursor-pointer disabled:opacity-50">
                {analyzing ? "Analyzing..." : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><polygon points="2,1 12,6.5 2,12" fill="white"/></svg>
                    Analyze Research
                  </>
                )}
              </Button>
              <Button variant="solid" size="lg" onClick={clearAll} className="cursor-pointer">Clear</Button>
            </div>
          </div>

          {/* PIPELINE */}
          {pipelineStep >= 0 && (
            <GlowCard customSize glowColor="blue" className="w-full mb-6 !p-5">
              <div className="font-['Lexend:SemiBold',_sans-serif] text-[14px] text-[var(--ink2)] mb-4">Analysis Pipeline</div>
              <div className="flex items-center overflow-x-auto pb-1 scrollbar-hide">
                <PipeStep label="Query Parse" active={pipelineStep === 0} done={pipelineStep > 0} />
                <div className="text-[var(--border2)] mx-1 text-lg shrink-0">→</div>
                <PipeStep label="Literature Fetch" active={pipelineStep === 1} done={pipelineStep > 1} />
                <div className="text-[var(--border2)] mx-1 text-lg shrink-0">→</div>
                <PipeStep label="Embedding Gen" active={pipelineStep === 2} done={pipelineStep > 2} />
                <div className="text-[var(--border2)] mx-1 text-lg shrink-0">→</div>
                <PipeStep label="Novelty Score" active={pipelineStep === 3} done={pipelineStep > 3} />
                <div className="text-[var(--border2)] mx-1 text-lg shrink-0">→</div>
                <PipeStep label="AI Report" active={pipelineStep === 4} done={pipelineStep > 4} />
              </div>
              {pipelineStep < 5 && (
                <div className="flex items-center gap-2 text-xs text-[var(--ink3)] mt-3">
                  <div className="dot-pulse"><span></span><span></span><span></span></div>
                  <span>Processing...</span>
                </div>
              )}
            </GlowCard>
          )}

          {/* RESULTS */}
          {analysisResult && (
            <div className="flex flex-col gap-6">
              <GlowCard customSize glowColor="blue" className="w-full !p-6">
                <div className="flex justify-between w-full mb-6">
                  <div className="flex items-center gap-2 font-['Lexend:SemiBold',_sans-serif] text-[15px] text-[var(--ink2)]">
                    <Info size={16} className="text-[#1a56db]" />
                    Novelty Intelligence Report
                  </div>
                  <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] px-2.5 py-0.5 rounded-full text-[11px] font-medium">Saturation: {analysisResult.saturation_level}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] gap-8 items-center">
                  <div className="w-[110px] h-[110px] relative mx-auto">
                    <svg viewBox="0 0 110 110" className="w-full h-full transform -rotate-90">
                      <circle cx="55" cy="55" r="46" fill="none" stroke="#f1f3f5" strokeWidth="10"/>
                      <circle cx="55" cy="55" r="46" fill="none" stroke="#1a56db" strokeWidth="10" strokeLinecap="round" strokeDasharray="289" strokeDashoffset={289 - (analysisResult.novelty_score / 100 * 289)} className="transition-all duration-1000"/>
                    </svg>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="font-mono text-[26px] font-medium text-[var(--ink)]">{analysisResult.novelty_score}</div>
                      <div className="text-[10px] text-[var(--ink3)] -mt-1">/ 100</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    <BarRow label="Semantic distance" val={analysisResult.components.semantic_distance} color="#1a56db" />
                    <BarRow label="Topic rarity" val={analysisResult.components.topic_rarity} color="#0e9f6e" />
                    <BarRow label="Emerging trend" val={analysisResult.components.emerging_trend} color="#e3a008" />
                  </div>
                </div>
              </GlowCard>

              <GlowCard customSize glowColor="purple" className="w-full !p-6">
                <div className="font-['Lexend:SemiBold',_sans-serif] text-[15px] text-[var(--ink2)] mb-4">AI Scientific Analysis</div>
                <div className="relative text-[13px] text-gray-700 leading-relaxed pl-4 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-[#1a56db] before:rounded-full">
                  {analysisResult.analysis.split("\n").map((para: string, i: number) => (
                    <p key={i} className="mb-4 last:mb-0">
                      {para}
                    </p>
                  ))}
                </div>
              </GlowCard>
            </div>
          )}
        </div>

        {/* DASHBOARD PAGE */}
        <div className={activePage === "dashboard" ? "block" : "hidden"}>
          <div className="mb-6 pb-4 border-b border-white/20">
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-cyan-300 mb-1 drop-shadow-[0_0_12px_rgba(103,232,249,0.6)]">Research Intelligence Dashboard</h1>
            <p className="text-[14px] text-cyan-100/70 drop-shadow-sm">Overview of your research portfolio and novelty landscape</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            <Metric title="Analyses Run" value="2" sub="↑ 2 this week" />
            <Metric title="Avg Novelty Score" value="83" sub="High potential" />
            <Metric title="Papers Indexed" value="147" sub="From 5 sources" />
            <Metric title="Gaps Identified" value="12" sub="Across 3 topics" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="card-title">Recent Analyses</div>
              <div className="p-3 border border-[var(--border)] rounded-lg mb-2 cursor-pointer hover:border-[var(--accent)] hover:bg-[#f8fbff] transition-all" onClick={() => {loadExample('5lox'); setActivePage('analyze');}}>
                <div className="text-[13px] font-medium text-[var(--ink)] mb-1">5-LOX / Ferroptosis in OIPN (Zileuton)</div>
                <div className="flex justify-between text-[11px] text-[var(--ink3)]">
                  <span>Today</span>
                  <span className="font-mono bg-[#f0fdf4] text-[#166534] px-2 py-0.5 rounded">87/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COPILOT PAGE */}
        <div className={activePage === "copilot" ? "block" : "hidden"}>
          <div className="mb-6 pb-4 border-b border-white/20">
            <h1 className="font-[var(--font-serif)] text-3xl font-light text-cyan-300 mb-1 drop-shadow-[0_0_12px_rgba(103,232,249,0.6)]">AI Scientific Copilot</h1>
            <p className="text-[14px] text-cyan-100/70 drop-shadow-sm">Chat with a pharma-specialized AI for research guidance</p>
          </div>
          <div className="h-[420px] overflow-y-auto border border-[var(--border)] rounded-[14px] p-4 mb-3 bg-[var(--surface2)] flex flex-col">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`mb-3.5 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-[13px] leading-relaxed ${msg.role === 'user' ? 'bg-[var(--accent)] text-white rounded-t-xl rounded-bl-xl rounded-br-sm' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] rounded-t-xl rounded-br-xl rounded-bl-sm'}`} dangerouslySetInnerHTML={{__html: msg.content}} />
              </div>
            ))}
            {chatTyping && (
              <div className="mb-3.5 flex justify-start">
                <div className="max-w-[85%] p-3 text-[13px] leading-relaxed bg-[var(--surface)] border border-[var(--border)] text-[var(--ink)] rounded-t-xl rounded-br-xl rounded-bl-sm">
                  <div className="dot-pulse"><span></span><span></span><span></span></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 bg-white/10 text-white placeholder:text-white/60 border border-white/20 rounded-lg px-4 py-2.5 text-[13px] outline-none focus:border-cyan-400 focus:bg-white/20 transition-all shadow-inner"
              placeholder="Ask about research gaps, mechanisms, biomarkers..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendCopilotMsg()}
            />
            <button className="btn btn-primary" onClick={() => sendCopilotMsg()}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components

function NavItem({ active, onClick, icon, label }: any) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 py-2 px-3 rounded-full cursor-pointer text-[13px] transition-all relative overflow-hidden mb-1.5 border ${
        active 
          ? "bg-[#f0f5ff] text-[#1a56db] border-[#1a56db]/20 shadow-sm" 
          : "text-white/80 border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white"
      }`}
    >
      {active && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1a56db]" />}
      <div className={`w-5 h-5 flex items-center justify-center shrink-0 ${active ? "text-[#1a56db]" : "text-white/50"}`}>{icon}</div>
      <div className={active ? "font-medium" : "font-normal"}>{label}</div>
    </div>
  );
}

function Tag({ children, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="inline-flex items-center gap-1 bg-[var(--surface2)] border border-[var(--border)] text-[var(--ink2)] text-[11px] px-2 py-0.5 rounded-full cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
    >
      {children}
    </div>
  );
}

function PipeStep({ label, active, done }: any) {
  let className = "shrink-0 border rounded-full px-3.5 py-1 text-[11px] font-medium text-center min-w-[80px] ";
  if (done) className += "bg-[#e8f5e9] border-[#c8e6c9] text-[#2e7d32]";
  else if (active) className += "bg-white border-[#bfdbfe] text-[#1a56db] shadow-sm";
  else className += "bg-white/50 border-white/40 text-[var(--ink3)]";

  return <div className={className}>{label}</div>;
}

function BarRow({ label, val, color }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[12px] text-[var(--ink2)] w-[120px] shrink-0">{label}</div>
      <div className="flex-1 h-2 bg-white/60 border border-white/40 rounded-full overflow-hidden shadow-inner">
        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${val}%`, backgroundColor: color }} />
      </div>
      <div className="text-[11px] font-mono text-[var(--ink3)] w-[24px] text-right">{val}</div>
    </div>
  );
}

function Metric({ title, value, sub }: any) {
  return (
    <div className="bg-[var(--surface2)] rounded-lg p-3">
      <div className="text-[11px] text-[var(--ink3)] mb-1">{title}</div>
      <div className="text-[22px] font-medium font-mono text-[var(--ink)]">{value}</div>
      <div className="text-[11px] text-[var(--ink3)] mt-0.5">{sub}</div>
    </div>
  );
}
