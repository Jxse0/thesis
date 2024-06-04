from fastapi import FastAPI,File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import os
from vision import vision
from transcription import transcription
import uuid
from subtitle import subtitle



app = FastAPI()



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

@app.post("/img")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Define the file path
        file_path = os.path.join("img", file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return JSONResponse(vision(file_path), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        # Ensure the file is deleted after processing
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                return f"Error deleting file {file.filename}: {e}"

@app.post("/transcript")
async def upload_audio(file: UploadFile = File(...)):
    unique_filename = None
    file_path = None
    try:
        # Generate a unique ID for the file
        unique_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = unique_id + file_extension

        # Define the file path
        file_path = os.path.join("audio", unique_filename)

        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        # Save the file using a context manager to ensure it is closed properly
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Call transcription function (this function should return a dictionary)
        transcription_result = transcription(file_path)
        
        return JSONResponse(content=transcription_result, status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        # Ensure the file is deleted after processing
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                return f"Error deleting file {unique_filename}: {e}"

@app.post("/video")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Define the file path
        file_path = os.path.join("video", file.filename)

        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return JSONResponse(subtitle(file_path), status_code=200)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
    finally:
        # Ensure the file is deleted after processing
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                return f"Error deleting file {file.filename}: {e}"




