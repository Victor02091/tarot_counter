export async function submitPartyResult(result) {
    const res = await fetch("http://localhost:8000/api/party-results/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });
  
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Erreur serveur");
    }
  
    return await res.json();
  }
  