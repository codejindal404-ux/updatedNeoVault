import os
import pytesseract
from pdf2image import convert_from_path
from PIL import Image

# Set the tesseract executable path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Note: pdf2image requires poppler to be installed on Windows and added to PATH
# Download from: https://github.com/oschwartz10612/poppler-windows/releases/

def extract_text_from_file(file_path: str, file_type: str) -> str:
    """
    Extracts text from an image or PDF file using PyTesseract.
    """
    extracted_text = ""
    try:
        if file_type in ['png', 'jpg', 'jpeg']:
            image = Image.open(file_path)
            extracted_text = pytesseract.image_to_string(image)
        elif file_type == 'pdf':
            images = convert_from_path(file_path)
            for img in images:
                extracted_text += pytesseract.image_to_string(img) + "\n"
        return extracted_text.strip()
    except Exception as e:
        print(f"OCR Error extracting text from {file_path}: {e}")
        return ""
