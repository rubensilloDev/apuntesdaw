import urllib.request
import time
import os

os.makedirs('img', exist_ok=True)

headers = {'User-Agent': 'HardwareStudyApp/1.0 (contact@example.org)'}

# 25 images carefully selected and matching each figure
images = [
    # 1. Conjunto torre, monitor, teclado, ratón
    ('fig1_setup.jpg', 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80'),
    # 2. Portátil abierto
    ('fig2_laptop.jpg', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'),
    # 3. Factores de forma de cajas
    ('fig3_cajas_factores.jpg', 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80'),
    # 4. Caja Slim / pequeña
    ('fig4_caja_slim.jpg', 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=800&q=80'),
    # 5. Interior de caja vacía
    ('fig5_caja_interior.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Gabinete99.jpg'),
    # 6. Frontal torre
    ('fig6_torre_frontal.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Antec_P182_-_Power_and_LEDs.jpg'),
    # 7. Trasera torre
    ('fig7_torre_trasera.jpg', 'https://upload.wikimedia.org/wikipedia/commons/2/2a/ATX_computer_case_-_left_-_2018-05-18.jpg'),
    # 8. Torre gaming cristal templado y ARGB
    ('fig8_torre_argb.jpg', 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80'),
    # 9. Emplazamiento fuente de alimentación
    ('fig9_fuente_emplazamiento.jpg', 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=800&q=80'),
    # 10. Fuente con cables y conectores
    ('fig10_fuente_cables.jpg', 'https://upload.wikimedia.org/wikipedia/commons/6/62/PSU-Open1.jpg'),
    # 11. Placa base vista superior componentes
    ('fig11_placa_base_superior.jpg', 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'),
    # 12. Placa base conectores traseros
    ('fig12_placa_base_lateral.jpg', 'https://upload.wikimedia.org/wikipedia/commons/3/33/Gigabyte_GeForce_GV-N710D3-2GL_2_GiB_PCI-Express_Graphics_Card_%28Jigs_Tech%29_001.png'),
    # 13. Diagrama chipset clásico
    ('fig13_chipset_clasico.png', 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Northsouthbridge_es.png'),
    # 14. Diagrama placa Intel/AMD
    ('fig14_chipset_moderno.png', 'https://upload.wikimedia.org/wikipedia/commons/4/4f/ASRock_K7VT4A_Pro_Mainboard_Labeled_German.PNG'),
    # 15. Procesador por sus dos caras
    ('fig15_procesador_dos_caras.jpg', 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80'),
    # 16. Patillas de procesador (PGA pins / contactos)
    ('fig16_patillas_procesador.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/04/Pentium_4_Underside_Demonstrating_PGA_Socket.JPG'),
    # 17. Cooler stock / ventilador
    ('fig17_cooler_stock.jpg', 'https://upload.wikimedia.org/wikipedia/commons/6/62/Cooler_Master_Hyper_212_EVO_-_CPU_Cooler_with_120mm_PWM_Fan_%28RR-212E-20PK-R2%29.jpg'),
    # 18. Refrigeración líquida AIO
    ('fig18_refrigeracion_liquida.png', 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Deepcool_cooler.png'),
    # 19. Módulos RAM
    ('fig19_modulos_ram.jpg', 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=800&q=80'),
    # 20. Jerarquía de memoria
    ('fig20_jerarquia_memoria.svg', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/ComputerMemoryHierarchy.svg'),
    # 21. Ranuras PCIe
    ('fig21_ranuras_pcie.jpg', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/A790GXH-128M-Motherboard.jpg'),
    # 22. Tarjeta de vídeo contactos y salidas
    ('fig22_tarjeta_video.jpg', 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=800&q=80'),
    # 23. Tarjeta de sonido
    ('fig23_tarjeta_sonido.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/96/Creative-Sound-Blaster-Live_82997-480x360_%284816933779%29.jpg'),
    # 24. Tarjeta de red Ethernet
    ('fig24_tarjeta_red.jpg', 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Network_card.jpg'),
    # 25. Tarjeta ampliación puertos
    ('fig25_ampliacion_puertos.jpg', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/ASRock_USB-3_Type-C_PCIe-card.jpg')
]

for filename, url in images:
    path = os.path.join('img', filename)
    if os.path.exists(path) and os.path.getsize(path) > 1000:
        print(f"Already exists: {filename} ({os.path.getsize(path)} bytes)")
        continue
    
    success = False
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as resp:
                data = resp.read()
                with open(path, 'wb') as f:
                    f.write(data)
                print(f"Downloaded: {filename} ({len(data)} bytes)")
                success = True
                break
        except Exception as e:
            print(f"Attempt {attempt+1} failed for {filename}: {e}")
            time.sleep(2)
            
    time.sleep(1.2) # Polite interval

print("Image download process completed!")
