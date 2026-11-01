import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'HardwareStudyApp/1.0 (contact@example.org)'}

def search_image(query):
    url = f'https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json'
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                if any(title.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']):
                    info = p.get('imageinfo', [{}])[0]
                    u = info.get('thumburl') or info.get('url')
                    if u and 'pdf' not in u.lower():
                        return u
    except Exception as e:
        pass
    return None

items = {
    'desktop_setup': 'Desktop computer setup with keyboard and monitor',
    'laptop_open': 'Dell Inspiron laptop open',
    'cases_factors': 'ATX computer case tower',
    'slim_pc': 'Mini ITX computer case desktop',
    'empty_case': 'Antec computer case interior empty',
    'case_front': 'Computer case front panel buttons USB',
    'case_rear': 'Computer case back panel ATX I/O',
    'rgb_case': 'Gaming computer case RGB lighting',
    'psu_in_case': 'ATX power supply in case',
    'psu_cables': 'ATX power supply unit cables',
    'motherboard_top': 'ATX motherboard top view components',
    'motherboard_io': 'Motherboard rear panel I/O ports',
    'chipset_classic': 'Northsouthbridge diagram',
    'chipset_modern': 'Motherboard diagram chipset',
    'cpu_both_sides': 'Intel Core 2 Duo top and bottom',
    'cpu_pins': 'Pentium 4 PGA pins underside',
    'cpu_cooler': 'CPU heatsink and fan cooler',
    'liquid_cooling': 'AIO liquid CPU cooler radiator',
    'ram_modules': 'DDR SDRAM memory modules DIMM',
    'memory_hierarchy': 'Computer memory hierarchy pyramid diagram',
    'pcie_slots': 'PCI Express slots motherboard x16 x1',
    'gpu_card': 'GeForce graphics card PCI Express HDMI',
    'sound_card': 'Sound Blaster PCI audio card',
    'network_card': 'Ethernet network card RJ-45 PCI',
    'expansion_ports': 'USB 3.0 PCIe expansion card'
}

results = {}
for k, q in items.items():
    res = search_image(q)
    results[k] = res
    print(f"'{k}': '{res}',")

with open('clean_images.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
