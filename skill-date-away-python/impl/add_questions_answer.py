#
# voice-skill-sdk
#
# (C) 2020, YOUR_NAME (YOUR COMPANY), Deutsche Telekom AG
#
# This file is distributed under the terms of the MIT license.
# For details see the file LICENSE in the top directory.
#
#
from random import randint
from skill_sdk import skill, Response, ask, tell
from skill_sdk.l10n import _
import requests
from six.moves import urllib

# Ask what their own answer would be to that
INTENT_NAME = 'TEAM_02_ADD_QUESTIONS_ANSWER'

@skill.intent_handler(INTENT_NAME)
def handler(stt: str) -> Response:
    try:
        print('STRING TO TEXT VALUE:', stt)
        userQuestion = urllib.parse.quote(stt)
        print('STRING TO TEXT VALUE PARSED:', userQuestion)

        # We make a request to our backend API to pass the user question
        # didn't find a way how to pass payload to POST req, so making a GET instead
        response = requests.get('http://node-app:5000/questions-add/' + userQuestion, timeout=10)
        # We parse the response json or raise exception if unsuccessful
        response.raise_for_status()
        data = response.json()
        
        if data['value']:
            msg = _('TEAM_02_ADD_QUESTIONS_ANSWER_READ')
        else:
            msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_RESPONSE_ERROR')
    except requests.exceptions.RequestException as err:
        msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_REQUEST_ERROR', err=err)
    
    # We return the response
    return ask(msg)
