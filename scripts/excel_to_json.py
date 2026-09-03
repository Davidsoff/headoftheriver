import os
import pandas as pd
import json

EXCEL_FILE = f'C:\\Users\\gsal\\Nextcloud\\04 Communicatie\\07 Head of de River geschiedenis\\UitslagenArchief\\Uitslagen overzicht.xlsm'
# Anchor the output to the repo root (one level up from this script's folder)
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_FILE = os.path.join(REPO_ROOT, "static", "data", "uitslagen.json")

records = set()

# Read all worksheets
sheets = pd.read_excel(
    EXCEL_FILE,
    sheet_name=None,
    header=2,
    engine="openpyxl"
)

for sheet_name, df in sheets.items():

    # Remove empty rows and columns
    df = df.dropna(how="all")
    df = df.dropna(axis=1, how="all")

    if df.empty or len(df.columns) < 2:
        continue

    year_column = df.columns[0]

    for _, row in df.iterrows():

        year = row[year_column]

        if pd.isna(year):
            continue

        try:
            year = int(year)
        except Exception:
            continue

        for event in df.columns[1:]:

            winner = row[event]

            if pd.isna(winner):
                continue

            winner = str(winner).strip()

            if not winner:
                continue

            records.add((
                sheet_name.strip(),
                year,
                str(event).strip(),
                winner
            ))

# Convert to dictionary structure
records = [
    {
        "category": category,
        "year": year,
        "event": event,
        "winner": winner
    }
    for category, year, event, winner in records
]

# Sort newest first
records.sort(
    key=lambda r: (r["year"], r["category"], r["event"]),
    reverse=True
)

# Create filter lists
categories = sorted(
    {r["category"] for r in records}
)

events = sorted(
    {r["event"] for r in records}
)

years = sorted(
    {r["year"] for r in records},
    reverse=True
)

output = {
    "metadata": {
        "recordCount": len(records)
    },
    "filters": {
        "categories": categories,
        "events": events,
        "years": years
    },
    "records": records
}

os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"Generated {OUTPUT_FILE}")
print(f"Records: {len(records)}")