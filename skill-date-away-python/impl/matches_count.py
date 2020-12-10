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

# Find out how many matches user has
INTENT_NAME = 'TEAM_02_MATCHES_COUNT'

@skill.intent_handler(INTENT_NAME)
def handler() -> Response:
    try:
        # We make a request to our backend API to retrieve the number of matches
        response = requests.get('http://node-app:5000/count-matches', timeout=10)
        # We parse the response json or raise exception if unsuccessful
        response.raise_for_status()
        data = response.json()
        
        if data['value']:
            # We get the count value from the response data
            count = data['value']
            print('count', count)
  
            # We get a translated message
            msg = _('TEAM_02_MATCHES_COUNT_READ', count=count)
        else:
            msg = 'Du hast noch keine Matches.'
    except requests.exceptions.RequestException as err:
        msg = _('TEAM_02_MATCHES_COUNT_REQUEST_ERROR', err=err)
    
    # We ask the user back
    return tell(msg)
