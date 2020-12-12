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

# To give the user an overview of the app
INTENT_NAME = 'TEAM_02_HOW_WORKS'

@skill.intent_handler(INTENT_NAME)
def handler() -> Response:

    msg = _('TEAM_02_HOW_WORKS_READ')
    
    # We return the response
    return tell(msg)

