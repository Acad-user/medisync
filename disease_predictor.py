import random
import json
import pickle
import sys

import nltk
from nltk.stem import WordNetLemmatizer
from tensorflow.keras.models import load_model

import numpy as np
import speech_recognition as sr
import pyttsx3
import time

lemmatizer = WordNetLemmatizer()

# Load the model and data
try:
    intents = json.loads(open("intents.json").read())
    words = pickle.load(open('words.pkl', 'rb'))
    classes = pickle.load(open('classes.pkl', 'rb'))
    model = load_model('chatbot_model.h5')
except Exception as e:
    print(f"Error loading model: {str(e)}")
    sys.exit(1)

def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    return sentence_words

def bag_of_words(sentence):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)
    for w in sentence_words:
        for i, word in enumerate(words):
            if word == w:
                bag[i] = 1
    return np.array(bag)

def predict_class(sentence):
    bow = bag_of_words(sentence)
    res = model.predict(np.array([bow]))[0]
    ERROR_THRESHOLD = 0.25
    results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    results.sort(key=lambda x: x[1], reverse=True)
    return_list = []
    for r in results:
        return_list.append({
            'intent': classes[r[0]],
            'probability': str(r[1])
        })
    return return_list

def get_response(intents_list, intents_json):
    if not intents_list:
        return "I'm not sure I understand. Could you please rephrase that?"
    
    tag = intents_list[0]['intent']
    list_of_intents = intents_json['intents']
    
    for i in list_of_intents:
        if i['tag'] == tag:
            return random.choice(i['responses'])
    
    return "I'm not sure how to respond to that."

def process_input(text_input):
    predictions = predict_class(text_input)
    response = get_response(predictions, intents)
    return {
        'input': text_input,
        'predictions': predictions,
        'response': response
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Please provide symptoms as command line arguments")
        sys.exit(1)
    
    text_input = ' '.join(sys.argv[1:])
    result = process_input(text_input)
    print(json.dumps(result)) 