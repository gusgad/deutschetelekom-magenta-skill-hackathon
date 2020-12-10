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

# Pull contact details from matches
INTENT_NAME = 'TEAM_02_MATCHES_CONTACTS'

@skill.intent_handler(INTENT_NAME)
def handler() -> Response:
    try:
        # We make a request to our backend API to retrieve the contact details of the latest matched person
        response = requests.get('http://node-app:5000/contacts-matches', timeout=10)
        # We parse the response json or raise exception if unsuccessful
        response.raise_for_status()
        data = response.json()
        
        if data['value']:
            # We get the username value from the response data
            username = data['value']
            print('AAAAAA', username)
  
            # We get a translated message
            msg = _('TEAM_02_MATCHES_CONTACTS_READ', username=username)
        else:
            msg = 'Du hast noch keine Matches.'
    except requests.exceptions.RequestException as err:
        msg = _('TEAM_02_MATCHES_CONTACTS_REQUEST_ERROR', err=err)
    
    # We ask the user back
    return tell(msg)
