import requests

BASE_URL = "http://localhost:8000/api/players"

def add_player(first_name: str, last_name: str):
    payload = {
        "first_name": first_name,
        "last_name": last_name
        # 'visible' is not needed; defaults to True
    }
    response = requests.post(BASE_URL + "/", json=payload)
    if response.status_code == 200 or response.status_code == 201:
        print("Player added successfully:", response.json())
        return response.json()
    else:
        print("Failed to add player:", response.status_code, response.text)
        return None

def list_players():
    response = requests.get(BASE_URL + "/")
    if response.status_code == 200:
        players = response.json()
        print(f"All players ({len(players)}):")
        for p in players:
            print(p)
        return players
    else:
        print("Failed to fetch players:", response.status_code, response.text)
        return []

if __name__ == "__main__":
    # Example usage
    new_player = add_player("Alice", "Smith")
    
    print("\nChecking players in DB:")
    list_players()
