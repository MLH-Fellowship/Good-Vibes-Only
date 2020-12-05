from predict import sentiment_predict
from flask import Flask, jsonify, request, abort, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    # GET request
    if request.method == 'GET':
        return jsonify({"hello":"World"}) 
    # POST request
    if request.method == 'POST':
        data = request.get_json()  # parse as JSON
        user_content = data["data"]
        result = sentiment_predict(user_content)
        return jsonify(result),200

if __name__ == '__main__' :
    app.run(debug=True, port=5000)