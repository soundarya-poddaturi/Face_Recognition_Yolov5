import io
import json
from PIL import Image
from fastapi import File,FastAPI
import torch


# Model
model = torch.hub.load('yolov5', 'custom', path='./static/best.pt', source='local' ,force_reload=True)
    
#create your API
app = FastAPI()

#Set up your API and integrate your ML model 
@app.post("/objectdetection")
async def get_body(file: bytes = File(...)):
    print("helooooo")
    input_image =Image.open(io.BytesIO(file)).convert("RGB")
    print("sdhbb")
    results = model(input_image)
    results_json = json.loads(results.pandas().xyxy[0].to_json(orient="records"))
    print("sdcxjb")
    return {"result": results_json}