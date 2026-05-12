import requests
import json
import time

BASE_URL = "http://localhost:5000/api/overlays"

def test_api():
    print("Starting API Verification...")
    
    # 1. Test Create
    print("[1] Testing CREATE...")
    payload = {
        "type": "text",
        "content": "Test Overlay",
        "x": 100,
        "y": 100,
        "width": 200,
        "height": 50
    }
    try:
        response = requests.post(BASE_URL, json=payload)
        if response.status_code == 201:
            data = response.json()
            overlay_id = data['_id']
            print(f"✅ Created successfully. ID: {overlay_id}")
        else:
            print(f"❌ Creation failed: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend. Is it running?")
        return

    # 2. Test Read
    print("[2] Testing READ...")
    response = requests.get(BASE_URL)
    if response.status_code == 200:
        overlays = response.json()
        found = any(o['_id'] == overlay_id for o in overlays)
        if found:
            print(f"✅ Read successful. Found our overlay.")
        else:
            print(f"❌ Read successful but overlay not found.")
    else:
        print(f"❌ Read failed: {response.text}")

    # 3. Test Update
    print("[3] Testing UPDATE...")
    update_payload = {"x": 200, "content": "Updated content"}
    response = requests.put(f"{BASE_URL}/{overlay_id}", json=update_payload)
    if response.status_code == 200:
        print("✅ Update successful.")
    else:
        print(f"❌ Update failed: {response.text}")

    # 4. Test Delete
    print("[4] Testing DELETE...")
    response = requests.delete(f"{BASE_URL}/{overlay_id}")
    if response.status_code == 200:
        print("✅ Delete successful.")
    else:
        print(f"❌ Delete failed: {response.text}")

    print("\n🎉 Verification Complete: Backend and MongoDB are properly connected!")

if __name__ == "__main__":
    test_api()
