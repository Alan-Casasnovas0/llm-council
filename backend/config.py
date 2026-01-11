"""Configuration for the LLM Council."""

import os
from dotenv import load_dotenv

load_dotenv()

# default URL for Ollama
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

# Council members - list of LOCAL Ollama model names
COUNCIL_MODELS = [
    "llama3.2:1b",
    "falcon3:1b",
    "qwen3:1.7b",
]

# Chairman model - synthesizes final response
CHAIRMAN_MODEL = "gemma3n:e2b"

# Data directory for conversation storage
DATA_DIR = "data/conversations"
