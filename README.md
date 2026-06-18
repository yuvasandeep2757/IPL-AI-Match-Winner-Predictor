Live Demo: [Click here to view the live application](https://ipl-ai-match-winner-predictor.vercel.app/)
A full-stack Machine Learning web application that predicts the outcome of Indian Premier League (IPL) cricket matches in real-time.
Unlike standard prediction models, this engine features a custom Super Over protocol that triggers random tie-breaker generations when the AI calculates a nail-biting 50-50 win probability.
✨ Features
Real-time ML Matrix: Predicts win probabilities using a Scikit-Learn Random Forest Classifier trained on historical IPL match data.
Dynamic Super Over Logic: Automatically detects mathematical ties (49%-51% probability) and generates a simulated Super Over outcome.
Historical H2H Analytics: Filters and displays live head-to-head records between the selected teams.
Responsive Dashboard: A modern, side-by-side React UI built with Tailwind CSS for seamless data visualization.
🛠️ Tech Stack
Backend: Python, Flask, Pandas, Scikit-Learn, Joblib
Frontend: React.js, Vite, Tailwind CSS
Deployment: PythonAnywhere (Backend API), Vercel (Frontend UI)
🚀 How to Run Locally
Prerequisites
Make sure you have Node.js and Python installed on your machine.
Backend Setup
Clone this repository: git clone https://github.com/yuvasandeep2757/IPL-AI-Match-Winner-Predictor.git
Navigate to the main directory.
Install the required Python packages: pip install -r requirements.txt
Run the Flask backend: python app.py (Runs on port 5000)
Frontend Setup
Open a new terminal and navigate to the frontend folder: cd frontend
Install the Node dependencies: npm install
Start the development server: npm run dev
