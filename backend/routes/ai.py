from difflib import get_close_matches
from fastapi import APIRouter, Depends, Request

from auth.auth_handler import custom_oauth2_scheme, decode_token
from config.answers import load_answers_data

router = APIRouter()
answers_data = load_answers_data()

# Map of keyword categories → JSON keys
KEYWORD_MAP = {
    "top_sales_rep": [
        "top sales", "top performer", "best rep", "highest sales", "top representative", "top_sales_rep"
    ],
    "most_clients": [
        "most clients", "client count", "has most clients", "largest client list", "most_clients"
    ],
    "highest_region": [
        "best region", "top region", "leading region", "which region", "highest region", "highest_region"
    ],
    "in_progress_deals": [
        "in progress", "ongoing deals", "pending deals", "unclosed deals", "active deals", "in_progress_deals"
    ],
    "total_closed_won": [
        "closed won", "total closed", "won deals", "successful deals", "closed_won", "total_closed_won"
    ],
    "closed_lost_count": [
        "closed lost", "lost deals", "missed deals", "closed_lost", "closed_lost_count"
    ],
    "top_finance_clients": [
        "finance clients", "finance companies", "clients in finance", "top_finance_clients"
    ],
    "highest_single_deal": [
        "largest deal", "highest deal", "biggest deal", "most expensive deal", "highest_single_deal"
    ],
    "rep_with_most_skills": [
        "most skills", "skilled rep", "skillful representative", "rep_with_most_skills"
    ],
    "client_industry_diversity": [
        "client industries", "industry diversity", "industry range", "client_industry_diversity"
    ],
}

rep_summaries = answers_data.get("rep_summaries", {})
rep_name_map = {name.lower(): summary for name, summary in rep_summaries.items()}

def find_best_answer_key(user_question: str):
    lowered_q = user_question.lower()

    for key, phrases in KEYWORD_MAP.items():
        for phrase in phrases:
            if phrase in lowered_q:
                return key

    # Fuzzy match fallback
    all_phrases = [(phrase, key) for key, phrases in KEYWORD_MAP.items() for phrase in phrases]
    phrase_list = [p[0] for p in all_phrases]
    match = get_close_matches(lowered_q, phrase_list, n=1, cutoff=0.6)

    if match:
        matched_phrase = match[0]
        for phrase, key in all_phrases:
            if phrase == matched_phrase:
                return key

    return None


@router.post("/mocked")
async def ai_endpoint(
    request: Request,
    token: str = Depends(custom_oauth2_scheme)
):
    username = decode_token(token)
    body = await request.json()
    user_question = body.get("question", "").strip().lower()

    # CHeck if user only asking about rep name
    for name in rep_name_map:
        if name in user_question:
            return {"answer": rep_name_map[name]}

    # Mapping the keywords
    matched_key = find_best_answer_key(user_question)
    if matched_key:
        response = (
            answers_data.get(matched_key) or
            answers_data.get("fun_facts", {}).get(matched_key.replace("fun_", ""), "No answer found.")
        )
        return {"answer": response}

    # Fallback
    return {"answer": "Sorry, I couldn't find a specific answer for that. Please try rephrasing your question!"}
