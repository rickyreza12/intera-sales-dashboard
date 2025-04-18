import google.generativeai as genai
from config.settings import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def ask_gemini(prompt: str) -> str:
    try:
        model = genai.GenerativeModel("gemini-1.5-pro-latest")
        
        response = model.generate_content(prompt)
        
        return response.text if response and response.text else "Sorry, no response generated."

    except Exception as e:
        print("Gemini Error:", e)
        return "Sorry, I couldn't process that right now."
    
def list_available_models():
    models = genai.list_models()
    for model in models:
        print(f"Model ID: {model.name}")
        print(f"Supported methods: {model.supported_generation_methods}")
        print("-" * 40)