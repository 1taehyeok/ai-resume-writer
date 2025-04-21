import requests
import os

class ChatGPTClient:
    def __init__(self):
        self.api_key = os.getenv("CHATGPT_API_KEY")
        self.base_url = "https://api.openai.com/v1/completions"

    def call(self, prompt, max_tokens=200):
        headers = {"Authorization": f"Bearer {self.api_key}"}
        data = {"model": "gpt-3.5-turbo", "prompt": prompt, "max_tokens": max_tokens}
        response = requests.post(self.base_url, json=data, headers=headers)
        return response.json()["choices"][0]["text"]