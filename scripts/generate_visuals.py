#!/usr/bin/env python3
"""
VELUNO v3.3 — Automated Visual Vocabulary Generator
Analyzes all 1,320 words across A2, B1, and B2.
Categorizes into:
  - Animation (Type A: motion, change, dynamic action)
  - Static (Type B: concrete objects, places, animals, landscape)
  - Abstract (Type C: conjunctions, abstract discourse particles, complex conceptual nouns)
Generates lightweight, self-contained SVG files in assets/visuals/ and data/visuals-meta.json.
Uses VELUNO's signature soft sapphire blue palette (#2563EB, #3B82F6, #DBEAFE, etc.).
"""

import json
import os
import re
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(ROOT, "data")
VISUALS_DIR = os.path.join(ROOT, "assets", "visuals")
META_PATH = os.path.join(DATA_DIR, "visuals-meta.json")

os.makedirs(VISUALS_DIR, exist_ok=True)

# Abstract words that should strictly NOT have forced misleading visuals
ABSTRACT_STEMS = {
    # Conjunctions & discourse markers
    "although", "however", "despite", "nevertheless", "whereas", "furthermore", "therefore",
    "otherwise", "unless", "since", "while", "though", "moreover", "nonetheless", "besides",
    "albeit", "whereas", "consequently", "likewise", "meanwhile", "notwithstanding",
    # Abstract grammatical adverbs
    "indeed", "probably", "definitely", "especially", "actually", "quite", "rather", "hardly",
    "almost", "already", "yet", "suddenly", "gradually", "barely", "scarcely", "merely", "purely",
    "eventually", "supposedly", "apparently", "presumably", "obviously", "certainly", "truly",
    "typically", "primarily", "largely", "specifically", "virtually", "essentially", "roughly",
    # Abstract high-level concepts & cognitive nouns
    "responsibility", "consciousness", "philosophy", "hypothesis", "tendency", "attitude",
    "curiosity", "dilemma", "phenomenon", "perspective", "consequence", "implication",
    "circumstance", "justification", "obligation", "assumption", "perception", "dimension",
    "concept", "notion", "aspect", "instance", "extent", "criterion", "factor", "principle",
    "context", "framework", "proportion", "variable", "correlation", "distinction", "significance",
    "ambiguity", "relevance", "priority", "morality", "legitimacy", "adequacy", "complexity",
    "random", "relative", "abstract", "inherent", "inevitable", "potential", "arbitrary",
    "feasibility", "reliability", "integrity", "sovereignty", "legitimacy", "autonomy",
    "coherence", "continuity", "validity", "verdict", "discrepancy", "disposition"
}

def is_abstract(word_obj):
    w = word_obj.get("word", "").strip().lower()
    pos = word_obj.get("partOfSpeech", "").lower()
    meanings = [m.lower() for m in word_obj.get("meanings", [])]
    
    if w in ABSTRACT_STEMS:
        return True
    if pos in ("conjunction", "pronoun", "preposition"):
        return True
    
    # Check if meaning suggests abstract conjunction or purely relational discourse marker
    for m in meanings:
        if any(marker in m for marker in ["-e rağmen", "-dığı halde", "buna karşın", "ancak", "oysa", "nitekim", "muhtemelen", "kesinlikle", "neredeyse", "özellikle"]):
            return True
            
    return False

# Base SVG wrapper
def wrap_svg(inner_svg, is_animated=False, css=""):
    motion_css = """
    @media (prefers-reduced-motion: reduce) {
      * { animation: none !important; }
    }
    """ if is_animated else ""
    
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 130" width="100%" height="100%" fill="none" role="img">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="softSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#DBEAFE"/>
      <stop offset="100%" stop-color="#EFF6FF"/>
    </linearGradient>
  </defs>
  <style>
    {motion_css}
    {css}
  </style>
  <rect width="200" height="130" rx="16" fill="url(#bgGrad)"/>
  <rect x="0.5" y="0.5" width="199" height="129" rx="15.5" stroke="#E2E8F0"/>
  {inner_svg}
</svg>"""

# Bespoke templates for key/iconic words
def get_bespoke_svg(w):
    w = w.lower().strip()
    
    # 1. abroad
    if w == "abroad":
        css = """
        .plane { animation: flyAbroad 3.5s infinite ease-in-out; }
        .dashed-trail { stroke-dasharray: 4, 4; animation: trailDash 1.2s linear infinite; }
        @keyframes flyAbroad {
          0% { transform: translate(-8px, 12px) rotate(-4deg); }
          50% { transform: translate(14px, -8px) rotate(3deg); }
          100% { transform: translate(-8px, 12px) rotate(-4deg); }
        }
        @keyframes trailDash { to { stroke-dashoffset: -8; } }
        """
        inner = """
        <circle cx="45" cy="78" r="22" fill="#DBEAFE" opacity="0.6"/>
        <circle cx="45" cy="78" r="4" fill="#2563EB"/>
        <text x="45" y="112" font-size="10" font-family="-apple-system,system-ui,sans-serif" font-weight="600" fill="#64748B" text-anchor="middle">Yerel</text>

        <circle cx="155" cy="52" r="22" fill="#DBEAFE" opacity="0.6"/>
        <circle cx="155" cy="52" r="4" fill="#2563EB"/>
        <text x="155" y="86" font-size="10" font-family="-apple-system,system-ui,sans-serif" font-weight="600" fill="#2563EB" text-anchor="middle">Yurt Dışı</text>

        <path d="M 45 78 Q 100 20, 155 52" stroke="#2563EB" stroke-width="2.5" fill="none" class="dashed-trail"/>

        <g class="plane">
          <path d="M 94 48 L 108 42 L 116 46 L 106 51 L 102 59 L 97 57 L 100 51 L 94 48 Z" fill="#2563EB"/>
          <path d="M 104 44 L 109 35 L 113 37 L 107 46 Z" fill="#1D4ED8"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Ülkeler arasında uçan uçak ve uluslararası seyahat rotası"

    # 2. increase
    if w == "increase":
        css = """
        .chart-line { stroke-dasharray: 180; stroke-dashoffset: 180; animation: drawLine 3s infinite ease-out; }
        .dot-rise { animation: dotPulse 3s infinite ease-out; }
        .bar1 { animation: growBar1 3s infinite ease-out; transform-origin: bottom; }
        .bar2 { animation: growBar2 3s infinite ease-out; transform-origin: bottom; }
        .bar3 { animation: growBar3 3s infinite ease-out; transform-origin: bottom; }
        @keyframes drawLine { 0% { stroke-dashoffset: 180; opacity: 0.2; } 60%, 100% { stroke-dashoffset: 0; opacity: 1; } }
        @keyframes dotPulse { 0%, 20% { transform: scale(0.5); opacity: 0; } 60%, 80% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes growBar1 { 0% { transform: scaleY(0.3); } 60%, 100% { transform: scaleY(1); } }
        @keyframes growBar2 { 0% { transform: scaleY(0.3); } 60%, 100% { transform: scaleY(1); } }
        @keyframes growBar3 { 0% { transform: scaleY(0.3); } 60%, 100% { transform: scaleY(1); } }
        """
        inner = """
        <line x1="35" y1="95" x2="165" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>
        <line x1="35" y1="25" x2="35" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>
        <rect x="50" y="70" width="18" height="25" rx="3" fill="#BFDBFE" class="bar1"/>
        <rect x="85" y="52" width="18" height="43" rx="3" fill="#93C5FD" class="bar2"/>
        <rect x="120" y="34" width="18" height="61" rx="3" fill="#3B82F6" class="bar3"/>
        <path d="M 40 85 L 60 72 L 95 54 L 130 35 L 155 26" stroke="#2563EB" stroke-width="3" stroke-linecap="round" fill="none" class="chart-line"/>
        <circle cx="155" cy="26" r="5" fill="#2563EB" class="dot-rise"/>
        """
        return wrap_svg(inner, True, css), "animation", "Yukarı doğru yükselen büyüme grafiği ve sütunlar"

    # 3. reduce
    if w in ("reduce", "decrease"):
        css = """
        .arrow-down { animation: arrowDrop 2.5s infinite ease-in-out; }
        @keyframes arrowDrop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
        """
        inner = """
        <line x1="35" y1="95" x2="165" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>
        <line x1="35" y1="25" x2="35" y2="95" stroke="#CBD5E1" stroke-width="1.5"/>
        <rect x="50" y="35" width="20" height="60" rx="3" fill="#3B82F6"/>
        <rect x="85" y="55" width="20" height="40" rx="3" fill="#93C5FD"/>
        <rect x="120" y="72" width="20" height="23" rx="3" fill="#BFDBFE"/>
        <g class="arrow-down" transform="translate(150, 40)">
          <path d="M 0 0 L 0 35 M -6 25 L 0 35 L 6 25" stroke="#EF4444" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Aşağı doğru azalan miktar ve düşüş trendi"

    # 4. grow
    if w == "grow":
        css = """
        .sprout { animation: growUp 3s infinite ease-in-out; transform-origin: 100px 95px; }
        .leaf-left { animation: leafL 3s infinite ease-in-out; transform-origin: 100px 65px; }
        .leaf-right { animation: leafR 3s infinite ease-in-out; transform-origin: 100px 60px; }
        @keyframes growUp { 0% { transform: scale(0.65); opacity: 0.6; } 60%, 100% { transform: scale(1.05); opacity: 1; } }
        @keyframes leafL { 0% { transform: rotate(-20deg) scale(0.6); } 60%, 100% { transform: rotate(0deg) scale(1); } }
        @keyframes leafR { 0% { transform: rotate(20deg) scale(0.6); } 60%, 100% { transform: rotate(0deg) scale(1); } }
        """
        inner = """
        <path d="M 40 95 Q 100 93 160 95 L 160 108 L 40 108 Z" fill="#94A3B8" opacity="0.3"/>
        <line x1="30" y1="95" x2="170" y2="95" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
        <g class="sprout">
          <path d="M 100 95 Q 98 60 100 45" stroke="#10B981" stroke-width="4" stroke-linecap="round" fill="none"/>
          <path d="M 100 65 Q 80 55 82 42 Q 95 44 100 65 Z" fill="#34D399" class="leaf-left"/>
          <path d="M 100 58 Q 120 48 118 35 Q 105 38 100 58 Z" fill="#10B981" class="leaf-right"/>
          <circle cx="100" cy="40" r="4" fill="#34D399"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Topraktan filizlenip büyüyen genç yapraklı bitki"

    # 5. disappear
    if w in ("disappear", "vanish"):
        css = """
        .fade-circle { animation: disappearAnim 3s infinite ease-in-out; transform-origin: 100px 65px; }
        .ring { animation: ringPulse 3s infinite ease-out; transform-origin: 100px 65px; }
        @keyframes disappearAnim { 0% { opacity: 1; transform: scale(1); } 50%, 75% { opacity: 0; transform: scale(0.6); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes ringPulse { 0% { opacity: 0.8; transform: scale(0.5); } 50% { opacity: 0; transform: scale(1.6); } 100% { opacity: 0; transform: scale(0.5); } }
        """
        inner = """
        <circle cx="100" cy="65" r="30" stroke="#93C5FD" stroke-width="2" stroke-dasharray="4,4" fill="none" class="ring"/>
        <g class="fade-circle">
          <rect x="75" y="40" width="50" height="50" rx="12" fill="url(#blueGrad)"/>
          <circle cx="100" cy="65" r="12" fill="#FFFFFF" opacity="0.8"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Gözden kaybolan ve silikleşen nesne animasyonu"

    # 6. protect
    if w in ("protect", "defend"):
        css = """
        .shield-group { animation: shieldPulse 2.8s infinite ease-in-out; transform-origin: 100px 62px; }
        .aura { animation: auraExpand 2.8s infinite ease-out; transform-origin: 100px 62px; }
        @keyframes shieldPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes auraExpand { 0% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 0; } 100% { transform: scale(0.9); opacity: 0; } }
        """
        inner = """
        <circle cx="100" cy="62" r="38" fill="#DBEAFE" class="aura"/>
        <g class="shield-group">
          <path d="M 100 28 L 132 40 C 132 70, 100 96, 100 96 C 100 96, 68 70, 68 40 Z" fill="url(#blueGrad)"/>
          <path d="M 88 62 L 96 70 L 114 52" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Güvenlik ve koruma kalkanı animasyonu"

    # 7. connect
    if w in ("connect", "link"):
        css = """
        .node-left { animation: connectLeft 3s infinite ease-in-out; }
        .node-right { animation: connectRight 3s infinite ease-in-out; }
        .connect-beam { animation: beamFlash 3s infinite ease-in-out; }
        @keyframes connectLeft { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(18px); } }
        @keyframes connectRight { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-18px); } }
        @keyframes beamFlash { 0%, 20% { opacity: 0.2; } 50%, 80% { opacity: 1; stroke-width: 4; } 100% { opacity: 0.2; } }
        """
        inner = """
        <line x1="55" y1="65" x2="145" y2="65" stroke="#2563EB" stroke-width="2.5" stroke-dasharray="6,4" class="connect-beam"/>
        <g class="node-left">
          <circle cx="55" cy="65" r="20" fill="#DBEAFE"/>
          <circle cx="55" cy="65" r="10" fill="#2563EB"/>
        </g>
        <g class="node-right">
          <circle cx="145" cy="65" r="20" fill="#DBEAFE"/>
          <circle cx="145" cy="65" r="10" fill="#2563EB"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Birbirine bağlanan iki veri noktası animasyonu"

    # 8. achieve
    if w in ("achieve", "succeed", "victory"):
        css = """
        .arrow-hit { animation: arrowFlight 3s infinite ease-out; }
        .star-shimmer { animation: starPulse 1.8s infinite ease-in-out; transform-origin: 155px 35px; }
        @keyframes arrowFlight { 0% { transform: translate(-35px, 25px); opacity: 0; } 40%, 100% { transform: translate(0, 0); opacity: 1; } }
        @keyframes starPulse { 0%, 100% { transform: scale(0.9); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; } }
        """
        inner = """
        <circle cx="100" cy="65" r="42" fill="#DBEAFE"/>
        <circle cx="100" cy="65" r="30" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
        <circle cx="100" cy="65" r="18" fill="#EF4444" opacity="0.15"/>
        <circle cx="100" cy="65" r="8" fill="#EF4444"/>
        <g class="arrow-hit">
          <line x1="68" y1="92" x2="98" y2="67" stroke="#2563EB" stroke-width="3" stroke-linecap="round"/>
          <polygon points="98,67 92,72 96,77" fill="#1D4ED8"/>
          <line x1="68" y1="92" x2="62" y2="88" stroke="#2563EB" stroke-width="2"/>
          <line x1="68" y1="92" x2="66" y2="98" stroke="#2563EB" stroke-width="2"/>
        </g>
        <polygon points="155,27 158,34 165,35 160,40 162,47 155,43 148,47 150,40 145,35 152,34" fill="#F59E0B" class="star-shimmer"/>
        """
        return wrap_svg(inner, True, css), "animation", "Hedefe tam isabet eden ok ve başarı yıldızı"

    # 9. improve
    if w in ("improve", "progress", "develop"):
        css = """
        .step1 { animation: stepReveal1 3s infinite ease-out; }
        .step2 { animation: stepReveal2 3s infinite ease-out; }
        .step3 { animation: stepReveal3 3s infinite ease-out; }
        @keyframes stepReveal1 { 0%, 15% { opacity: 0.3; } 30%, 100% { opacity: 1; } }
        @keyframes stepReveal2 { 0%, 40% { opacity: 0.3; } 55%, 100% { opacity: 1; } }
        @keyframes stepReveal3 { 0%, 65% { opacity: 0.3; } 80%, 100% { opacity: 1; } }
        """
        inner = """
        <rect x="40" y="75" width="34" height="25" rx="6" fill="#BFDBFE" class="step1"/>
        <rect x="83" y="55" width="34" height="45" rx="6" fill="#60A5FA" class="step2"/>
        <rect x="126" y="35" width="34" height="65" rx="6" fill="#2563EB" class="step3"/>
        <path d="M 45 65 Q 90 45, 145 22" stroke="#10B981" stroke-width="3" stroke-linecap="round" fill="none"/>
        <polygon points="145,22 135,24 141,31" fill="#10B981"/>
        """
        return wrap_svg(inner, True, css), "animation", "Basamak basamak yukarı çıkan gelişim adımları"

    # 10. prevent
    if w in ("prevent", "block", "stop"):
        css = """
        .incoming-dot { animation: bounceBack 2.8s infinite ease-in-out; }
        @keyframes bounceBack { 0% { transform: translateX(0); opacity: 0.4; } 45% { transform: translateX(52px); opacity: 1; } 60% { transform: translateX(36px); opacity: 0.9; } 100% { transform: translateX(0); opacity: 0.4; } }
        """
        inner = """
        <rect x="125" y="30" width="12" height="70" rx="6" fill="#2563EB"/>
        <line x1="125" y1="42" x2="137" y2="42" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="125" y1="65" x2="137" y2="65" stroke="#FFFFFF" stroke-width="1.5"/>
        <line x1="125" y1="88" x2="137" y2="88" stroke="#FFFFFF" stroke-width="1.5"/>
        <g class="incoming-dot">
          <circle cx="55" cy="65" r="9" fill="#EF4444"/>
          <line x1="35" y1="65" x2="48" y2="65" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Gelen bir tehlikeyi durduran koruyucu engel duvarı"

    # 11. apartment (Static B)
    if w == "apartment":
        inner = """
        <rect x="65" y="24" width="70" height="84" rx="4" fill="#3B82F6"/>
        <rect x="62" y="104" width="76" height="4" fill="#1E293B"/>
        <rect x="74" y="32" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="94" y="32" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="114" y="32" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="74" y="52" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="94" y="52" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="114" y="52" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="74" y="72" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="94" y="72" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="114" y="72" width="12" height="12" rx="2" fill="#DBEAFE"/>
        <rect x="92" y="90" width="16" height="18" rx="2" fill="#1E293B"/>
        """
        return wrap_svg(inner, False), "static", "Modern apartman binası ve pencereleri"

    # 12. mountain (Static B)
    if w in ("mountain", "hill"):
        inner = """
        <polygon points="35,105 85,38 135,105" fill="#3B82F6"/>
        <polygon points="85,38 73,54 85,50 97,54" fill="#EFF6FF"/>
        <polygon points="90,105 135,52 175,105" fill="#2563EB"/>
        <polygon points="135,52 124,66 135,62 146,66" fill="#EFF6FF"/>
        <line x1="25" y1="105" x2="175" y2="105" stroke="#94A3B8" stroke-width="2" stroke-linecap="round"/>
        """
        return wrap_svg(inner, False), "static", "Karlı zirvelere sahip dağ manzarası"

    # 13. hospital (Static B)
    if w == "hospital":
        inner = """
        <rect x="55" y="32" width="90" height="76" rx="4" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="94" y="42" width="12" height="24" rx="2" fill="#EF4444"/>
        <rect x="88" y="48" width="24" height="12" rx="2" fill="#EF4444"/>
        <rect x="68" y="72" width="14" height="14" rx="2" fill="#93C5FD"/>
        <rect x="118" y="72" width="14" height="14" rx="2" fill="#93C5FD"/>
        <rect x="92" y="88" width="16" height="20" rx="2" fill="#2563EB"/>
        """
        return wrap_svg(inner, False), "static", "Kızılhaç sembollü hastane sağlık binası"

    # 14. forest (Static B)
    if w in ("forest", "woods"):
        inner = """
        <polygon points="50,98 68,48 86,98" fill="#93C5FD" opacity="0.5"/>
        <polygon points="114,98 132,48 150,98" fill="#93C5FD" opacity="0.5"/>
        <polygon points="75,102 95,40 115,102" fill="#3B82F6"/>
        <polygon points="32,102 52,44 72,102" fill="#2563EB"/>
        <polygon points="128,102 148,44 168,102" fill="#2563EB"/>
        <line x1="20" y1="102" x2="180" y2="102" stroke="#64748B" stroke-width="2"/>
        """
        return wrap_svg(inner, False), "static", "Sık çam ağaçlarından oluşan orman silüeti"

    # 15. bridge (Static B)
    if w == "bridge":
        inner = """
        <line x1="60" y1="35" x2="60" y2="85" stroke="#2563EB" stroke-width="4"/>
        <line x1="140" y1="35" x2="140" y2="85" stroke="#2563EB" stroke-width="4"/>
        <path d="M 30 75 Q 60 40, 100 68 Q 140 40, 170 75" stroke="#3B82F6" stroke-width="2" fill="none"/>
        <rect x="25" y="75" width="150" height="6" rx="2" fill="#1E293B"/>
        <path d="M 30 96 Q 50 92, 70 96 T 110 96 T 150 96 T 175 96" stroke="#93C5FD" stroke-width="2" fill="none"/>
        """
        return wrap_svg(inner, False), "static", "Nehir üzerindeki asma köprü mimarisi"

    # 16. airport (Static B)
    if w == "airport":
        inner = """
        <polygon points="30,105 170,105 125,55 75,55" fill="#E2E8F0"/>
        <line x1="100" y1="60" x2="100" y2="100" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6,4"/>
        <rect x="42" y="40" width="12" height="40" fill="#64748B"/>
        <rect x="36" y="32" width="24" height="10" rx="3" fill="#2563EB"/>
        <path d="M 130 65 L 140 60 L 148 64 L 140 68 Z" fill="#3B82F6"/>
        """
        return wrap_svg(inner, False), "static", "Havalimanı pisti ve kontrol kulesi"

    # 17. borrow / lend
    if w in ("borrow", "lend"):
        css = """
        .transfer-arrow { animation: transferMotion 2.5s infinite ease-in-out; }
        @keyframes transferMotion { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(20px); } }
        """
        inner = """
        <!-- Two hands / parties with object exchange -->
        <circle cx="55" cy="65" r="22" fill="#DBEAFE"/>
        <text x="55" y="70" font-size="12" font-family="sans-serif" font-weight="700" fill="#2563EB" text-anchor="middle">A</text>
        <circle cx="145" cy="65" r="22" fill="#DBEAFE"/>
        <text x="145" y="70" font-size="12" font-family="sans-serif" font-weight="700" fill="#2563EB" text-anchor="middle">B</text>
        <g class="transfer-arrow">
          <path d="M 75 55 Q 100 45, 120 55" stroke="#2563EB" stroke-width="2.5" fill="none"/>
          <polygon points="120,55 112,50 115,58" fill="#2563EB"/>
          <circle cx="100" cy="46" r="6" fill="#F59E0B"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "İki kişi arasında geçici nesne/kitap ödünç alışverişi"

    # 18. clean
    if w == "clean":
        css = """
        .sparkle1 { animation: spark 2s infinite ease-in-out; transform-origin: 130px 45px; }
        .sparkle2 { animation: spark 2s 1s infinite ease-in-out; transform-origin: 70px 75px; }
        @keyframes spark { 0%, 100% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.3); opacity: 1; } }
        """
        inner = """
        <rect x="65" y="35" width="70" height="60" rx="8" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2"/>
        <line x1="80" y1="50" x2="120" y2="50" stroke="#DBEAFE" stroke-width="3" stroke-linecap="round"/>
        <line x1="80" y1="65" x2="110" y2="65" stroke="#DBEAFE" stroke-width="3" stroke-linecap="round"/>
        <g class="sparkle1" transform="translate(130, 45)">
          <polygon points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2" fill="#3B82F6"/>
        </g>
        <g class="sparkle2" transform="translate(70, 75)">
          <polygon points="0,-6 1.5,-1.5 6,0 1.5,1.5 0,6 -1.5,1.5 -6,0 -1.5,-1.5" fill="#3B82F6"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Işıl ışıl parlayan temiz yüzey animasyonu"

    # 19. cheap
    if w == "cheap":
        inner = """
        <circle cx="100" cy="65" r="38" fill="#DCFCE7"/>
        <text x="100" y="55" font-size="18" font-family="-apple-system,sans-serif" font-weight="800" fill="#15803D" text-anchor="middle">₺ / $</text>
        <rect x="72" y="70" width="56" height="18" rx="9" fill="#16A34A"/>
        <text x="100" y="83" font-size="10" font-family="sans-serif" font-weight="700" fill="#FFFFFF" text-anchor="middle">UYGUN</text>
        """
        return wrap_svg(inner, False), "static", "Uygun fiyat ve ekonomik etiket simgesi"

    # 20. dangerous
    if w in ("dangerous", "danger"):
        css = """
        .warn-pulse { animation: warnPulse 1.8s infinite ease-in-out; transform-origin: 100px 65px; }
        @keyframes warnPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
        """
        inner = """
        <g class="warn-pulse">
          <polygon points="100,28 145,98 55,98" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3" stroke-linejoin="round"/>
          <line x1="100" y1="52" x2="100" y2="76" stroke="#B45309" stroke-width="4" stroke-linecap="round"/>
          <circle cx="100" cy="87" r="3" fill="#B45309"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Tehlike uyarı üçgeni ve dikkat işareti"

    return None, None, None

# Procedural semantic motif generators for broader vocabulary
def generate_semantic_svg(word, word_obj):
    w = word.lower().strip()
    pos = word_obj.get("partOfSpeech", "").lower()
    meanings = [m.lower() for m in word_obj.get("meanings", [])]
    all_text = (w + " " + " ".join(meanings)).lower()

    # Communication & Speech (Verbs/Nouns: speak, talk, listen, call, message, announce, shout, voice, etc.)
    if any(k in all_text for k in ["konuş", "dinle", "ses", "söyle", "mesaj", "haber", "anlat", "sor", "cevap", "speak", "talk", "listen", "call", "voice", "sound", "chat", "message"]):
        css = """
        .wave1 { animation: wavePulse 2.2s infinite ease-out; }
        .wave2 { animation: wavePulse 2.2s 0.6s infinite ease-out; }
        @keyframes wavePulse { 0% { opacity: 0; transform: scale(0.8); } 50% { opacity: 0.8; } 100% { opacity: 0; transform: scale(1.3); } }
        """
        inner = """
        <path d="M 65 42 C 65 32, 115 32, 115 42 C 115 58, 65 58, 65 42 Z" fill="#3B82F6"/>
        <path d="M 65 42 L 135 42 C 145 42, 145 78, 135 78 L 85 78 L 65 92 L 72 78 C 62 78, 62 42, 65 42 Z" fill="#2563EB"/>
        <g transform="translate(135, 60)">
          <path d="M 12 -12 Q 22 0, 12 12" stroke="#60A5FA" stroke-width="2.5" stroke-linecap="round" fill="none" class="wave1"/>
          <path d="M 20 -20 Q 34 0, 20 20" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round" fill="none" class="wave2"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "İletişim ve konuşma ses dalgaları animasyonu"

    # Travel & Transportation (plane, train, car, ship, travel, ride, drive, flight, etc.)
    if any(k in all_text for k in ["seyahat", "yolculuk", "araç", "araba", "uçak", "tren", "gemi", "bisiklet", "sür", "travel", "flight", "train", "car", "ship", "drive", "ride", "boat", "bus", "transport"]):
        css = """
        .wheel { animation: spinWheel 2s linear infinite; transform-origin: center; }
        @keyframes spinWheel { to { transform: rotate(360deg); } }
        """
        inner = """
        <path d="M 45 72 L 65 48 L 135 48 L 155 72 Z" fill="#3B82F6"/>
        <rect x="35" y="70" width="130" height="18" rx="6" fill="#1D4ED8"/>
        <circle cx="65" cy="88" r="14" fill="#1E293B"/>
        <circle cx="65" cy="88" r="6" fill="#E2E8F0" class="wheel"/>
        <circle cx="135" cy="88" r="14" fill="#1E293B"/>
        <circle cx="135" cy="88" r="6" fill="#E2E8F0" class="wheel"/>
        <line x1="20" y1="102" x2="180" y2="102" stroke="#94A3B8" stroke-width="2"/>
        """
        return wrap_svg(inner, True, css), "animation", "Yolda ilerleyen modern ulaşım aracı"

    # Nature, Weather & Landscape (sun, rain, snow, tree, mountain, river, sea, sky, flower, etc.)
    if any(k in all_text for k in ["güneş", "yağmur", "deniz", "nehir", "ağaç", "hava", "doğa", "çiçek", "kar", "rüzgar", "sun", "rain", "sea", "river", "tree", "weather", "nature", "flower", "water", "sky", "cloud"]):
        css = """
        .sun-spin { animation: spinSun 12s linear infinite; transform-origin: 100px 55px; }
        @keyframes spinSun { to { transform: rotate(360deg); } }
        """
        inner = """
        <g class="sun-spin">
          <circle cx="100" cy="55" r="22" fill="#F59E0B"/>
          <line x1="100" y1="24" x2="100" y2="16" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <line x1="100" y1="86" x2="100" y2="94" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <line x1="69" y1="55" x2="61" y2="55" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
          <line x1="131" y1="55" x2="139" y2="55" stroke="#F59E0B" stroke-width="3" stroke-linecap="round"/>
        </g>
        <path d="M 30 105 Q 65 88, 100 105 T 170 105 L 170 115 L 30 115 Z" fill="#60A5FA" opacity="0.6"/>
        """
        return wrap_svg(inner, True, css), "animation", "Dönen güneş ve doğal peyzaj simgesi"

    # Architecture, Home & Buildings (house, building, school, shop, room, door, window, hotel, etc.)
    if any(k in all_text for k in ["ev", "bina", "okul", "otel", "oda", "kapı", "pencere", "dükkan", "house", "building", "school", "hotel", "room", "door", "window", "shop", "home", "office"]):
        inner = """
        <polygon points="100,30 45,65 155,65" fill="#2563EB"/>
        <rect x="55" y="65" width="90" height="42" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="70" y="74" width="16" height="16" rx="2" fill="#93C5FD"/>
        <rect x="114" y="74" width="16" height="16" rx="2" fill="#93C5FD"/>
        <rect x="92" y="82" width="16" height="25" rx="2" fill="#1E293B"/>
        """
        return wrap_svg(inner, False), "static", "Klasik ev ve mimari yapı sembolü"

    # Money, Finance & Shopping (money, price, pay, spend, buy, sell, bank, cost, bill, etc.)
    if any(k in all_text for k in ["para", "fiyat", "öde", "satın", "harca", "banka", "ücret", "money", "price", "pay", "spend", "buy", "sell", "cost", "bank", "cash", "coin"]):
        css = """
        .coin-drop { animation: coinDrop 2.5s infinite ease-in-out; }
        @keyframes coinDrop { 0% { transform: translateY(-12px); opacity: 0; } 40% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(0); opacity: 1; } }
        """
        inner = """
        <rect x="65" y="55" width="70" height="45" rx="8" fill="#10B981"/>
        <circle cx="100" cy="77" r="14" fill="#059669"/>
        <text x="100" y="82" font-size="14" font-family="sans-serif" font-weight="700" fill="#FFFFFF" text-anchor="middle">$</text>
        <g class="coin-drop">
          <circle cx="100" cy="38" r="12" fill="#F59E0B"/>
          <text x="100" y="42" font-size="12" font-family="sans-serif" font-weight="700" fill="#78350F" text-anchor="middle">$</text>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Finansal ödeme ve tasarruf sikkesi animasyonu"

    # Food & Dining (eat, drink, meal, food, apple, coffee, tea, bread, cook, etc.)
    if any(k in all_text for k in ["yemek", "içmek", "yiyecek", "meyve", "kahve", "ekmek", "su", "pişir", "eat", "drink", "food", "meal", "coffee", "tea", "bread", "fruit", "cook", "cook"]):
        css = """
        .steam { animation: steamRise 2s infinite ease-in-out; }
        @keyframes steamRise { 0% { transform: translateY(0); opacity: 0.2; } 50% { opacity: 0.8; } 100% { transform: translateY(-8px); opacity: 0; } }
        """
        inner = """
        <rect x="75" y="60" width="50" height="42" rx="10" fill="#3B82F6"/>
        <path d="M 125 70 C 138 70, 138 85, 125 85" stroke="#3B82F6" stroke-width="4" fill="none"/>
        <ellipse cx="100" cy="60" rx="25" ry="6" fill="#60A5FA"/>
        <g class="steam">
          <path d="M 90 48 Q 94 40, 90 34" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M 100 48 Q 104 38, 100 30" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" fill="none"/>
          <path d="M 110 48 Q 114 40, 110 34" stroke="#93C5FD" stroke-width="2" stroke-linecap="round" fill="none"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Buharı tüten taze içecek / gıda sembolü"

    # Technology & Devices (computer, phone, screen, camera, digital, online, tech, etc.)
    if any(k in all_text for k in ["bilgisayar", "telefon", "ekran", "kamera", "teknoloji", "internet", "dijital", "computer", "phone", "screen", "camera", "tech", "digital", "device"]):
        css = """
        .screen-pulse { animation: scrGlow 3s infinite ease-in-out; }
        @keyframes scrGlow { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; } }
        """
        inner = """
        <rect x="52" y="30" width="96" height="62" rx="6" fill="#1E293B"/>
        <rect x="58" y="36" width="84" height="50" rx="3" fill="#2563EB" class="screen-pulse"/>
        <!-- Code / interface lines -->
        <line x1="68" y1="48" x2="95" y2="48" stroke="#DBEAFE" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="68" y1="58" x2="115" y2="58" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="68" y1="68" x2="85" y2="68" stroke="#60A5FA" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Stand -->
        <rect x="93" y="92" width="14" height="12" fill="#64748B"/>
        <rect x="75" y="104" width="50" height="4" rx="2" fill="#64748B"/>
        """
        return wrap_svg(inner, True, css), "animation", "Modern dijital teknoloji ekranı ve arayüzü"

    # Health, Medicine & Feelings (doctor, medicine, sick, pain, heart, smile, healthy, etc.)
    if any(k in all_text for k in ["sağlık", "doktor", "ilaç", "hasta", "kalp", "tedavi", "health", "doctor", "medicine", "sick", "heart", "cure", "pain", "hospital"]):
        css = """
        .heart-beat { animation: heartbeat 1.5s infinite ease-in-out; transform-origin: 100px 65px; }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1.05); } 45% { transform: scale(1.2); } }
        """
        inner = """
        <g class="heart-beat">
          <path d="M 100 88 C 100 88, 62 65, 62 48 C 62 36, 74 30, 84 36 C 94 42, 100 50, 100 50 C 100 50, 106 42, 116 36 C 126 30, 138 36, 138 48 C 138 65, 100 88, 100 88 Z" fill="#EF4444"/>
          <line x1="72" y1="55" x2="88" y2="55" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <line x1="88" y1="55" x2="94" y2="45" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <line x1="94" y1="45" x2="102" y2="65" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <line x1="102" y1="65" x2="108" y2="55" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          <line x1="108" y1="55" x2="128" y2="55" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Sağlık ve yaşam ritmi atan kalp sembolü"

    # Education, Learning & Books (book, study, learn, student, exam, test, pen, etc.)
    if any(k in all_text for k in ["kitap", "öğren", "ders", "sınav", "çalış", "yazı", "book", "study", "learn", "exam", "test", "read", "education", "lesson"]):
        css = """
        .page-flip { animation: pageTurn 3s infinite ease-in-out; transform-origin: 100px 70px; }
        @keyframes pageTurn { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(0.85); } }
        """
        inner = """
        <!-- Open Book -->
        <g class="page-flip">
          <path d="M 100 82 Q 70 88, 42 80 L 42 42 Q 70 50, 100 45 L 100 82 Z" fill="#F8FAFC" stroke="#3B82F6" stroke-width="2"/>
          <path d="M 100 82 Q 130 88, 158 80 L 158 42 Q 130 50, 100 45 L 100 82 Z" fill="#F8FAFC" stroke="#3B82F6" stroke-width="2"/>
          <line x1="100" y1="45" x2="100" y2="82" stroke="#2563EB" stroke-width="3"/>
          <!-- Text lines -->
          <line x1="52" y1="52" x2="88" y2="52" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
          <line x1="52" y1="62" x2="85" y2="62" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
          <line x1="112" y1="52" x2="148" y2="52" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
          <line x1="112" y1="62" x2="140" y2="62" stroke="#93C5FD" stroke-width="2" stroke-linecap="round"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Öğrenme ve eğitim açık kitap sembolü"

    # Action / Motion Verbs in general (verbs of action: walk, run, open, close, push, pull, turn, etc.)
    if pos == "verb":
        css = """
        .action-arrow { animation: arrowLoop 2.2s infinite ease-in-out; }
        @keyframes arrowLoop { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(14px); } }
        """
        inner = """
        <circle cx="70" cy="65" r="26" fill="#DBEAFE"/>
        <g class="action-arrow">
          <path d="M 95 65 L 135 65 M 125 55 L 135 65 L 125 75" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        """
        return wrap_svg(inner, True, css), "animation", "Dinamik eylem ve yön hareketi animasyonu"

    # Tangible Nouns in general (box, item, object, etc.)
    if pos == "noun":
        inner = """
        <rect x="65" y="40" width="70" height="55" rx="8" fill="#3B82F6"/>
        <rect x="75" y="32" width="50" height="12" rx="4" fill="#60A5FA"/>
        <line x1="100" y1="44" x2="100" y2="95" stroke="#1D4ED8" stroke-width="2"/>
        """
        return wrap_svg(inner, False), "static", "Somut nesne ve eşya temsili"

    # Describing Adjectives in general (clean, bright, large, nice, etc.)
    if pos == "adjective":
        inner = """
        <circle cx="100" cy="65" r="32" fill="#DBEAFE"/>
        <path d="M 85 65 L 95 75 L 115 55" stroke="#2563EB" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        """
        return wrap_svg(inner, False), "static", "Nitelik ve özellik belirteci"

    return None, None, None

def process_all_words():
    print("Processing all 1,320 words across A2, B1, and B2...")
    all_words = []
    for lvl in ["a2", "b1", "b2"]:
        p = os.path.join(DATA_DIR, f"{lvl}.json")
        with open(p, "r", encoding="utf-8") as f:
            w_list = json.load(f)
            all_words.extend(w_list)

    print(f"Total words loaded: {len(all_words)}")

    meta_visuals = {}
    stats = {
        "totalWords": len(all_words),
        "visualizedCount": 0,
        "animatedCount": 0,
        "staticCount": 0,
        "abstractCount": 0
    }

    for w in all_words:
        w_id = w["id"]
        word_text = w["word"].strip()
        level = w.get("level", "A2")
        
        # Check abstract filter first
        if is_abstract(w):
            stats["abstractCount"] += 1
            meta_visuals[w_id] = {
                "id": w_id,
                "word": word_text,
                "level": level,
                "type": "abstract",
                "format": None,
                "file": None,
                "path": None,
                "concept": "Soyut kavram; yanıltıcı görselleştirmeden kaçınmak için görselsiz bırakıldı.",
                "source": "VELUNO Ontology Engine",
                "license": "CC0 1.0 Universal",
                "author": "VELUNO Design Studio"
            }
            continue

        # Try bespoke SVG
        svg_content, v_type, concept = get_bespoke_svg(word_text)
        
        # If not bespoke, try semantic motif
        if not svg_content:
            svg_content, v_type, concept = generate_semantic_svg(word_text, w)

        if svg_content and v_type:
            file_name = f"{w_id}.svg"
            file_path = os.path.join(VISUALS_DIR, file_name)
            rel_path = f"assets/visuals/{file_name}"

            with open(file_path, "w", encoding="utf-8") as sf:
                sf.write(svg_content.strip() + "\n")

            stats["visualizedCount"] += 1
            if v_type == "animation":
                stats["animatedCount"] += 1
            else:
                stats["staticCount"] += 1

            meta_visuals[w_id] = {
                "id": w_id,
                "word": word_text,
                "level": level,
                "type": v_type,
                "format": "svg",
                "file": file_name,
                "path": rel_path,
                "concept": concept or f"{word_text} kelimesinin görsel anlatımı",
                "source": "VELUNO Original Visual System",
                "license": "CC0 1.0 Universal",
                "author": "VELUNO Design Studio"
            }
        else:
            stats["abstractCount"] += 1
            meta_visuals[w_id] = {
                "id": w_id,
                "word": word_text,
                "level": level,
                "type": "abstract",
                "format": None,
                "file": None,
                "path": None,
                "concept": "Uygun görsel eşleşmesi bulunamadı; görselsiz bırakıldı.",
                "source": "VELUNO Ontology Engine",
                "license": "CC0 1.0 Universal",
                "author": "VELUNO Design Studio"
            }

    meta_doc = {
        "version": "1.0.0",
        "generatedAt": datetime.utcnow().isoformat() + "Z",
        "stats": stats,
        "visuals": meta_visuals
    }

    with open(META_PATH, "w", encoding="utf-8") as mf:
        json.dump(meta_doc, mf, ensure_ascii=False, indent=1)

    print("\nGeneration Completed Successfully!")
    print(f"Total Words Analyzed: {stats['totalWords']}")
    print(f"Visualized Words:    {stats['visualizedCount']}")
    print(f"  - Animated:        {stats['animatedCount']}")
    print(f"  - Static:          {stats['staticCount']}")
    print(f"Abstract / No Visual:{stats['abstractCount']}")
    print(f"Metadata written to: {META_PATH}")

if __name__ == "__main__":
    process_all_words()
