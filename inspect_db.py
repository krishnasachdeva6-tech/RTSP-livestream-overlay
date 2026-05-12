import requests
import json

BASE_URL = "http://localhost:5000/api/overlays"

def get_all_overlays():
    print("Fetching all overlays...")
    try:
        response = requests.get(BASE_URL)
        if response.status_code == 200:
            overlays = response.json()
            print(f"Found {len(overlays)} overlays.")
            for i, o in enumerate(overlays):
                print(f"[{i}] ID: {o.get('_id')}")
                print(f"    Type: {o.get('type')}")
                print(f"    Content: {o.get('content')}")
                print(f"    Position: ({o.get('x')}, {o.get('y')})")
                print(f"    Size: {o.get('width')}x{o.get('height')}")
                print("-" * 20)
        else:
            print(f"Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    get_all_overlays()
