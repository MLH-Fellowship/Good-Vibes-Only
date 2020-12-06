from flask import Flask, render_template, url_for, request, redirect
from predict import *
import warnings
warnings.filterwarnings("ignore")

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

@app.route('/', methods = ['POST'])
def upload_file():
	if request.method == 'POST':
		img = request.files['image']
		img.save("static/"+img.filename)
		caption = caption_generator("static/"+img.filename)
		result_dic = {
			'image' : "static/" + img.filename,
			'description' : caption
		}
	return render_template('index.html', results = result_dic)

if __name__ == '__main__':
	app.run(debug = True)