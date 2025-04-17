import json

from pathlib import Path


def load_dummy_data():
    file_path = Path(__file__).resolve().parent.parent / "dummyData.json"
    with open(file_path, "r", encoding="utf-8") as fp:
        return json.load(fp)