from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from model import predict



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

@app.get("/predict/{number}")
def predict_number(number: int):
    prediction = predict(number)
    return {"prediction": prediction}