$srcFile = "d:\0_Studio Dc3\SITE - IA\[Aula] - Materiais aula\00_Site Dc3 [TESTE]\Referencias\Design Systems\green-museum\design-system.html"
$destFile = "d:\0_Studio Dc3\SITE - IA\[Aula] - Materiais aula\00_Site Dc3 [TESTE]\Referencias\design_system3.html"

# Read content
$content = [System.IO.File]::ReadAllText($srcFile, [System.Text.Encoding]::UTF8)

# Make it white
$content = $content.Replace("background-color: #E6E3D6;", "background-color: #FAFAFA;")
$content = $content.Replace("bg-[#E6E3D6]", "bg-[#FAFAFA]")
$content = $content.Replace("bg-[#EAE8DE]", "bg-white")
$content = $content.Replace("text-[#E6E3D6]", "text-stone-800")
$content = $content.Replace("text-white", "text-stone-800")
$content = $content.Replace("from-stone-900/60", "from-stone-100/60")
$content = $content.Replace("bg-stone-900 text-[#E6E3D6]", "bg-stone-900 text-white")
$content = $content.Replace("bg-stone-900", "bg-stone-900 text-white")

# Add watermark to all sections
$watermark = @"
<!-- Transparent Lettering -->
<div class="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden z-[0]">
    <span class="animate-pulse text-[18vw] lg:text-[16rem] leading-none font-serif font-bold text-transparent bg-clip-text bg-gradient-to-t from-stone-400 via-stone-200 to-transparent tracking-tighter transform rotate-[-5deg] duration-1000">
        DESIGN
    </span>
</div>
"@

$sections = $content -split "<section"
$newContent = $sections[0]

for ($i = 1; $i -lt $sections.Count; $i++) {
    $sec = $sections[$i]
    $sec = $sec -replace '^class="', 'class="relative overflow-hidden '
    
    $idx = $sec.IndexOf('>')
    if ($idx -ne -1) {
        $sec = $sec.Substring(0, $idx + 1) + "`n" + $watermark + "`n" + $sec.Substring($idx + 1)
    }
    
    $newContent += "<section" + $sec
}

# Update asset paths
$newContent = $newContent.Replace('"assets/', '"Design Systems/green-museum/assets/')

# Enhance interactive feel
$newContent = $newContent.Replace('hover:bg-stone-800', 'hover:bg-stone-800 hover:shadow-2xl hover:shadow-stone-900/40 hover:-translate-y-1 transition-all duration-300')
$newContent = $newContent.Replace('group-hover:scale-105', 'group-hover:scale-110 group-hover:rotate-1 duration-1000')
$newContent = $newContent.Replace('shadow-2xl shadow-black/20', 'shadow-2xl hover:shadow-2xl shadow-stone-900/10 hover:shadow-stone-900/30 transition-all duration-700 hover:-translate-y-2')

# Save file
[System.IO.File]::WriteAllText($destFile, $newContent, [System.Text.Encoding]::UTF8)
Write-Host "Success"
