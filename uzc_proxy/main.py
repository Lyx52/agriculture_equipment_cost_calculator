import requests

from bottle import route, run, template, response, json_dumps, request
def apply_cors():
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, PUT, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = [
        'Origin', 
        'Accept', 
        'Content-Type',
        'X-Requested-With', 
        'X-CSRF-Token',
        'Authorization'
    ]
data_cache = {}
@route('/uzc_gazes/<table>/json/query')
def index(table):
    url = f"https://www.uzc.lbtu.lv/lv/uzc_gazes/{table}/json/query?{request.urlparts.query}"
    if url in data_cache:
        data = data_cache[url]
    else:
        res = requests.get(url)
        data = res.json()
        data_cache[url] = data
    response.content_type = 'application/json'
    apply_cors()
    return json_dumps(data)
filter_cache = {}

@route('/uzc_gazes/technical_equipment/filters/<filter>')
def filters(filter):
    url = f"https://www.uzc.lbtu.lv/lv/uzc_gazes/technical_equipment/filters/{filter}?{request.urlparts.query}"
    if url in filter_cache:
        data = filter_cache[url]
    else:
        res = requests.get(url)
        data = res.json()
        filter_cache[url] = data
    response.content_type = 'application/json'
    apply_cors()
    return json_dumps(data)

run(host='localhost', port=8888)

