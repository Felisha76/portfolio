import pandas as pd
import requests
import os

# Excel fájl beolvasása
df = pd.read_excel("webzar-tolozar_kepek.xlsx")  # vagy a saját fájlneved

# Letöltési mappa
output_dir = "letoltott_kepek"
os.makedirs(output_dir, exist_ok=True)

for index, row in df.iterrows():
    cikkszam = str(row["cikkszám"]).strip()
    kep_url = row["kép-src"]

    try:
        response = requests.get(kep_url, timeout=10)
        response.raise_for_status()

        # Fájlkiterjesztés meghatározása
        ext = kep_url.split(".")[-1].split("?")[0]
        if ext.lower() not in ["jpg", "jpeg", "png", "gif", "webp"]:
            ext = "jpg"

        fajlnev = f"{cikkszam}.{ext}"
        fajl_utvonal = os.path.join(output_dir, fajlnev)

        with open(fajl_utvonal, "wb") as f:
            f.write(response.content)

        print(f"Sikeresen letöltve: {fajlnev}")

    except Exception as e:
        print(f"Hiba a(z) {cikkszam} cikkszámnál: {e}")
