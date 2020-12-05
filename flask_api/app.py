from predict import load_models, preprocess, sentiment_predict
from flask import Flask, jsonify, request
from flask_restful import reqparse, Api, Resource, abort

app = Flask(__name__)
api = Api(app)


class PredictSentiment(Resource):
	def get(self):
		return('Hello, World!')
	def put(self):
		text = request.form['data']
		ret  = sentiment_predict(text)
		return(jsonify(ret))

api.add_resource(PredictSentiment, '/')


if __name__ == '__main__' :
    app.run(port=5000, debug=True)