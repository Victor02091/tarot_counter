# client.py
import requests

data = {
    "name": "TESTT",
    "age": 28,
    "feedback": "Great experience using the app!",
}

response = requests.post("http://127.0.0.1:8000/api/questionnaire/", json=data)

print("Status Code:", response.status_code)
