#
# voice-skill-sdk
#
# (C) 2020, YOUR_NAME (YOUR COMPANY), Deutsche Telekom AG
#
# This file is distributed under the terms of the MIT license.
# For details see the file LICENSE in the top directory.
#
#
from skill_sdk import skill, Response, ask, tell
from skill_sdk.l10n import _
import requests

# Check how many questions from other users are available for us to answer
INTENT_NAME = 'TEAM_02_CHECK_QUESTIONS'

@skill.intent_handler(INTENT_NAME)
def handler() -> Response:
    try:
        # We make a request to our backend API to retrieve the number
        response = requests.get('http://node-app:5000/count-questions', timeout=10)
        # We parse the response json or raise exception if unsuccessful
        response.raise_for_status()
        data = response.json()
        
        # We get the count value from the response data
        count = data['value']

        if count > 0:
            # We get a translated message
            msg = _('TEAM_02_CHECK_QUESTIONS_READ', count=count)
        else:
            msg = _('TEAM_02_CHECK_QUESTIONS_READ_NONE')

    except requests.exceptions.RequestException as err:
        msg = _('TEAM_02_CHECK_QUESTIONS_REQUEST_ERROR', err=err)

    
    # We return the response
    return tell(msg)
