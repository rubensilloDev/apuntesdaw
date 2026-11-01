import urllib.request
import urllib.parse
import json

headers = {'User-Agent': 'HardwareStudyApp/1.0 (contact@example.org)'}

files = {
    '1_desktop_setup': 'File:Personal computer desktop.png',
    '2_laptop': 'File:Thinkpad X200 open.jpg',
    '3_cases_factors': 'File:Personal computer, rear view.jpg',
    '4_slim_pc': 'File:Mini-ITX Case.jpg',
    '5_empty_case': 'File:Empty PC Case.jpg',
    '6_case_front': 'File:Antec P182 - Power and LEDs.jpg',
    '7_case_rear': 'File:Back panel of a computer.jpg',
    '8_rgb_case': 'File:RGB desktop computer setup with keyboard and monitor.jpg',
    '9_psu_in_case': 'File:ATX Power Supply in Case.jpg',
    '10_psu_cables': 'File:ATX Power Supply.jpg',
    '11_motherboard_top': 'File:Intel D945GCL Motherboard.jpg',
    '12_motherboard_io': 'File:Motherboard rear panel.jpg',
    '13_chipset_classic': 'File:Northsouthbridge es.png',
    '14_chipset_modern': 'File:Motherboard diagram hr.svg',
    '15_cpu_both_sides': 'File:Intel Core 2 Duo E6750 top and bottom.jpg',
    '16_cpu_pins': 'File:Pentium 4 Underside Demonstrating PGA Socket.JPG',
    '17_cpu_cooler': 'File:Intel heatsink and fan.jpg',
    '18_liquid_cooling': 'File:AIO liquid cooler.jpg',
    '19_ram_modules': 'File:168 pin and 184 pin DIMM.jpg',
    '20_memory_hierarchy': 'File:ComputerMemoryHierarchy.svg',
    '21_pcie_slots': 'File:PCI Express Slots.jpg',
    '22_gpu_card': 'File:GeForce GTX 1080 Ti.jpg',
    '23_sound_card': 'File:Sound blaster live 5.1.jpg',
    '24_network_card': 'File:Network card.jpg',
    '25_expansion_ports': 'File:ASRock USB-3 Type-C PCIe-card.jpg'
}

def resolve_file(file_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                info = p.get('imageinfo', [{}])[0]
                return info.get('url')
    except Exception as e:
        print(f"Error {file_title}: {e}")
    return None

resolved = {}
for k, f_title in files.items():
    orig_url = resolve_file(f_title)
    resolved[k] = orig_url
    print(f"'{k}': '{orig_url}',")

with open('resolved_images.json', 'w', encoding='utf-8') as f:
    json.dump(resolved, f, indent=2)
