# server.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch
from transformers import LlamaTokenizer, LlamaForCausalLM
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost",
    "http://localhost:5500",  # Assuming frontend is served on port 5500
    "http://127.0.0.1:5500",
    # Add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allow specified origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods
    allow_headers=["*"],              # Allow all headers
)

# Define the request body structure
class Message(BaseModel):
    prompt: str

# Load the LLaMA model and tokenizer at startup
@app.on_event("startup")
def load_model():
    global tokenizer, model
    try:
        # Replace 'path_to_llama_tokenizer' and 'path_to_llama_model' with actual paths
        tokenizer = LlamaTokenizer.from_pretrained("path_to_llama_tokenizer")
        model = LlamaForCausalLM.from_pretrained("path_to_llama_model")
        model.eval()
        if torch.cuda.is_available():
            model.to("cuda")
            print("LLaMA model loaded on GPU.")
        else:
            model.to("cpu")
            print("LLaMA model loaded on CPU.")
    except Exception as e:
        print(f"Error loading LLaMA model: {e}")

@app.post("/generate")
def generate_response(message: Message):
    prompt = message.prompt
    if not prompt:
        raise HTTPException(status_code=400, detail="Prompt cannot be empty.")

    try:
        inputs = tokenizer(prompt, return_tensors="pt")
        if torch.cuda.is_available():
            inputs = {k: v.to("cuda") for k, v in inputs.items()}

        # Generate response (adjust parameters as needed)
        output = model.generate(
            **inputs,
            max_length=150,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            early_stopping=True,
            temperature=0.7,
            top_p=0.9
        )
        response = tokenizer.decode(output[0], skip_special_tokens=True)
        # Optionally, remove the prompt from the response
        response = response[len(prompt):].strip()
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {e}")
