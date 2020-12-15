#
# voice-skill-sdk
#
# (C) 2020, YOUR_NAME (YOUR COMPANY), Deutsche Telekom AG
#
# This file is distributed under the terms of the MIT license.
# For details see the file LICENSE in the top directory.
#
#
import random
from skill_sdk import skill, Response, ask, tell
from skill_sdk.l10n import _
import requests
from six.moves import urllib

# Get the answer from our user for the question asked by another user
INTENT_NAME = 'TEAM_02_ASK_QUESTIONS_ANSWER'

@skill.intent_handler(INTENT_NAME)
def handler(stt_text: str) -> Response:
    try:
        stt_text_quoted = urllib.parse.quote(stt_text)
        # We make a request to our backend API to pass the user answer
        # didn't find a way how to pass payload to POST req, so making a GET instead
        response = requests.get('http://node-app:5000/questions-answer/' + stt_text_quoted, timeout=10)
        # We parse the response json or raise exception if unsuccessful
        response.raise_for_status()
        data = response.json()

        if data['value']:
            # We get the count value from the response data
            result = data['value']
            msg = ''
            rand_number = random.random()
            # We get a translated message
            if result == 'match':
                if rand_number > 0 and rand_number < 0.25:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MATCH')
                elif rand_number > 0.25 and rand_number < 0.50:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MATCH2')
                elif rand_number > 0.50 and rand_number < 0.75:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MATCH3')
                elif rand_number > 0.75 and rand_number < 1:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MATCH4')
            else:
                if rand_number > 0 and rand_number < 0.20:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MORE')
                elif rand_number > 0.20 and rand_number < 0.40:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MORE2')
                elif rand_number > 0.40 and rand_number < 0.60:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MORE3')
                elif rand_number > 0.60 and rand_number < 0.80:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MORE4')
                elif rand_number > 0.80 and rand_number < 1:
                    msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_MORE5')
              
        else:
            msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_RESPONSE_ERROR')
    except requests.exceptions.RequestException as err:
        msg = _('TEAM_02_ASK_QUESTIONS_ANSWER_REQUEST_ERROR', err=err)
    
    # We return the response
    return ask(msg)
