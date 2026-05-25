import http.server
import os
import sys
import webbrowser
from http import HTTPStatus

PORT = 8000

class SPAServer(http.server.SimpleHTTPRequestHandler):
    """
    A simple HTTP request handler that implements fallback routing for SPAs.
    If the requested file does not exist, it falls back to serving index.html.
    This enables seamless client-side routing on page refreshes (e.g. /weave, /scholar).
    """
    def do_GET(self):
        # Resolve the local path from the request path
        path = self.translate_path(self.path)
        
        # If the path does not exist and does not have a file extension
        # (meaning it's likely a virtual route like /weave or /settings),
        # fall back to serving the root index.html
        if not os.path.exists(path) and not os.path.splitext(path)[1]:
            print(f"[SPA Router] Virtual route detected: {self.path} -> Falling back to index.html")
            self.path = "/index.html"
            
        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        # Override error response to make it look nicer than the default python page
        self.log_error("code %d, message %s", code, message)
        self.send_response(code)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.end_headers()
        
        error_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Error {code} - Obsidian Siren Studio</title>
            <style>
                body {{
                    background-color: #101010;
                    color: #c5c1b9;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                }}
                h1 {{ font-family: 'Cinzel', serif; color: #FCFBF8; font-size: 3rem; margin-bottom: 10px; }}
                p {{ color: #7f7f7f; margin-bottom: 20px; }}
                a {{ color: #9D50BB; text-decoration: none; border: 1px solid #9D50BB; padding: 8px 16px; border-radius: 4px; transition: all 0.3s; }}
                a:hover {{ background-color: #9D50BB; color: #fff; }}
            </style>
        </head>
        <body>
            <h1>Error {code}</h1>
            <p>{message or "Something went wrong in the studio."}</p>
            <a href="/">Return to Studio Entrance</a>
        </body>
        </html>
        """
        self.wfile.write(error_html.encode('utf-8'))

def run(port=PORT):
    # Change directory to the script's directory to ensure relative paths resolve correctly
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)
    
    server_address = ('', port)
    
    try:
        # Avoid bind errors on quick restarts
        http.server.HTTPServer.allow_reuse_address = True
        httpd = http.server.HTTPServer(server_address, SPAServer)
        
        print("\n" + "="*60)
        print("          OBSIDIAN SIREN STUDIO - LOCAL DEV SERVER")
        print("="*60)
        print(f"  Server is starting on port: {port}")
        print(f"  Local Address:              http://localhost:{port}")
        print("  Press Ctrl+C to terminate the server at any time.")
        print("="*60 + "\n")
        
        # Open web browser automatically
        webbrowser.open(f"http://localhost:{port}")
        
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\n[Server] Studio shuttered. Exiting...")
        sys.exit(0)
    except Exception as e:
        print(f"[Error] Failed to launch server: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run()
