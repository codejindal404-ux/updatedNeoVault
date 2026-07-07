import os
import json
from google import genai

def parse_document_text(raw_text: str) -> dict:
    """
    Sends raw OCR text to Gemini to classify the document and extract key fields as JSON.
    """
    if not raw_text or not raw_text.strip():
        return {}
        
    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        print("GEMINI_API_KEY is not set.")
        return {}
        
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    Analyze the following OCR text from a document. 
    1. Identify the document type (e.g., Aadhaar, PAN, Driving License, Marksheet, or 'Other').
    2. Extract key fields present in the text (e.g., name, date_of_birth, id_number, address, issue_date, expiry_date).
    3. Return ONLY a valid JSON object. Do not include markdown code blocks (like ```json), and do not include any other explanatory text.
    
    OCR Text:
    ---
    {raw_text}
    ---
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt,
        )
        
        response_text = response.text.strip()
        
        # Clean up markdown code blocks if Gemini still includes them
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
            
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        return json.loads(response_text.strip())
    except json.JSONDecodeError as e:
        print(f"Gemini JSON Decode Error: {e}. Raw response: {response_text}")
        return {}
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return {}
