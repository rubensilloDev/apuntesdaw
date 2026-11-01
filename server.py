#!/usr/bin/env python3
"""
Servidor Local de Estudio & Edición en Vivo para 1.º DAW
Permite navegar la plataforma y guardar modificaciones directamente en los archivos HTML.
"""

import http.server
import json
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

ALLOWED_HTML_FILES = {
    'index.html',
    'tema1.html',
    'tema2.html',
    'bbdd-tema1.html'
}

class StudioEditorHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/save':
            self.handle_save_html()
        else:
            self.send_error(404, "Endpoint no encontrado")

    def handle_save_html(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length <= 0:
                self._send_json(400, {'success': False, 'error': 'Cuerpo de petición vacío'})
                return

            body = self.rfile.read(content_length).decode('utf-8')
            data = json.loads(body)

            raw_filename = data.get('filename', '')
            html_content = data.get('html', '')

            # Extraer solo el nombre base del archivo para evitar path traversal
            filename = os.path.basename(raw_filename.split('?')[0].split('#')[0])

            if not filename or filename not in ALLOWED_HTML_FILES:
                self._send_json(400, {
                    'success': False, 
                    'error': f'Archivo no permitido: {filename}. Archivos permitidos: {", ".join(ALLOWED_HTML_FILES)}'
                })
                return

            if not html_content or len(html_content) < 100:
                self._send_json(400, {'success': False, 'error': 'El contenido HTML es inválido o demasiado corto'})
                return

            filepath = os.path.join(DIRECTORY, filename)

            # Escribir el archivo en codificación UTF-8
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(html_content)

            print(f"[OK] Archivo guardado correctamente en disco: {filename} ({len(html_content)} bytes)")

            self._send_json(200, {
                'success': True,
                'message': f'Archivo {filename} actualizado y guardado permanentemente en el disco.',
                'filename': filename,
                'bytes': len(html_content)
            })

        except Exception as e:
            print(f"[ERROR] Error al guardar archivo: {e}")
            self._send_json(500, {'success': False, 'error': str(e)})

    def _send_json(self, status_code, payload):
        body = json.dumps(payload, ensure_ascii=False).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def main():
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, StudioEditorHandler)
    print("=" * 65)
    print("  DAW StudyHub - Servidor Local de Estudio & Edición en Vivo")
    print("=" * 65)
    print(f"  URL del Portal:     http://localhost:{PORT}")
    print(f"  Directorio raíz:   {DIRECTORY}")
    print("  Modo Edición:       Habilitado con guardado directo en disco")
    print("  Para detener:       Presiona Ctrl + C en esta consola")
    print("=" * 65)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor detenido correctamente.")
        sys.exit(0)

if __name__ == '__main__':
    main()
