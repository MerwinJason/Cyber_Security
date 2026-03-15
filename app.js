/* ============================================
   CYBERSEC MANUFACTURING — APP.JS
   Core + Data + Rendering + Games + Chat
   ============================================ */

// ---- PROGRESS STATE ----
const state = {
    currentSection: 'dashboard',
    progress: JSON.parse(localStorage.getItem('csm_progress') || '{}'),
    quizScores: JSON.parse(localStorage.getItem('csm_scores') || '{}'),
    streak: parseInt(localStorage.getItem('csm_streak') || '0'),
    lastVisit: localStorage.getItem('csm_lastVisit') || ''
};
function saveState(){localStorage.setItem('csm_progress',JSON.stringify(state.progress));localStorage.setItem('csm_scores',JSON.stringify(state.quizScores));localStorage.setItem('csm_streak',state.streak);localStorage.setItem('csm_lastVisit',new Date().toDateString());}
function getP(id){return state.progress[id]||0;}
function setP(id,v){state.progress[id]=Math.min(100,Math.max(getP(id),v));saveState();updateSidebarProgress();}

// Check streak
(function(){const today=new Date().toDateString();const last=state.lastVisit;if(last){const d1=new Date(last),d2=new Date(today),diff=Math.floor((d2-d1)/(1000*60*60*24));if(diff===1)state.streak++;else if(diff>1)state.streak=1;}else{state.streak=1;}saveState();})();

// ---- SESSION META ----
const sessions=[
{id:'session1',icon:'🏭',title:'Introduction to CSM',subtitle:'CIA Triad, IT vs OT, Real-World Attacks'},
{id:'session2',icon:'🌐',title:'Networking Basics',subtitle:'OSI/TCP-IP, IP Addressing, Protocols'},
{id:'session3',icon:'🏢',title:'Enterprise IT Security',subtitle:'OWASP Top 10, Zero Trust, Defense-in-Depth'},
{id:'session4',icon:'⚙️',title:'Industrial Networks & OT',subtitle:'PLC, SCADA, DCS, Purdue Model'},
{id:'session5',icon:'📡',title:'Industrial Protocols',subtitle:'Modbus, DNP3, Profibus Security'},
{id:'session6',icon:'☁️',title:'Cloud Security',subtitle:'Shared Responsibility, IAM, Best Practices'}
];

// ---- QUIZ DATA ----
const quizData={
session1:[
{q:"The CIA Triad stands for:",opts:["Control, Intelligence, Access","Confidentiality, Integrity, Availability","Cybersecurity, Information, Automation","Central Intelligence Agency"],ans:1,exp:"CIA = Confidentiality, Integrity, Availability — the three pillars of information security."},
{q:"OT systems prioritize ___ over confidentiality:",opts:["Speed","Cost","Availability & Safety","Encryption"],ans:2,exp:"OT prioritizes Availability & Safety because downtime can cause physical harm or production loss."},
{q:"Stuxnet targeted:",opts:["Email servers","Cloud databases","Siemens PLCs","Wi-Fi routers"],ans:2,exp:"Stuxnet reprogrammed Siemens PLCs controlling centrifuges in Iran's nuclear facility."},
{q:"Colonial Pipeline attack vector was:",opts:["USB drive","Compromised VPN credentials (no MFA)","Physical break-in","Wi-Fi hacking"],ans:1,exp:"Attackers used stolen VPN credentials without MFA to access IT systems, leading to voluntary OT shutdown."},
{q:"An attack surface includes:",opts:["Only firewalls","Only software","All exposed points: devices, ports, people, protocols","Only passwords"],ans:2,exp:"Attack surface = total area exposed to threats — every device, open port, user, and protocol."},
{q:"In the Oldsmar water attack, the attacker changed:",opts:["Water temperature","Sodium hydroxide levels from 100 to 11,100 ppm","Network passwords","PLC firmware"],ans:1,exp:"The attacker used TeamViewer (no MFA) to access HMI and increase lye to dangerous levels."},
{q:"Integrity violation in OT means:",opts:["System goes offline","Data or logic is secretly altered","Passwords are stolen","Network is slow"],ans:1,exp:"Integrity attacks silently modify data or control logic — the hardest to detect in OT."},
{q:"Norsk Hydro damage was approximately:",opts:["$1 million","$10 million","$60-70 million","$500 million"],ans:2,exp:"LockerGoga ransomware cost Norsk Hydro $60-70M in damages and weeks of production disruption."}
],
session2:[
{q:"The OSI model has how many layers?",opts:["4","5","6","7"],ans:3,exp:"OSI = 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application."},
{q:"HTTPS uses port:",opts:["80","22","443","502"],ans:2,exp:"Port 443 = HTTPS (encrypted web traffic). Port 80 = HTTP (unencrypted)."},
{q:"ARP resolves:",opts:["Domain to IP","IP to MAC address","MAC to IP","Port to protocol"],ans:1,exp:"ARP maps IP addresses to MAC addresses on the local network."},
{q:"TCP uses a ___ handshake:",opts:["2-way","3-way","4-way","5-way"],ans:1,exp:"TCP: SYN → SYN-ACK → ACK. This 3-way handshake establishes reliable connections."},
{q:"DHCP process order is:",opts:["SYN-ACK-FIN","DORA","GET-POST","ARP-DNS"],ans:1,exp:"DHCP DORA: Discover → Offer → Request → Acknowledge."},
{q:"A DMZ is:",opts:["A type of malware","A buffer zone between external and internal networks","A DNS server","An encryption method"],ans:1,exp:"DMZ isolates public-facing services from the internal trusted network."},
{q:"IPS differs from IDS by:",opts:["Only logging threats","Actively blocking threats","Being cheaper","Using more bandwidth"],ans:1,exp:"IPS actively blocks malicious traffic. IDS only detects and alerts."},
{q:"Private IP range 192.168.x.x is Class:",opts:["A","B","C","D"],ans:2,exp:"192.168.x.x is a Class C private range with default subnet mask /24 (254 hosts)."}
],
session3:[
{q:"OWASP A1 is:",opts:["SQL Injection","Broken Access Control","Cryptographic Failures","XSS"],ans:1,exp:"A1 = Broken Access Control — users act outside their intended permissions."},
{q:"Zero Trust principle:",opts:["Trust but verify","Never trust, always verify","Trust internal networks","Verify once"],ans:1,exp:"Zero Trust: every access request is fully authenticated, authorized, and encrypted."},
{q:"Defense-in-Depth uses:",opts:["One strong firewall","Multiple overlapping security layers","Only encryption","Physical guards only"],ans:1,exp:"Multiple layers ensure if one fails, others still protect. Perimeter → Network → Endpoint → App → Data → User."},
{q:"SIEM is used for:",opts:["Code deployment","Security monitoring and event management","Hardware setup","Database design"],ans:1,exp:"SIEM collects and analyzes logs across systems for real-time threat detection."},
{q:"SSRF (A10) allows attackers to:",opts:["Steal passwords directly","Trick servers into making internal requests","Delete databases","Bypass firewalls physically"],ans:1,exp:"SSRF tricks the server into requesting internal/external resources on the attacker's behalf."},
{q:"Security Misconfiguration includes:",opts:["Strong passwords","Default credentials left unchanged","Network segmentation","MFA enforcement"],ans:1,exp:"Leaving default admin/admin credentials is a classic security misconfiguration."}
],
session4:[
{q:"PLC stands for:",opts:["Private Local Computer","Programmable Logic Controller","Protocol Layer Controller","Personal Login Certificate"],ans:1,exp:"PLCs are industrial computers controlling machinery in real-time."},
{q:"SCADA is used for:",opts:["Email management","Centralized monitoring and control of industrial equipment","Web development","Accounting"],ans:1,exp:"SCADA = Supervisory Control and Data Acquisition for industrial process management."},
{q:"Purdue Model DMZ sits between:",opts:["Level 0-1","Level 1-2","Level 2-3","Level 3-4"],ans:3,exp:"DMZ buffer zone between Level 3 (OT Operations) and Level 4 (Enterprise IT)."},
{q:"DCS is best for:",opts:["Email","Continuous process control","Web hosting","Gaming"],ans:1,exp:"DCS excels at continuous process control in chemical plants, refineries, power plants."},
{q:"A data diode enforces:",opts:["Two-way encrypted comms","One-way data flow","Wireless connectivity","Cloud sync"],ans:1,exp:"Data diodes allow data out (monitoring) but block commands from being injected back in."},
{q:"Force output attack exploits:",opts:["Strong auth","Unauthenticated PLC output control","Encrypted comms","Physical access"],ans:1,exp:"Force output functionality requires no authentication — anyone with access can control motors/valves."}
],
session5:[
{q:"Modbus was created in:",opts:["1999","2010","1979","1990"],ans:2,exp:"Modbus by Modicon, 1979 — oldest widely-used industrial protocol."},
{q:"Modbus's biggest weakness:",opts:["Speed","No authentication or encryption","Cost","Complexity"],ans:1,exp:"Modbus sends everything in clear text with no authentication whatsoever."},
{q:"DNP3 was designed for:",opts:["Web apps","Electric utilities","Social media","Gaming"],ans:1,exp:"DNP3 = reliable communication for electric grids, water systems in noisy environments."},
{q:"DNP3-SA adds:",opts:["Speed","Authentication and encryption","Wireless","Cloud support"],ans:1,exp:"DNP3-SA (Secure Authentication) fixes legacy vulnerabilities with crypto."},
{q:"Profibus-DP max speed:",opts:["31.25 kbit/s","1 Mbit/s","12 Mbit/s","100 Mbit/s"],ans:2,exp:"Profibus-DP supports up to 12 Mbit/s for high-speed factory automation."},
{q:"A replay attack:",opts:["Guesses passwords","Captures and resends valid packets","Encrypts data","Scans ports"],ans:1,exp:"Replay attacks record valid transmissions and resend them to trick systems."}
],
session6:[
{q:"In shared responsibility, who secures data?",opts:["Provider only","Customer","Both equally","Neither"],ans:1,exp:"Customer secures their data, access policies, and application configuration."},
{q:"CSPM tools detect:",opts:["Physical intrusions","Cloud misconfigurations","Code bugs","Hardware failures"],ans:1,exp:"CSPM auto-scans for misconfigurations, compliance issues in cloud environments."},
{q:"Principle of Least Privilege means:",opts:["Max access for everyone","Minimum necessary access only","No access controls","Admin access for speed"],ans:1,exp:"PoLP: users get only the minimum access required for their specific role."},
{q:"MFA requires:",opts:["Only password","2+ authentication factors","Only biometrics","Only tokens"],ans:1,exp:"MFA: something you know + something you have + something you are."},
{q:"AES-256 protects data:",opts:["In transit","At rest","Both","Neither"],ans:1,exp:"AES-256 is primarily used for encrypting data at rest in databases and storage."},
{q:"Cloud vendor lock-in means:",opts:["Enhanced security","Dependency on one provider","Free services","Open-source"],ans:1,exp:"Lock-in creates risky dependency, making migration difficult and expensive."}
]
};

// ---- GAME DATA ----
const gameData={
session1:{title:'🎯 CIA Triad Classifier',desc:'Drag each threat into the correct CIA category',
items:[{text:'Stolen product designs',cat:'Confidentiality'},{text:'PLC logic silently modified',cat:'Integrity'},{text:'Ransomware locks HMI',cat:'Availability'},{text:'SCADA credentials leaked',cat:'Confidentiality'},{text:'Temperature setpoints altered',cat:'Integrity'},{text:'DDoS shuts down SCADA',cat:'Availability'},{text:'Insider downloads configs',cat:'Confidentiality'},{text:'Wrong firmware uploaded',cat:'Integrity'},{text:'Power failure disables controls',cat:'Availability'}]},
session2:{title:'⚡ Port Scanner Challenge',desc:'Match protocols to port numbers — beat the clock!',
pairs:[{proto:'HTTP',port:'80'},{proto:'HTTPS',port:'443'},{proto:'SSH',port:'22'},{proto:'FTP',port:'21'},{proto:'DNS',port:'53'},{proto:'RDP',port:'3389'},{proto:'SMTP',port:'25'},{proto:'Modbus',port:'502'},{proto:'Telnet',port:'23'},{proto:'SNMP',port:'161'}]},
session3:{title:'🛡️ Defense-in-Depth Builder',desc:'Arrange security layers from outermost (perimeter) to innermost (user)',
layers:[{name:'Perimeter — Firewalls, IDS/IPS',order:1},{name:'Network — VLANs, Segmentation',order:2},{name:'Endpoint — Antivirus, EDR',order:3},{name:'Application — Code review, WAF',order:4},{name:'Data — Encryption, DLP',order:5},{name:'User — MFA, Security Training',order:6}]},
session4:{title:'🏗️ Purdue Level Sorter',desc:'Drag components to their correct Purdue level',
items:[{text:'Sensors & Actuators',level:'Level 0'},{text:'PLCs & Controllers',level:'Level 1'},{text:'SCADA & HMI',level:'Level 2'},{text:'MES & Historian',level:'Level 3'},{text:'ERP & Cloud',level:'Level 4'},{text:'Motors & Valves',level:'Level 0'},{text:'Engineering Workstation',level:'Level 2'},{text:'Email & CRM',level:'Level 4'}],
zones:['Level 0','Level 1','Level 2','Level 3','Level 4']},
session5:{title:'🔗 Protocol Vulnerability Match',desc:'Match each vulnerability/feature to its protocol',
pairs:[{left:'No auth, no encryption, clear-text',right:'Modbus'},{left:'Legacy lacks encryption, SA variant fixes it',right:'DNP3'},{left:'Proprietary, RS-485, no built-in security',right:'Profibus'},{left:'Broadcast suppression missing (serial)',right:'Modbus'},{left:'Supports timestamps, designed for utilities',right:'DNP3'},{left:'Two types: DP (factory) and PA (hazardous)',right:'Profibus'}]},
session6:{title:'🔍 Cloud Config Audit',desc:'Flag all misconfigurations in this cloud dashboard',
configs:[{setting:'S3 Bucket Access',status:'Public',isVuln:true,fix:'Disable public access'},{setting:'Root Account MFA',status:'Disabled',isVuln:true,fix:'Enable MFA immediately'},{setting:'Database Encryption',status:'AES-256',isVuln:false},{setting:'API Gateway Auth',status:'None Required',isVuln:true,fix:'Require API keys/OAuth'},{setting:'CloudTrail Logging',status:'Disabled',isVuln:true,fix:'Enable audit logging'},{setting:'VPC Flow Logs',status:'Enabled',isVuln:false},{setting:'Password Policy',status:'6 chars, no complexity',isVuln:true,fix:'12+ chars with complexity'},{setting:'Security Groups',status:'0.0.0.0/0 inbound',isVuln:true,fix:'Restrict to specific IPs'},{setting:'TLS Version',status:'TLS 1.3',isVuln:false},{setting:'Inactive IAM Users',status:'5 users > 90 days',isVuln:true,fix:'Remove inactive users'}]}
};

// ============================================
//  PARTICLE BACKGROUND
// ============================================
(function(){
const c=document.getElementById('particleCanvas'),ctx=c.getContext('2d');
let w,h,particles=[];
function resize(){w=c.width=window.innerWidth;h=c.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
for(let i=0;i<60;i++)particles.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*2+0.5});
function draw(){ctx.clearRect(0,0,w,h);particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>w)p.vx*=-1;if(p.y<0||p.y>h)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle='rgba(0,255,204,0.4)';ctx.fill();for(let j=i+1;j<particles.length;j++){const q=particles[j],dx=p.x-q.x,dy=p.y-q.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<120){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(0,255,204,${0.15*(1-dist/120)})`;ctx.stroke();}}});requestAnimationFrame(draw);}
draw();
})();

// ============================================
//  NAVIGATION
// ============================================
const contentArea=document.getElementById('contentArea');
const navLinks=document.querySelectorAll('.nav-link');
const pageTitle=document.getElementById('pageTitle');
const sidebar=document.getElementById('sidebar');

document.getElementById('hamburger').addEventListener('click',()=>sidebar.classList.toggle('open'));
document.getElementById('sidebarClose').addEventListener('click',()=>sidebar.classList.remove('open'));

navLinks.forEach(link=>{
    link.addEventListener('click',e=>{
        e.preventDefault();
        const section=link.dataset.section;
        navLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
        state.currentSection=section;
        sidebar.classList.remove('open');
        renderSection(section);
    });
});

function renderSection(id){
    if(id==='dashboard') return renderDashboard();
    const idx=sessions.findIndex(s=>s.id===id);
    if(idx>=0) renderSession(sessions[idx]);
}

function updateSidebarProgress(){
    const total=sessions.reduce((a,s)=>a+getP(s.id),0);
    const pct=Math.round(total/(sessions.length*100)*100);
    const ring=document.getElementById('overallProgressRing');
    const circ=163.36;
    ring.style.strokeDashoffset=circ-(circ*pct/100);
    document.getElementById('overallProgressText').textContent=pct+'%';
    document.getElementById('streakBadge').textContent='🔥 '+state.streak;
}

// ============================================
//  DASHBOARD
// ============================================
function renderDashboard(){
    pageTitle.textContent='Dashboard';
    const totalQ=Object.values(state.quizScores).reduce((a,v)=>a+(v.total||0),0);
    const correctQ=Object.values(state.quizScores).reduce((a,v)=>a+(v.correct||0),0);
    const avgPct=totalQ?Math.round(correctQ/totalQ*100):0;
    const completedS=sessions.filter(s=>getP(s.id)>=100).length;

    let html=`<div class="stat-cards animate-in">
        <div class="stat-card"><div class="stat-value">${completedS}/6</div><div class="stat-label">Sessions Completed</div></div>
        <div class="stat-card"><div class="stat-value">${avgPct}%</div><div class="stat-label">Quiz Average</div></div>
        <div class="stat-card"><div class="stat-value">${totalQ}</div><div class="stat-label">Questions Answered</div></div>
        <div class="stat-card"><div class="stat-value">${state.streak}</div><div class="stat-label">Day Streak 🔥</div></div>
    </div>
    <h3 class="section-title">Sessions</h3>
    <div class="dashboard-grid">`;

    sessions.forEach((s,i)=>{
        const p=getP(s.id);
        const sc=state.quizScores[s.id];
        const qText=sc?`${sc.correct}/${sc.total} correct`:'Not attempted';
        html+=`<div class="session-card animate-in" onclick="navigateTo('${s.id}')">
            <div class="sc-header"><span class="sc-icon">${s.icon}</span><div><div class="sc-title">Session ${i+1}: ${s.title}</div><div class="sc-subtitle">${s.subtitle}</div></div></div>
            <div class="sc-progress-bar"><div class="sc-progress-fill" style="width:${p}%"></div></div>
            <div class="sc-stats"><span>${p}% complete</span><span>Quiz: ${qText}</span></div>
        </div>`;
    });
    html+='</div>';
    contentArea.innerHTML=html;
}

function navigateTo(id){
    navLinks.forEach(l=>{l.classList.remove('active');if(l.dataset.section===id)l.classList.add('active');});
    state.currentSection=id;
    renderSection(id);
}

// ============================================
//  SESSION RENDERER
// ============================================
function renderSession(s){
    const data=sessionContent[s.id];
    const idx=sessions.indexOf(s);
    pageTitle.textContent=`Session ${idx+1}: ${s.title}`;
    setP(s.id,10); // Mark as started

    let html=`<div class="session-hero animate-in"><h2>${s.icon} ${data.hero.title}</h2><p>${data.hero.desc}</p></div>`;

    // Tabs
    html+=`<div class="tab-bar">
        <button class="tab-btn active" onclick="switchTab(this,'concepts')">📖 Concepts</button>
        <button class="tab-btn" onclick="switchTab(this,'flashcards')">🃏 Flashcards</button>
        <button class="tab-btn" onclick="switchTab(this,'quiz')">❓ Quiz</button>
        <button class="tab-btn" onclick="switchTab(this,'game')">🎮 Game</button>
    </div>`;

    // Concepts tab
    html+='<div class="tab-content active" id="tab-concepts">';
    data.concepts.forEach(c=>{
        html+=`<div class="concept-card animate-in"><h4>${c.title}</h4>${c.body}</div>`;
    });
    if(data.caseStudies&&data.caseStudies.length){
        html+='<h3 class="section-title">📋 Real-World Case Studies</h3>';
        data.caseStudies.forEach(cs=>{
            html+=`<div class="case-study animate-in"><h4>⚠️ ${cs.name}</h4><p class="cs-detail">${cs.detail}</p><p class="cs-detail"><strong>Impact:</strong> ${cs.impact}</p><p class="cs-detail"><strong>Lesson:</strong> ${cs.lesson}</p></div>`;
        });
    }
    html+='<div class="key-takeaway"><h4>✅ Key Takeaway</h4><p>You\'ve reviewed all concepts for this session. Test your knowledge with the Quiz and Game tabs!</p></div>';
    html+='</div>';

    // Flashcards tab
    html+='<div class="tab-content" id="tab-flashcards"><h3 class="section-title">🃏 Flashcards — Click to Flip</h3><div class="flashcard-grid">';
    (data.flashcards||[]).forEach(fc=>{
        html+=`<div class="flashcard" onclick="this.classList.toggle('flipped')"><div class="flashcard-inner"><div class="flashcard-front"><h5>📌 Term</h5><p>${fc.front}</p></div><div class="flashcard-back"><p>${fc.back}</p></div></div></div>`;
    });
    html+='</div></div>';

    // Quiz tab
    html+=`<div class="tab-content" id="tab-quiz"><h3 class="section-title">❓ Quiz — Test Your Knowledge</h3><div id="quizArea-${s.id}"></div></div>`;

    // Game tab
    html+=`<div class="tab-content" id="tab-game"><h3 class="section-title">🎮 Interactive Game</h3><div id="gameArea-${s.id}"></div></div>`;

    contentArea.innerHTML=html;
    renderQuiz(s.id);
    renderGame(s.id);
}

function switchTab(btn,tab){
    btn.parentElement.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
    document.getElementById('tab-'+tab).classList.add('active');
    const sid=state.currentSection;
    if(tab==='concepts')setP(sid,Math.max(getP(sid),30));
    if(tab==='flashcards')setP(sid,Math.max(getP(sid),50));
}

// ============================================
//  QUIZ ENGINE
// ============================================
function renderQuiz(sid){
    const questions=quizData[sid];if(!questions)return;
    const area=document.getElementById('quizArea-'+sid);if(!area)return;
    let answered=new Array(questions.length).fill(null);
    let html='';
    questions.forEach((q,i)=>{
        html+=`<div class="quiz-question" id="qq-${sid}-${i}"><div class="qq-text"><span class="qq-num">Q${i+1}.</span> ${q.q}</div>`;
        const letters='ABCD';
        q.opts.forEach((o,j)=>{
            html+=`<div class="quiz-option" data-qi="${i}" data-oi="${j}" onclick="selectQuizOption('${sid}',${i},${j})"><span class="opt-letter">${letters[j]}</span><span>${o}</span></div>`;
        });
        html+=`<div class="quiz-feedback" id="qf-${sid}-${i}"></div></div>`;
    });
    html+=`<div class="quiz-actions"><button class="btn btn-primary" onclick="submitQuiz('${sid}')">Submit All</button><button class="btn btn-secondary" onclick="resetQuiz('${sid}')">Reset</button></div><div id="quizScore-${sid}"></div>`;
    area.innerHTML=html;
    window['quizAnswered_'+sid]=answered;
}

window.selectQuizOption=function(sid,qi,oi){
    const opts=document.querySelectorAll(`#qq-${sid}-${qi} .quiz-option`);
    opts.forEach(o=>o.classList.remove('selected'));
    opts[oi].classList.add('selected');
    window['quizAnswered_'+sid][qi]=oi;
};

window.submitQuiz=function(sid){
    const questions=quizData[sid];
    const answered=window['quizAnswered_'+sid];
    let correct=0;
    questions.forEach((q,i)=>{
        const opts=document.querySelectorAll(`#qq-${sid}-${i} .quiz-option`);
        const fb=document.getElementById(`qf-${sid}-${i}`);
        opts.forEach(o=>o.style.pointerEvents='none');
        if(answered[i]===q.ans){
            correct++;opts[q.ans].classList.add('correct');
            fb.className='quiz-feedback show correct';fb.textContent='✅ Correct! '+q.exp;
        }else{
            if(answered[i]!==null)opts[answered[i]].classList.add('wrong');
            opts[q.ans].classList.add('correct');
            fb.className='quiz-feedback show wrong';fb.textContent='❌ Incorrect. '+q.exp;
        }
    });
    state.quizScores[sid]={correct,total:questions.length};saveState();
    const pct=Math.round(correct/questions.length*100);
    document.getElementById('quizScore-'+sid).innerHTML=`<div class="score-display"><div class="score-value">${correct}/${questions.length}</div><div class="score-label">Score: ${pct}%</div></div>`;
    setP(sid,Math.max(getP(sid),70+(pct>=80?30:0)));
    updateSidebarProgress();
};

window.resetQuiz=function(sid){renderQuiz(sid);};

// ============================================
//  GAME ENGINES
// ============================================
function renderGame(sid){
    const area=document.getElementById('gameArea-'+sid);if(!area)return;
    const g=gameData[sid];if(!g)return;

    if(sid==='session1') renderDragDropGame(area,g,sid);
    else if(sid==='session2') renderPortGame(area,g,sid);
    else if(sid==='session3') renderDefenseGame(area,g,sid);
    else if(sid==='session4') renderPurdueGame(area,g,sid);
    else if(sid==='session5') renderMatchGame(area,g,sid);
    else if(sid==='session6') renderAuditGame(area,g,sid);
}

// S1: CIA drag-and-drop
function renderDragDropGame(area,g,sid){
    const shuffled=[...g.items].sort(()=>Math.random()-0.5);
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><span class="game-score" id="gs-${sid}">0/${g.items.length}</span></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    html+='<div class="drag-zone" id="dragzone-'+sid+'">';
    shuffled.forEach((item,i)=>{html+=`<div class="drag-item" draggable="true" data-cat="${item.cat}" data-idx="${i}" id="di-${sid}-${i}">${item.text}</div>`;});
    html+='</div><div class="drop-zones">';
    ['Confidentiality','Integrity','Availability'].forEach(cat=>{
        html+=`<div class="drop-zone" data-cat="${cat}" id="dz-${sid}-${cat}"><h5>🔒 ${cat}</h5></div>`;
    });
    html+='</div><button class="btn btn-secondary" style="margin-top:16px" onclick="renderGame(\''+sid+'\')">🔄 Reset</button></div>';
    area.innerHTML=html;

    let score=0;
    area.querySelectorAll('.drag-item').forEach(el=>{
        el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.id));
    });
    area.querySelectorAll('.drop-zone').forEach(zone=>{
        zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});
        zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
        zone.addEventListener('drop',e=>{
            e.preventDefault();zone.classList.remove('drag-over');
            const id=e.dataTransfer.getData('text/plain');
            const item=document.getElementById(id);if(!item||item.classList.contains('placed'))return;
            if(item.dataset.cat===zone.dataset.cat){
                score++;item.classList.add('placed');item.style.background='rgba(34,197,94,0.2)';item.style.borderColor='#22c55e';
                zone.appendChild(item);item.draggable=false;
                document.getElementById('gs-'+sid).textContent=score+'/'+g.items.length;
                if(score===g.items.length)setP(sid,100);
            }else{item.style.animation='wrongShake 0.5s ease';setTimeout(()=>item.style.animation='',500);}
        });
    });
}

// S2: Port Scanner timer game
function renderPortGame(area,g,sid){
    const shuffled=[...g.pairs].sort(()=>Math.random()-0.5);
    let qi=0,score=0,timeLeft=60;
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><div><span class="game-score" id="gs-${sid}">${score}/${g.pairs.length}</span> &nbsp; <span class="game-timer" id="gt-${sid}">${timeLeft}s</span></div></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    html+=`<div class="game-prompt" id="gp-${sid}">Which port does <strong>${shuffled[0].proto}</strong> use?</div>`;
    const allPorts=[...new Set(g.pairs.map(p=>p.port))].sort(()=>Math.random()-0.5);
    html+='<div class="port-game-grid">';
    allPorts.forEach(port=>{html+=`<button class="port-btn" data-port="${port}" id="pb-${sid}-${port}">Port ${port}</button>`;});
    html+='</div><div id="gr-'+sid+'" class="game-result" style="display:none"></div></div>';
    area.innerHTML=html;

    const timer=setInterval(()=>{timeLeft--;document.getElementById('gt-'+sid).textContent=timeLeft+'s';if(timeLeft<=0){clearInterval(timer);endPortGame();}},1000);

    area.querySelectorAll('.port-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
            if(qi>=shuffled.length)return;
            const correct=shuffled[qi].port;
            if(btn.dataset.port===correct){
                score++;btn.classList.add('correct-pick');setTimeout(()=>btn.classList.remove('correct-pick'),400);
            }else{btn.classList.add('wrong-pick');setTimeout(()=>btn.classList.remove('wrong-pick'),400);document.getElementById('pb-'+sid+'-'+correct).classList.add('correct-pick');setTimeout(()=>document.getElementById('pb-'+sid+'-'+correct).classList.remove('correct-pick'),600);}
            qi++;
            document.getElementById('gs-'+sid).textContent=score+'/'+shuffled.length;
            if(qi<shuffled.length){document.getElementById('gp-'+sid).innerHTML='Which port does <strong>'+shuffled[qi].proto+'</strong> use?';}
            else{clearInterval(timer);endPortGame();}
        });
    });

    function endPortGame(){
        document.getElementById('gr-'+sid).style.display='block';
        document.getElementById('gr-'+sid).innerHTML=`<div class="result-score">${score}/${shuffled.length}</div><p>Time: ${60-timeLeft}s</p><button class="btn btn-primary" style="margin-top:12px" onclick="renderGame('${sid}')">🔄 Play Again</button>`;
        if(score>=shuffled.length*0.7)setP(sid,100);
    }
}

// S3: Defense Builder ordering
function renderDefenseGame(area,g,sid){
    const shuffled=[...g.layers].sort(()=>Math.random()-0.5);
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><span class="game-score" id="gs-${sid}">Arrange layers</span></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    html+='<div class="drag-zone" id="srczone-'+sid+'">';
    shuffled.forEach((l,i)=>{html+=`<div class="drag-item" draggable="true" data-order="${l.order}" id="dl-${sid}-${i}">${l.name}</div>`;});
    html+='</div><div class="defense-slots">';
    for(let i=0;i<g.layers.length;i++){html+=`<div class="defense-slot" data-slot="${i+1}" id="ds-${sid}-${i}"></div>`;}
    html+=`</div><button class="btn btn-primary" style="margin-top:12px" onclick="checkDefense('${sid}',${g.layers.length})">Check Order</button><button class="btn btn-secondary" style="margin-top:12px;margin-left:8px" onclick="renderGame('${sid}')">🔄 Reset</button><div id="gr-${sid}" class="game-result" style="display:none"></div></div>`;
    area.innerHTML=html;

    area.querySelectorAll('.drag-item').forEach(el=>{el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.id));});
    area.querySelectorAll('.defense-slot').forEach(slot=>{
        slot.addEventListener('dragover',e=>{e.preventDefault();slot.classList.add('drag-over');});
        slot.addEventListener('dragleave',()=>slot.classList.remove('drag-over'));
        slot.addEventListener('drop',e=>{
            e.preventDefault();slot.classList.remove('drag-over');
            const id=e.dataTransfer.getData('text/plain');const el=document.getElementById(id);
            if(slot.children.length>0){const prev=slot.children[0];document.getElementById('srczone-'+sid).appendChild(prev);}
            slot.appendChild(el);slot.classList.add('filled');
        });
    });
}

window.checkDefense=function(sid,total){
    const slots=document.querySelectorAll(`[id^="ds-${sid}-"]`);
    let correct=0;
    slots.forEach((slot,i)=>{
        const child=slot.querySelector('.drag-item');
        if(child&&parseInt(child.dataset.order)===i+1){correct++;slot.style.borderColor='#22c55e';child.style.background='rgba(34,197,94,0.2)';}
        else if(child){slot.style.borderColor='#ef4444';child.style.background='rgba(239,68,68,0.2)';}
    });
    document.getElementById('gr-'+sid).style.display='block';
    document.getElementById('gr-'+sid).innerHTML=`<div class="result-score">${correct}/${total}</div><p>${correct===total?'🎉 Perfect! All layers correctly ordered!':'Try again — arrange from Perimeter (outermost) to User (innermost).'}</p>`;
    if(correct===total)setP(sid,100);
};

// S4: Purdue Sorter
function renderPurdueGame(area,g,sid){
    const shuffled=[...g.items].sort(()=>Math.random()-0.5);
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><span class="game-score" id="gs-${sid}">0/${g.items.length}</span></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    html+='<div class="drag-zone" id="pdragzone-'+sid+'">';
    shuffled.forEach((item,i)=>{html+=`<div class="drag-item" draggable="true" data-level="${item.level}" id="pi-${sid}-${i}">${item.text}</div>`;});
    html+='</div><div class="drop-zones">';
    g.zones.forEach(z=>{html+=`<div class="drop-zone" data-cat="${z}" id="pz-${sid}-${z.replace(' ','')}"><h5>🔹 ${z}</h5></div>`;});
    html+='</div><button class="btn btn-secondary" style="margin-top:16px" onclick="renderGame(\''+sid+'\')">🔄 Reset</button></div>';
    area.innerHTML=html;

    let score=0;
    area.querySelectorAll('.drag-item').forEach(el=>{el.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',el.id));});
    area.querySelectorAll('.drop-zone').forEach(zone=>{
        zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag-over');});
        zone.addEventListener('dragleave',()=>zone.classList.remove('drag-over'));
        zone.addEventListener('drop',e=>{
            e.preventDefault();zone.classList.remove('drag-over');
            const id=e.dataTransfer.getData('text/plain');const item=document.getElementById(id);if(!item||item.classList.contains('placed'))return;
            if(item.dataset.level===zone.dataset.cat){score++;item.classList.add('placed');item.style.background='rgba(34,197,94,0.2)';item.style.borderColor='#22c55e';zone.appendChild(item);item.draggable=false;document.getElementById('gs-'+sid).textContent=score+'/'+g.items.length;if(score===g.items.length)setP(sid,100);}
            else{item.style.animation='wrongShake 0.5s ease';setTimeout(()=>item.style.animation='',500);}
        });
    });
}

// S5: Match Game
function renderMatchGame(area,g,sid){
    const lefts=[...g.pairs].sort(()=>Math.random()-0.5);
    const rights=[...new Set(g.pairs.map(p=>p.right))];
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><span class="game-score" id="gs-${sid}">0/${g.pairs.length}</span></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    html+='<div style="margin-bottom:12px"><strong style="color:var(--text-muted)">Select a vulnerability, then click the matching protocol:</strong></div>';
    html+='<div style="margin-bottom:16px">';
    lefts.forEach((p,i)=>{html+=`<div class="match-item" data-right="${p.right}" data-idx="${i}" id="ml-${sid}-${i}" onclick="selectMatchLeft('${sid}',${i})" style="margin-bottom:8px">${p.left}</div>`;});
    html+='</div><div style="display:flex;gap:12px;flex-wrap:wrap">';
    rights.forEach(r=>{html+=`<div class="match-item" data-val="${r}" onclick="selectMatchRight('${sid}','${r}')" style="padding:16px 24px;font-weight:700;color:var(--accent)">${r}</div>`;});
    html+=`</div><div id="gr-${sid}" class="game-result" style="display:none"></div><button class="btn btn-secondary" style="margin-top:16px" onclick="renderGame('${sid}')">🔄 Reset</button></div>`;
    area.innerHTML=html;
    window['matchState_'+sid]={selectedLeft:null,score:0,total:g.pairs.length};
}

window.selectMatchLeft=function(sid,idx){
    const el=document.getElementById('ml-'+sid+'-'+idx);
    if(el.classList.contains('matched'))return;
    document.querySelectorAll(`[id^="ml-${sid}-"]`).forEach(e=>e.classList.remove('selected'));
    el.classList.add('selected');
    window['matchState_'+sid].selectedLeft=idx;
};

window.selectMatchRight=function(sid,val){
    const ms=window['matchState_'+sid];if(ms.selectedLeft===null)return;
    const el=document.getElementById('ml-'+sid+'-'+ms.selectedLeft);
    if(el.dataset.right===val){
        ms.score++;el.classList.remove('selected');el.classList.add('matched');
        document.getElementById('gs-'+sid).textContent=ms.score+'/'+ms.total;
        if(ms.score===ms.total){setP(sid,100);document.getElementById('gr-'+sid).style.display='block';document.getElementById('gr-'+sid).innerHTML='<div class="result-score">🎉 All Matched!</div>';}
    }else{el.classList.add('wrong-flash');setTimeout(()=>el.classList.remove('wrong-flash'),500);}
    ms.selectedLeft=null;
};

// S6: Cloud Audit
function renderAuditGame(area,g,sid){
    let html=`<div class="game-container"><div class="game-header"><h4>${g.title}</h4><span class="game-score" id="gs-${sid}">Flag misconfigurations</span></div><p style="color:var(--text-secondary);margin-bottom:16px">${g.desc}</p>`;
    g.configs.forEach((c,i)=>{
        html+=`<div class="audit-card" id="ac-${sid}-${i}"><div><div class="audit-label">${c.setting}</div><span class="audit-status ${c.isVuln?'insecure':'secure'}">${c.status}</span></div><button onclick="flagAudit('${sid}',${i},${c.isVuln})">🚩 Flag</button></div>`;
    });
    html+=`<button class="btn btn-primary" style="margin-top:16px" onclick="checkAudit('${sid}')">Check Results</button><button class="btn btn-secondary" style="margin-top:16px;margin-left:8px" onclick="renderGame('${sid}')">🔄 Reset</button><div id="gr-${sid}" class="game-result" style="display:none"></div></div>`;
    area.innerHTML=html;
    window['auditFlags_'+sid]=new Set();
}

window.flagAudit=function(sid,idx,isVuln){
    const card=document.getElementById('ac-'+sid+'-'+idx);
    const flags=window['auditFlags_'+sid];
    if(flags.has(idx)){flags.delete(idx);card.classList.remove('flagged');}
    else{flags.add(idx);card.classList.add('flagged');}
};

window.checkAudit=function(sid){
    const g=gameData[sid];const flags=window['auditFlags_'+sid];
    let correct=0;
    g.configs.forEach((c,i)=>{
        const card=document.getElementById('ac-'+sid+'-'+i);
        const flagged=flags.has(i);
        if(flagged===c.isVuln){correct++;card.classList.add('correct-flag');card.classList.remove('wrong-flag');}
        else{card.classList.add('wrong-flag');card.classList.remove('correct-flag');}
        card.querySelector('button').disabled=true;
    });
    document.getElementById('gr-'+sid).style.display='block';
    document.getElementById('gr-'+sid).innerHTML=`<div class="result-score">${correct}/${g.configs.length}</div><p>${correct===g.configs.length?'🎉 Perfect audit!':'Review: flag items that are misconfigured, leave secure ones unflagged.'}</p>`;
    if(correct>=g.configs.length*0.8)setP(sid,100);
};




// ============================================
//  INIT
// ============================================
updateSidebarProgress();
renderDashboard();
