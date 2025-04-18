import json

from pathlib import Path


def load_answers_data():
    file_path = Path(__file__).resolve().parent.parent / "answers.json"
    with open(file_path, "r", encoding="utf-8") as fp:
        return json.load(fp)