import warnings
from flask_cors import cross_origin
import os
from flask import Flask, jsonify, request, make_response
import argparse
import uuid
import json
import time
from tqdm import tqdm
import tensorflow as tf
from deepface import DeepFace

tf_version = int(tf.__version__.split(".")[0])
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

if tf_version == 2:
    import logging
    tf.get_logger().setLevel(logging.ERROR)

if tf_version == 1:
    graph = tf.get_default_graph()

warnings.filterwarnings("ignore")

app = Flask(__name__)



@app.route('/')
def index():
    return '<h1>Hi, giv image plox!</h1>'


@app.route('/verify', methods=['POST'])
@cross_origin()
def verify():

    global graph

    tic = time.time()
    req = request.get_json()
    trx_id = uuid.uuid4()

    resp_obj = {'success': False}

    if tf_version == 1:
        with graph.as_default():
            resp_obj = verifyWrapper(req, trx_id)
    elif tf_version == 2:
        resp_obj = verifyWrapper(req, trx_id)

    toc =  time.time()
    print(resp_obj)
    resp_obj["trx_id"] = trx_id
    resp_obj["seconds"] = toc-tic

    return jsonify(resp_obj), 200

def verifyWrapper(req, trx_id = 0):

    resp_obj = {'success': False}

    model_name = "VGG-Face"; distance_metric = "cosine"; detector_backend = "opencv"
    
    instances = []
    if "img" in list(req.keys()):
        img = req["img"][0] #list
  
        validate_img = False
        if len(img) > 11 and img[0:11] == "data:image/":
            validate_img = True
            instances.append(img)
        if validate_img != True:
            print("invalid")
            return {'success': False, 'error': 'you must pass img as base64 encoded string'}

    if len(instances) == 0:
        return {'success': False, 'error': 'you must pass at least one img object in your request'}

    print("Input request of ", trx_id, " has ",len(instances)," pairs to verify")

    try:
        df = DeepFace.find(img_path = img, db_path = "data"
            , model_name = model_name
            , distance_metric = distance_metric
            , detector_backend = detector_backend
        )
        idents = df["identity"]
        confidents = df["VGG-Face_cosine"]
        
        verified = False
        if len(idents) > 0:
            possibleUser = idents[0].replace("data/","").split(".")[0]
            print(idents[0], confidents[0])
            if confidents[0] < 0.4:
                print("login success")
                verified = True
                resp_obj = {'success': True, 'username': possibleUser}
                
        if not verified:
            resp_obj = {'success': False, 'error': 'No valid user found'}

    except Exception as err:
        print("error:", err)
        if str(err) == "Face could not be detected. Please confirm that the picture is a face photo or consider to set enforce_detection param to False.":
            resp_obj = {'success': False, 'error': "No face detect"}
        else:
            resp_obj = {'success': False, 'error': str(err)}

    return resp_obj

@app.route('/register', methods=['POST'])
@cross_origin()
def register():

    global graph

    tic = time.time()
    req = request.get_json()
    trx_id = uuid.uuid4()

    resp_obj = {'success': False}

    if tf_version == 1:
        with graph.as_default():
            resp_obj = verifyWrapper(req, trx_id)
    elif tf_version == 2:
        resp_obj = verifyWrapper(req, trx_id)

    print(resp_obj)
    if resp_obj["success"] == True:
        return jsonify({'success': False, 'error':'User already exists'}), 205
    
    img = req["img"][0]
    username = req["username"]
    
    register(img,username)
    
    toc =  time.time()
    resp_obj["success"] = True
    resp_obj["new_ident"] = username
    resp_obj["trx_id"] = trx_id
    resp_obj["seconds"] = toc-tic

    return jsonify(resp_obj), 200

def register(img,username):
    storeNewIdentity(img.replace('data:image/jpeg;base64,', ''),username)
    
def storeNewIdentity(baseHash, name:str):    
    import base64
    
    imgdata = base64.b64decode(baseHash)
    filename = f"data/{name}.jpg"
    with open(filename, 'wb') as f:
        f.write(imgdata)
    
    os.remove("data/representations_vgg_face.pkl")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '-p', '--port',
        type=int,
        default=5000,
        help='Port of serving api')
    args = parser.parse_args()
    app.run(host='0.0.0.0', port=args.port)
