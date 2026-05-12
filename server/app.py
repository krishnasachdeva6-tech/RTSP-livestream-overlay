from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

app = Flask(__name__)
CORS(app)

# MongoDB Configuration
# Use environment variable for production, fallback to local for dev
MONGO_URI = os.environ.get('MONGO_URI', "mongodb://localhost:27017/")
DB_NAME = "rtsp_overlay_app"

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client[DB_NAME]
    overlays_collection = db.overlays
    # Test connection
    client.server_info()
    print("Connected to MongoDB successfully.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    # In a real app we might exit or assume it works later, 
    # but for dev we'll carry on and let requests fail if DB is down.

@app.route('/api/overlays', methods=['GET'])
def get_overlays():
    try:
        overlays = []
        for doc in overlays_collection.find():
            doc['_id'] = str(doc['_id'])
            overlays.append(doc)
        return jsonify(overlays), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays', methods=['POST'])
def create_overlay():
    try:
        data = request.json
        # Validate minimal required fields
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        new_overlay = {
            "type": data.get("type", "text"), # 'text' or 'image'
            "content": data.get("content", "Overlay"),
            "x": data.get("x", 10),
            "y": data.get("y", 10),
            "width": data.get("width", 200),
            "height": data.get("height", 100),
            "styles": data.get("styles", {}) # Extra styles like color, etc.
        }
        
        result = overlays_collection.insert_one(new_overlay)
        new_overlay['_id'] = str(result.inserted_id)
        
        return jsonify(new_overlay), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<id>', methods=['PUT'])
def update_overlay(id):
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        update_fields = {k: v for k, v in data.items() if k != '_id'}
        
        result = overlays_collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
            
        return jsonify({"message": "Updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overlays/<id>', methods=['DELETE'])
def delete_overlay(id):
    try:
        result = overlays_collection.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404
            
        return jsonify({"message": "Deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
