$baseHtmlPath = ".\Design Systems\green-museum\design-system.html"
$outHtmlPath = ".\design_system02.html"

# Windows typical encoding is fine, but lets ensure UTF8
$html = [System.IO.File]::ReadAllText($baseHtmlPath, [System.Text.Encoding]::UTF8)

# Inject <head> tags
$headAddition = @"
<script src='./Design Systems/ai-automation-17.aura.build/assets/lucide_latest_2eebd0ebe8c2.js'></script>
<style>
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes pulse-glow { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
.animate-float { animation: float 6s ease-in-out infinite; }
.bg-grainy { background-image: url('https://grainy-gradients.vercel.app/noise.svg'); opacity: 0.25; mix-blend-mode: soft-light; pointer-events: none; z-index: 10; position: absolute; top:0; left:0; right:0; bottom:0; }
.glow-blur { background: radial-gradient(circle, rgba(162, 168, 255, 0.4) 0%, rgba(200, 200, 255, 0) 70%); filter: blur(80px); pointer-events: none; z-index: 0; position: absolute; transform: translate(-50%, -50%); border-radius: 50%; animation: pulse-glow 8s infinite alternate; }
.hover-glow:hover { box-shadow: 0 0 35px rgba(212, 242, 104, 0.6); }
.ds-nav { background-color: rgba(230, 227, 214, 0.6); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
/* Custom scrollbar to look premium */
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #E6E3D6; }
::-webkit-scrollbar-thumb { background: #c2c0b4; border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: #9ea08f; }
</style>
</head>
"@
$html = $html -replace "</head>", $headAddition

# Ensure every section is relative for the absolute backgrounds correctly.
$html = $html -replace 'class="ds-section ', 'class="ds-section relative '

# Add noise and glow to all sections WITHOUT breaking DOM tree! No inner <div> wrappers
$html = $html -replace '<section([^>]*)>', '<section$1><div class="bg-grainy"></div><div class="glow-blur w-[400px] h-[400px] md:w-[800px] md:h-[800px] top-[40%] left-[80%]"></div><div class="glow-blur w-[300px] h-[300px] md:w-[600px] md:h-[600px] top-[80%] left-[20%]" style="background: radial-gradient(circle, rgba(212, 242, 104, 0.3) 0%, rgba(212, 242, 104, 0) 70%);"></div>'

# Remove previously broken `</section>` replacement, not needed.

# Replace all primary buttons and accent buttons with hover-glow and float animation
$html = $html -replace 'class="group w-full', 'class="group hover-glow w-full'
$html = $html -replace 'shadow-xl shadow-stone-900/10', 'shadow-xl shadow-stone-900/10 hover-glow animate-float'

# Replace standard component states slightly for dynamism
$html = $html -replace 'class="component-state"', 'class="component-state hover:-translate-y-2 transition-transform duration-500"'

# In colors and surfaces, maybe add one glowing aura badge
$badgeHtml = @"
<div class="component-state hover:-translate-y-2 transition-transform duration-500">
<div class="component-state-label">Aura Glow Badge</div>
<div class="px-6 py-2 rounded-full border border-stone-800/20 bg-white/10 backdrop-blur-xl text-stone-900 text-xs font-semibold uppercase tracking-widest hover:bg-white/40 transition-colors shadow-2xl relative overflow-hidden group mt-2 font-sans">
  <div class="absolute inset-0 bg-gradient-to-r from-[#C3E354]/40 to-[#EBC8D6]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
  <i class="w-4 h-4 inline-block align-middle mr-1" data-lucide="sparkles"></i>
  <span class="relative z-10 align-middle">Aura Token</span>
</div>
</div>
"@

# Safe regex replacement ensuring exact match gets kept `$0`
$html = $html -replace '(?s)<h3 class="text-2xl font-newsreader font-medium text-stone-900 mb-8">Badges & Labels</h3>\s*<div class="component-showcase mb-16">', "`$0`n$badgeHtml"

[System.IO.File]::WriteAllText($outHtmlPath, $html, [System.Text.Encoding]::UTF8)
