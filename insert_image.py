import requests

BASE_URL = "http://localhost:5000/api/overlays"

def create_test_image():
    print("Creating test image overlay...")
    payload = {
        "type": "image",
        "content": "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png", # Known working PNG
        "x": 100,
        "y": 100,
        "width": 200,
        "height": 150
    }
    try:
        response = requests.post(BASE_URL, json=payload)
        if response.status_code == 201:
            print(f"✅ Created image overlay: {response.json()['_id']}")
        else:
            print(f"❌ Failed: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_test_image()
