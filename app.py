from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import random

app = Flask(__name__)
CORS(app)

model = joblib.load('ipl_prediction_model.pkl')
encoder = joblib.load('team_encoder.pkl')

try:
    df_matches = pd.read_csv('matches.csv')
    df_matches.columns = df_matches.columns.str.lower()
    name_corrections = {
        "Royal Challengers Bangalore": "Royal Challengers Bengaluru",
        "Kings XI Punjab": "Punjab Kings",
        "Delhi Daredevils": "Delhi Capitals"
    }
    df_matches.replace(name_corrections, inplace=True)
except FileNotFoundError:
    df_matches = pd.DataFrame(columns=['team1', 'team2', 'winner'])

VENUE_MAPPING = {
    "Wankhede Stadium, Mumbai": {"venue": 12, "city": 5},
    "Eden Gardens, Kolkata": {"venue": 4, "city": 2},
    "M Chinnaswamy Stadium, Bengaluru": {"venue": 7, "city": 1},
    "MA Chidambaram Stadium, Chennai": {"venue": 8, "city": 3},
    "Narendra Modi Stadium, Ahmedabad": {"venue": 10, "city": 4}
}

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message":"The IPL Match Prediction API is running Successfully!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    team1_name = data['team1']
    team2_name = data['team2']
    toss_winner_name = data['toss_winner']
    venue_name = data['venue']

    team1_num = encoder.transform([team1_name])[0]
    team2_num = encoder.transform([team2_name])[0]
    toss_winner_num = encoder.transform([toss_winner_name])[0]
    
    v_data = VENUE_MAPPING.get(venue_name, {"venue": 12, "city": 5})

    match_scenario = pd.DataFrame({
        'city': [v_data["city"]], 'venue': [v_data["venue"]], 
        'team1': [team1_num], 'team2': [team2_num],
        'toss_winner': [toss_winner_num], 'toss_decision': [1], 
        'target_runs': [165], 'target_overs': [20.0], 'super_over': [0]
    })

    probabilities = model.predict_proba(match_scenario)[0]
    team1_index = list(model.classes_).index(team1_num)
    team2_index = list(model.classes_).index(team2_num)
    
    raw_prob_team1 = probabilities[team1_index]
    raw_prob_team2 = probabilities[team2_index]
    
    total_prob = raw_prob_team1 + raw_prob_team2
    if total_prob == 0: total_prob = 1 
        
    team1_win_prob = round((raw_prob_team1 / total_prob) * 100, 2)
    team2_win_prob = round((raw_prob_team2 / total_prob) * 100, 2)

    # --- THE SUPER OVER LOGIC ---
    # Trigger a tie if the probabilities are incredibly close (49% to 51%)
    is_tie = bool(49.0 <= team1_win_prob <= 51.0)
    super_over_winner = ""
    so_t1 = ""
    so_t2 = ""

    if is_tie:
        predicted_winner_name = "Match Tied!"
        tied_score = random.randint(160, 205)
        t1_proj = f"{tied_score}/{random.randint(5, 9)} in 20 overs"
        t2_proj = f"{tied_score}/{random.randint(5, 9)} in 20 overs"
        
        # Generate random Super Over Scores
        so_runs_1 = random.randint(8, 20)
        so_runs_2 = random.randint(8, 20)
        while so_runs_1 == so_runs_2: # Ensure someone actually wins the super over
            so_runs_2 = random.randint(8, 20)
            
        so_t1 = f"{so_runs_1}/{random.randint(0, 2)} in 1 over"
        so_t2 = f"{so_runs_2}/{random.randint(0, 2)} in 1 over"
        
        super_over_winner = team1_name if so_runs_1 > so_runs_2 else team2_name

    else:
        if team1_win_prob > team2_win_prob:
            predicted_winner_name = team1_name
            t1_proj = f"{random.randint(180, 215)}/{random.randint(2, 5)} in 20 overs"
            t2_proj = f"{random.randint(140, 175)}/{random.randint(6, 10)} in 20 overs"
        else:
            predicted_winner_name = team2_name
            t2_proj = f"{random.randint(180, 215)}/{random.randint(2, 5)} in 20 overs"
            t1_proj = f"{random.randint(140, 175)}/{random.randint(6, 10)} in 20 overs"

    past_matches = df_matches[((df_matches['team1'] == team1_name) & (df_matches['team2'] == team2_name)) | 
                              ((df_matches['team1'] == team2_name) & (df_matches['team2'] == team1_name))]
    
    return jsonify({
        "matchup": f"{team1_name} vs {team2_name}",
        "predicted_winner": predicted_winner_name,
        "is_tie": is_tie,
        "super_over_winner": super_over_winner,
        "team1_prob": 50.0 if is_tie else team1_win_prob, # Force exactly 50/50 visual on UI if tied
        "team2_prob": 50.0 if is_tie else team2_win_prob,
        "h2h": {"total_matches": len(past_matches), "team1_wins": int((past_matches['winner'] == team1_name).sum()), "team2_wins": int((past_matches['winner'] == team2_name).sum())},
        "projected_scores": {
            "team1_score": t1_proj, 
            "team2_score": t2_proj,
            "super_over_t1": so_t1,
            "super_over_t2": so_t2
        }
    })


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)