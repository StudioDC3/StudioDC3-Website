import re
import os

src_file = r'd:\0_Studio Dc3\SITE - IA\[Aula] - Materiais aula\00_Site Dc3 [TESTE]\Referencias\Design Systems\green-museum\design-system.html'
dest_file = r'd:\0_Studio Dc3\SITE - IA\[Aula] - Materiais aula\00_Site Dc3 [TESTE]\Referencias\design_system3.html'

with open(src_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Make it white
content = content.replace('background-color: #E6E3D6;', 'background-color: #FAFAFA;')
content = content.replace('bg-[#E6E3D6]', 'bg-[#FAFAFA]')
content = content.replace('bg-[#EAE8DE]', 'bg-white')
content = content.replace('text-[#E6E3D6]', 'text-stone-900') # Fixed contrast since bg is white, text should be dark! Wait, if bg is white, text that was beige (#E6E3D6) needs to be stone-900 or stone-500. Let's make it stone-800.
content = content.replace('text-white', 'text-stone-800')
content = content.replace('from-stone-900/60', 'from-stone-100/60')
# Dark mode text changes on some elements:
content = content.replace('bg-stone-900 text-[#E6E3D6]', 'bg-stone-900 text-white')

# Let's fix some missing css colors for white layout readability:
content = content.replace('bg-stone-900', 'bg-stone-900 text-white')

# Inject Transparent Lettering
watermark = r'''
<!-- Transparent Lettering -->
<div class="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-[0.03] select-none overflow-hidden z-[0]">
    <span class="animate-pulse text-[18vw] lg:text-[16rem] leading-none font-serif font-bold text-transparent bg-clip-text bg-gradient-to-t from-stone-400 via-stone-200 to-transparent tracking-tighter transform rotate-[-5deg]">
        DESIGN
    </span>
</div>
'''

# Add watermark to all sections
sections = content.split('<section')
new_content = sections[0]
for sec in sections[1:]:
    # Make section position relative and overflow hidden if not already
    sec = sec.replace('class="', 'class="relative overflow-hidden ', 1)
    
    # insert watermark right after the section open tag parameters (find first >)
    idx = sec.find('>')
    if idx != -1:
        sec = sec[:idx+1] + watermark + sec[idx+1:]
    
    new_content += '<section' + sec

# Update asset paths to be relative from the Referencias folder
new_content = new_content.replace('"assets/', '"Design Systems/green-museum/assets/')

# Enhance interactive feel (glows, fade-ins)
# Replacing standard transition with richer effects on components
new_content = new_content.replace('hover:bg-stone-800', 'hover:bg-stone-800 hover:shadow-2xl hover:shadow-stone-900/40 hover:-translate-y-1 transition-all duration-300')
new_content = new_content.replace('group-hover:scale-105', 'group-hover:scale-110 group-hover:rotate-1 duration-1000')
new_content = new_content.replace('shadow-2xl shadow-black/20', 'shadow-2xl shadow-black/20 hover:shadow-stone-900/30 transition-all duration-700 hover:-translate-y-2')

with open(dest_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Success')
