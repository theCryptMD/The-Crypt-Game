import json
import logging
from flask import Flask, request
from firebase_admin import initialize_app
from firebase_functions import https_fn
import google.auth
import google.auth.transport.requests
from google.cloud import firestore

logging.basicConfig(level=logging.INFO)

initialize_app()
app = Flask(__name__)

creds, project = google.auth.default()
auth_req = google.auth.transport.requests.Request()

db = firestore.Client()

@app.post("/get_user_profile")
def get_user_profile():
    request_json = request.get_json(silent=True)
    if request_json and "profile_id" in request_json:
        profile_id = request_json["profile_id"]
        logging.info("INCOMING ID: `%s`", profile_id)

        doc_ref = db.collection('CLIENTS').document(profile_id)
        doc = doc_ref.get()

        if doc.exists:
            profile = doc.to_dict()
            logging.info("PROFILE FOUND! %s", profile)
            return profile
        else:
            logging.info("PROFILE NOT FOUND! Returning empty profile.")
            return {}

    logging.info("PROFILE NOT FOUND! Returning empty profile.")
    return {}


@https_fn.on_request()
def main(req: https_fn.Request) -> https_fn.Response:
    creds.refresh(auth_req)
    with app.request_context(req.environ):
        return app.full_dispatch_request()
