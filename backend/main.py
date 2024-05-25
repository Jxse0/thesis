from typing import Union
from fastapi import FastAPI,File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from model import predict
from fastapi.responses import JSONResponse
import shutil
import os



app = FastAPI()


UPLOAD_DIR = "img"
os.makedirs(UPLOAD_DIR, exist_ok=True)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def read_root():
    return {"Hello World"}

@app.get("/predict/{number}")
def predict_number(number: int):
    prediction = predict(number)
    return {"prediction": prediction}

@app.post("/img")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Define the file path
        file_path = os.path.join(UPLOAD_DIR, file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return JSONResponse(content={"filename": file.filename}, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)