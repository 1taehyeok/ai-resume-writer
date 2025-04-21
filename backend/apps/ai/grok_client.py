import requests
import os

class GrokClient:
    def __init__(self):
        self.api_key = os.getenv("GROK_API_KEY")
        self.base_url = "https://api.xai.com/grok"  # 가정된 URL

    def call(self, prompt, max_tokens=200):
        if not self.api_key:
            raise ValueError("GROK_API_KEY가 설정되지 않았습니다.")
        
        headers = {"Authorization": f"Bearer {self.api_key}"}
        data = {"prompt": prompt, "max_tokens": max_tokens}
        
        try:
            response = requests.post(self.base_url, json=data, headers=headers)
            response.raise_for_status()
            return response.json().get("content")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Grok API 호출 실패: {str(e)}")