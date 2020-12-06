from flask import Flask, render_template, url_for, request, redirect, jsonify
from flask_cors import CORS
from predict import *
from caption import *
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)
CORS(app)

@app.route('/predict-image', methods = ['POST'])
def upload_file():
    if request.method == 'POST':
        img = request.files['image']
        img.save("static/"+img.filename)
        caption = caption_generator("static/"+img.filename)
        result_dic = {
            'image' : "static/" + img.filename,
            'description' : caption
        }
        result_dic['description'] = sentiment_predict(caption)
    return jsonify({'sentiment': result_dic['description']})

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
        return jsonify({'sentiment': result}),200


if __name__ == '__main__':
	app.run(debug = True)