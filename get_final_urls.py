import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'HardwareStudyApp/1.0 (contact@example.org)'}

def search_original_image(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={urllib.parse.quote(query)}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                title = p.get('title', '')
                if any(title.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp', '.svg']):
                    info = p.get('imageinfo', [{}])[0]
                    u = info.get('url')
                    if u and 'pdf' not in u.lower():
                        return u
    except Exception as e:
        print(f"Error {query}: {e}")
    return None

targets = {
    '1_desktop_setup': 'Desktop computer setup with keyboard and monitor',
    '2_laptop': 'laptop computer open desk',
    '3_cases_factors': 'ATX computer case tower',
    '4_slim_pc': 'Mini ITX case computer',
    '5_empty_case': 'computer case interior chassis',
    '6_case_front': 'Antec P182 - Power and LEDs.jpg',
    '7_case_rear': 'computer case back panel ATX I/O',
    '8_rgb_case': 'RGB desktop computer setup with keyboard and monitor.jpg',
    '9_psu_in_case': 'power supply installed PC case',
    '10_psu_cables': 'ATX power supply unit cables',
    '11_motherboard_top': 'motherboard top view Asus Gigabyte',
    '12_motherboard_io': 'motherboard rear I/O connectors ports',
    '13_chipset_classic': 'Northsouthbridge es.png',
    '14_chipset_modern': 'Motherboard diagram hr.svg',
    '15_cpu_both_sides': 'Intel Core 2 Duo top bottom',
    '16_cpu_pins': 'Pentium 4 Underside Demonstrating PGA Socket.JPG',
    '17_cpu_cooler': 'CPU heatsink fan cooler Intel AMD',
    '18_liquid_cooling': 'Corsair H100i liquid cooler',
    '19_ram_modules': '168 pin and 184 pin DIMM.jpg',
    '20_memory_hierarchy': 'ComputerMemoryHierarchy.svg',
    '21_pcie_slots': 'A790GXH-128M-Motherboard.jpg',
    '22_gpu_card': 'GeForce PCI-Express Graphics Card',
    '23_sound_card': 'Sound Blaster Live PCI card',
    '24_network_card': 'Network card.jpg',
    '25_expansion_ports': 'ASRock USB-3 Type-C PCIe-card.jpg'
}

final_urls = {}
for k, q in targets.items():
    if q.endswith(('.jpg', '.JPG', '.png', '.svg')):
        # exact filename search
        u = search_original_image(f"File:{q}")
    else:
        u = search_original_image(q)
    final_urls[k] = u
    print(f"'{k}': '{u}',")

with open('final_urls.json', 'w', encoding='utf-8') as f:
    json.dump(final_urls, f, indent=2)
