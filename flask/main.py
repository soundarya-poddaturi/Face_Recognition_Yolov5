import base64
from fastapi import FastAPI, File
from starlette.responses import Response
import io
from PIL import Image
import json
from fastapi.middleware.cors import CORSMiddleware
import torch
import numpy as np
from base64 import b64encode
from json import dumps, loads




def attempt_download(weights):
    # Ensure weights file exists
    weights = str(weights)
    if not os.path.exists(weights):
        raise FileNotFoundError(f"Weights file not found at {weights}")
    return weights

def get_yolov5():
    try:
        # First attempt: Load with weights_only=True (future-proof method)
        model = torch.hub.load('yolov5', 
                             'custom', 
                             path='./static/best.pt',
                             source='local',
                             force_reload=True,
                             weights_only=True)  # Set weights_only=True
        
    except Exception as e:
        print(f"Warning: Failed to load with weights_only=True, attempting fallback method: {e}")
        try:
            # Fallback method: Load weights directly with safe_loading
            weights_path = './static/best.pt'
            # Ensure the weights file exists
            weights_path = attempt_download(weights_path)
            
            # Load the model architecture first
            model = torch.hub.load('yolov5',
                                 'custom',
                                 path=None,  # Don't load weights yet
                                 source='local',
                                 force_reload=True)
            
            # Load weights with safe loading
            with torch.serialization.safe_load(weights_path) as state_dict:
                model.load_state_dict(state_dict, strict=True)
                
        except Exception as e:
            print(f"Error: Failed to load model with safe loading: {e}")
            # Final fallback: Traditional loading method (only if absolutely necessary)
            model = torch.hub.load('yolov5',
                                 'custom',
                                 path='./static/best.pt',
                                 source='local',
                                 force_reload=True)
    
    # Set model to evaluation mode
    model.eval()
    return model

# def get_yolov5():   # Traditional loading method (not recommended) but this is what we did for proj while creating this wud alone be 
#until no update in pytorch

#     model = torch.hub.load('yolov5', 'custom', path='./static/best.pt', source='local', force_reload=True)
#     return model

def get_image_from_bytes(binary_image, max_size=1024):
    input_image = Image.open(io.BytesIO(binary_image)).convert("RGB").resize((640,640))
    return input_image

model = get_yolov5()
app = FastAPI(
    title="Face detection api",
    description="yoo",
    version="0.0.1",
)

origins = [
    "http://localhost",
    "http://localhost:8000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/notify/v1/health')
def get_health():
    return dict(msg='OK')

@app.post("/object-to-img")
async def detect_return_base64_img(file: bytes = File(...)):
    input_image = get_image_from_bytes(file)
    results = model(input_image)
    
    # Get detection results
    detect_res = results.pandas().xyxy[0].to_json(orient="records")
    detect_res = json.loads(detect_res)
    
    # Extract unique names
    names = {item["name"] for item in detect_res}
    
    # Convert results to image
    for img in results.ims:
        # Convert to numpy array and ensure it's writable
        img_array = np.array(img, copy=True)
        
        # Create PIL image and resize
        pil_img = Image.fromarray(img_array).resize((832, 480))
        
        # Save to temporary file
        with io.BytesIO() as bio:
            pil_img.save(bio, format='PNG')
            img_bytes = bio.getvalue()
            
        # Convert to base64
        base64_string = b64encode(img_bytes).decode('utf-8')
        raw_data = {"image": base64_string}
        json_data = dumps(raw_data, indent=2)
        
        return {
            "result": list(names),  # Convert set to list for JSON serialization
            "img": Response(content=json_data, media_type="image/jpeg")
        }