from .grok_client import GrokClient
from .chatgpt_client import ChatGPTClient
# 나중에 추가될 다른 LLM 클라이언트 import 예시
# from .claude_client import ClaudeClient

class LLMManager:
    def __init__(self):
        self.clients = {
            "grok": GrokClient(),
            "chatgpt": ChatGPTClient(),
            # "claude": ClaudeClient(),    # 미래에 추가 가능
        }

    def get_client(self, model_name):
        client = self.clients.get(model_name.lower())
        if not client:
            raise ValueError(f"지원되지 않는 모델: {model_name}")
        return client

    def generate(self, model_name, prompt, max_tokens=200):
        client = self.get_client(model_name)
        return client.call(prompt, max_tokens)
