import requests, flask

from bottle import route, run, template, response, json_dumps
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
cached = None
@route('/uzc_gazes/<table>/json/query')
def index(table):
    global cached
    if cached is None: 
        res = requests.get(f"https://www.uzc.lbtu.lv/lv/uzc_gazes/{table}/json/query")
        cached = json_dumps(res.json())
    response.content_type = 'application/json'
    apply_cors()
    return cached

run(host='localhost', port=8080)

