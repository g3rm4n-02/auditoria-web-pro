"""
Ejemplo de chatbot con OpenAI (necesita OPENAI_API_KEY en entorno)
pip install openai
Ejecutar: export OPENAI_API_KEY="tu_key" && python ai/chatbot.py
"""
import os
import openai
def main():
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        print("Set OPENAI_API_KEY antes de ejecutar")
        return
    openai.api_key = key
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role":"user","content":"Dame 5 mejoras SEO para una tienda gourmet en Burgos."}],
        max_tokens=200
    )
    print(resp.choices[0].message.content.strip())

if __name__ == '__main__':
    main()
