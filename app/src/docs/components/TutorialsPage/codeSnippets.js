export const libraryUsage =
`   // Require the library
    const RuuviStreamr = require('ruuvi-streamr')

    // Insert your Streamr api key here. You can create one in Settings -> Profile
    const apiKey = 'MY-API-KEY'

    // Define your tags here. A stream with the tag name will be created, if it does not exist.
    // Data from each tag will be produced to its respective stream.
    const tags = {
    '4457e1eccefc425fa577669c62cbb733': {
        name: 'RuuviDemo Zug Fridge',
        description: 'Streamr office fridge in Zug'
    },
    '8955c5f3cd3046e29c3cd2293f1dcbbe': {
        name: 'RuuviDemo Zug Freezer',
        description: 'Streamr office freezer in Zug'
    },
    '6d2b59ffdcc84a759319de9cc3f4086a': {
        name: 'RuuviDemo Zug Meeting Room',
        description: 'Streamr office meeting room in Zug'
    },
    '6ef4bc7d2253474bb19d05769cb7ea76': {
        name: 'RuuviDemo Zug Office',
        description: 'Streamr office in Zug'
    }
    }

    // Start!
    let rs = new RuuviStreamr(apiKey, tags)`

export const ruuviCommands =
`sudo apt-get install libcap2-bin
sudo setcap cap_net_raw+eip $(eval readlink -f \`which node\`)`

export const pythonScript =
`# -*- coding: utf-8 -*-
import requests
import json
import logging as LOG
import time
import threading as thd
LOG.basicConfig(level=LOG.DEBUG,
            format='%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s',
            datefmt='%a, %d %b %Y %H:%M:%S',
            filename='$YOUR_LOGFILE_PATH',
            filemode='a')
# global variable
token = ''
# Get the following infomation from the Streamr
STREAM_ID = '$YOUR_STREAM_ID'
API_KEY = '$YOUR_API_KEY'
# Get the following information from the Google Fitness Platform
CLIENT_ID = '$YOUR_CLIENT_ID'
CLIENT_SECRET = '$YOUR_CLIENT_SECRET'
REFRESH_TOKEN = '$YOUR_REFERSH_TOKEN'
def get_user_token():
""" Request Google Fitness API token using the refresh token
        NOTE: Update every 45min
"""
global token
global CLIENT_ID
global CLIENT_SECRET
global REFRESH_TOKEN

thd.Timer(2700,get_user_token).start()
url = 'https://www.googleapis.com/oauth2/v4/token' 
body = ('{"client_secret":"%s", "grant_type":"refresh_token", "refresh_token":"%s", "client_id":"%s"}'%(CLIENT_SECRET, REFRESH_TOKEN, CLIENT_ID))
headers = '{"Content-Type":"application/x-www-form-urlencoded"}'
try:
    req = requests.post(url, params=headers, data=body)
    token = req.json()['access_token']
    LOG.info("Get user token successfully: %s", token)
    return token
except:
    import traceback
    LOG.error("Unable to get user token")
    traceback.print_exc()
    return None
def get_user_steps(access_token):<br>    pass
# Request User Daily Steps stored in Google Fitness Platform.
# unix timestamp: xxx seconds. Note: Google fitness update steps data one day later.
start_time = time.time() - (time.time() % 86400) + time.timezone - 86400
end_time = time.time() - 86400
url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
body = ('{"aggregateBy": [{"dataTypeName": "com.google.step_count.delta",
    "dataSourceId": "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"}],
    "bucketByTime": { "durationMillis": 86400000 },"startTimeMillis": %s, "endTimeMillis": %s}'%(start_time*1000, end_time*1000))
headers = {"Content-Type":"application/json","Authorization":"Bearer %s" % access_token}
try:
    req = requests.post(url, headers=headers, data=body)
    results_steps = req.json()
    LOG.info("Get user daily steps successfully: %s", results_steps)
    if len(results_steps['bucket'][0]['dataset'][0]['point']):
        return results_steps['bucket'][0]['dataset'][0]['point'][0]['value'][0]['intVal']
    else:
        return None
except:
    import traceback
    LOG.error("Unable to get user daily steps.")
    traceback.print_exc()
    return None
def get_user_calories(access_token):<br>    pass
# Request User Daily Consumed Calories stored in Google Fitness Platform.

# unix timestamp: xxx seconds. Note: Google fitness update steps data one day later.
start_time = time.time() - (time.time() % 86400) + time.timezone - 86400
end_time = time.time() - 86400
url = 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate'
body = ('{"aggregateBy": [{"dataTypeName": "com.google.calories.expended","dataSourceId": 
    "derived:com.google.calories.expended:com.google.android.gms:platform_calories_expended"}],
    "bucketByTime": { "durationMillis": 86400000 },"startTimeMillis": %s, "endTimeMillis": %s}'%(start_time*1000, end_time*1000))
headers = {"Content-Type":"application/json","Authorization":"Bearer %s" % access_token}
try:
    req = requests.post(url, headers=headers, data=body)
    results_calories = req.json()
    LOG.info("Get user daily consumed calories successfully: %s", results_calories)
    if len(results_calories['bucket'][0]['dataset'][0]['point']):
        return results_calories['bucket'][0]['dataset'][0]['point'][0]['value'][0]['fpVal']
    else:
        return None
except:
    import traceback
    LOG.error("Unable to get user daily consumed calories.")
    traceback.print_exc()
    return None
def upload_to_streamr():
# Upload Google Fitness Data to Streamr
# NOTE: Upload per minute<br>
global token
global STREAM_ID
global API_KEY
url = 'https://www.streamr.com/api/v1/streams/'+STREAM_ID+'/data'
headers = {"Authorization":"token %s" % API_KEY}
steps = get_user_steps(token)
calories = get_user_calories(token) 
if steps and calories:
    body = ('{"Daily Steps": %s, "Daily Calories": %s}'%(steps,calories))
elif steps:
    body = ('{"Daily Steps": %s, "Daily Calories": "Zero or not update"}'%steps)
elif calories:
    body = ('{"Daily Steps": "Zero or not update", "Daily Calories": %s}'%calories)
else:
    body = ('{"Daily Steps": "Zero or not update", "Daily Calories": "Zero or not update"}')
LOG.info("Google fitness data is: %s",body)
thd.Timer(60, upload_to_streamr).start()
try:
req = requests.post(url, headers=headers, data=body)
if req.status_code == 200 or req.status_code == 201:
 LOG.info("Upload google fitness data to Streamr successfully.")
 return req.status_code
else:
 LOG.info("Fail to upload google fitness data to Streamr. ERROR: %s", req.status_code)
except:
import traceback
LOG.error("Fail to Upload Google Fitness Data to Streamr.")
traceback.print_exc()
return None
if __name__=="__main__":  
get_user_token()
upload_to_streamr()`
