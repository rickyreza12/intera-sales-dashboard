import google.generativeai as genai
from config.settings import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

def list_available_models():
    models = genai.list_models()
    for model in models:
        print(f" Model ID: {model.name}")
        print(f"   Supported methods: {model.supported_generation_methods}")
        print("-" * 50)

if __name__ == "__main__":
    list_available_models()
