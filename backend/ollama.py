"""Ollama API client for local LLM requests."""

import httpx
from typing import List, Dict, Any, Optional
from .config import OLLAMA_BASE_URL
import time

async def query_model(
    model: str,
    messages: List[Dict[str, str]],
    timeout: float = 1000.0  # Local models can be slow, increased timeout
) -> Optional[Dict[str, Any]]:
    """
    Query a single local model via Ollama API.

    Args:
        model: Ollama model identifier (e.g., "llama3", "mistral")
        messages: List of message dicts with 'role' and 'content'
        timeout: Request timeout in seconds

    Returns:
        Response dict with 'content' and optional 'reasoning_details', or None if failed
    """
    
    # Ollama API endpoint for chat
    url = f"{OLLAMA_BASE_URL}/api/chat"
    
    payload = {
        "model": model,
        "messages": messages,
        "stream": False, # We want the full response at once, not streamed
        "options": {
            "temperature": 0.7, # Standard creative temperature
            "num_ctx": 4096    # Context window size
        }
    }

    try:
        # Start timer
        start_time = time.time()
        # Note: No API Key header needed for local Ollama
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                url,
                json=payload
            )
            response.raise_for_status()

            # End timer
            duration = time.time() - start_time
            
            data = response.json()
            
            # Ollama returns the message in data['message']
            message_content = data.get('message', {}).get('content', '')

            # Some models (like DeepSeek R1) expose reasoning in a separate field
            reasoning = data.get('message', {}).get('reasoning_content')

            return {
                'content': message_content,
                'reasoning_details': reasoning,
                'duration': round(duration, 2) # in seconds
            }

    except Exception as e:
        print(f"Error querying local model {model}: {e}")
        return None


async def query_models_parallel(
    models: List[str],
    messages: List[Dict[str, str]]
) -> Dict[str, Optional[Dict[str, Any]]]:
    """
    Query multiple local models in parallel.

    Args:
        models: List of Ollama model identifiers
        messages: List of message dicts to send to each model

    Returns:
        Dict mapping model identifier to response dict (or None if failed)
    """
    import asyncio

    # Create tasks for all models
    tasks = [query_model(model, messages) for model in models]

    # Wait for all to complete
    responses = await asyncio.gather(*tasks)

    # Map models to their responses
    return {model: response for model, response in zip(models, responses)}