import urllib.request
import json

headers = {'User-Agent': 'HardwareStudyApp/1.0 (contact@example.org)'}

def get_image_url(filename):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            pages = data.get('query', {}).get('pages', {})
            for pid, p in pages.items():
                info = p.get('imageinfo', [{}])[0]
                return info.get('thumburl') or info.get('url')
    except Exception as e:
        print(f"Error {filename}: {e}")
    return None

images_to_check = {
    # 1. Desktop setup
    'desktop_setup': 'File:Personal computer desktop.png',
    # 2. Laptop
    'laptop_open': 'File:Dell Inspiron 15 7000.jpg',
    # 3. Form factors / Cases
    'cases_factors': 'File:Computer cases.jpg',
    # 4. Slim PC
    'slim_pc': 'File:Mini-ITX Case.jpg',
    # 5. Empty case
    'empty_case': 'File:Computer case interior.jpg',
    # 6. Front tower
    'case_front': 'File:Antec P180 front.jpg',
    # 7. Rear tower
    'case_rear': 'File:Computer-chassis-rear-atx.svg',
    # 8. RGB Gaming case
    'rgb_case': 'File:RGB desktop computer setup with keyboard and monitor.jpg',
    # 9. PSU in case
    'psu_in_case': 'File:ATX Power Supply in Case.jpg',
    # 10. PSU with cables
    'psu_cables': 'File:ATX Power Supply.jpg',
    # 11. Motherboard top
    'motherboard_top': 'File:Intel D945GCL Motherboard.jpg',
    # 12. Motherboard rear I/O
    'motherboard_io': 'File:Motherboard rear panel.jpg',
    # 13. Chipset classic
    'chipset_classic': 'File:Chipset schematic.svg',
    # 14. Modern chipset / block diagram
    'chipset_modern': 'File:Intel 82801EB ICH5 Southbridge.jpg',
    # 15. CPU both sides
    'cpu_both_sides': 'File:Intel Core 2 Duo E6750 top and bottom.jpg',
    # 16. CPU pins (PGA contacts)
    'cpu_pins': 'File:Pentium 4 Underside Demonstrating PGA Socket.JPG',
    # 17. CPU Cooler
    'cpu_cooler': 'File:Intel heatsink and fan.jpg',
    # 18. Liquid cooling AIO
    'liquid_cooling': 'File:AIO liquid cooler.jpg',
    # 19. RAM modules DDR
    'ram_modules': 'File:RAM n00885.jpg',
    # 20. Memory hierarchy
    'memory_hierarchy': 'File:ComputerMemoryHierarchy.svg',
    # 21. PCIe slots
    'pcie_slots': 'File:PCI Express Slots.jpg',
    # 22. Graphics card (GPU)
    'gpu_card': 'File:GeForce GTX 1080 Ti.jpg',
    # 23. Sound card
    'sound_card': 'File:Sound blaster live 5.1.jpg',
    # 24. Network card
    'network_card': 'File:Ethernet NIC card.jpg',
    # 25. Expansion ports
    'expansion_ports': 'File:USB 3.0 PCIe Card.jpg'
}

results = {}
for key, filename in images_to_check.items():
    url = get_image_url(filename)
    results[key] = url
    print(f"'{key}': '{url}',")

with open('image_urls.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
