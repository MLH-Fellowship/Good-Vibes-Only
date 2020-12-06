from keras.applications.resnet50 import ResNet50, preprocess_input, decode_predictions
from keras.preprocessing.sequence import pad_sequences
from keras.preprocessing import image
from keras.models import load_model, Model
import matplotlib.pyplot as plt
import pickle
import numpy as np
import warnings
warnings.filterwarnings("ignore")

model = load_model("./model/caption_model.h5")
model.make_predict_function()
model_imag = ResNet50(weights="imagenet", input_shape=(224,224,3))
model_resnet = Model(model_imag.input, model_imag.layers[-2].output)
model_resnet.make_predict_function()

with open("./model/word_to_idx.pkl", "rb") as w2i:
    word_to_idx = pickle.load(w2i)

with open("./model/idx_to_word.pkl", "rb") as i2w:
    idx_to_word = pickle.load(i2w)

def preprocess_image(img):
    img = image.load_img(img, target_size=(224,224))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img = preprocess_input(img)
    return img

def encode_image(img):
    img = preprocess_image(img)
    feature_vector = model_resnet.predict(img)
    feature_vector = feature_vector.reshape(1, feature_vector.shape[1])
    return feature_vector

def predict_caption(img):
    start = "startseq"
    max_len = 35
    for i in range(max_len):
        sequence = [word_to_idx[w] for w in start.split() if w in word_to_idx]
        sequence = pad_sequences([sequence], maxlen=max_len, padding='post')

        ypred =  model.predict([img,sequence])
        ypred = ypred.argmax()
        word = idx_to_word[ypred]
        start+= ' ' +word

        if word =='endseq':
            break
    final_caption =  start.split()
    final_caption = final_caption[1:-1]
    final_caption = ' '.join(final_caption)
    return final_caption

def caption_generator(input_img): 
    img = encode_image(input_img)
    caption = predict_caption(img)
    return caption

    