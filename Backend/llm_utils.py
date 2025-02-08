from openai import AzureOpenAI
import os
import dotenv

dotenv.load_dotenv()


client = AzureOpenAI(
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"), 
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    api_version=os.getenv("api_version")
)


def call_llm(messages, max_tokens=10000):
    chat_completion = client.chat.completions.create(
                messages=messages,
                model=os.getenv("deployment_name"),
                temperature=0.3,
                max_tokens=max_tokens,
    )
    
    return chat_completion.choices[0].message.content



# Test the function
if __name__ == "__main__":
    
    
    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of California?"},
    ]
    
    print(call_llm(messages))

