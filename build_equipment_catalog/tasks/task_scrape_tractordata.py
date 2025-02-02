import requests, os, time, json, random, time, argparse, shutil, re
from bs4 import BeautifulSoup, Tag, NavigableString

def fetch_mark_links():
    url = "https://www.tractordata.com/farm-tractors/index.html"
    res = requests.get(url)

    soup = BeautifulSoup(res.content, features="html.parser")
    table =  soup.find("table", attrs={'class': 'tdMenu1'})

    marks = {}
    for row in table.find_all("tr"):
        cells = row.find_all("td")
        link = cells[0].find("a")
        mark = link.text
        marks[mark] = link.attrs["href"]
    return marks

def fetch_mark(mark):
    global marks
    if mark not in marks:
        raise Exception(f"{mark} does not exist")
    url = marks[mark]
    res = requests.get(url)
    soup = BeautifulSoup(res.content, features="html.parser")
    table = soup.find("table", attrs={'class': 'tdMenu1'})
    models = {}
    for row in table.find_all("tr")[1:]:
        cells = row.find_all("td")
        link = cells[0].find("a")
        if link is None: 
            continue
        model = link.text
        start_year = re.match("^[0-9]{4}", cells[2].text.strip())
        end_year = re.match("[0-9]{4}$", cells[2].text.strip())
        
        models[model] = {
            "link": link.attrs["href"],
        }

        if start_year is not None:
            models[model]["start_year"] = start_year[0]
        
        if end_year is not None:
            models[model]["end_year"] = end_year[0]
    return models

if __name__ == "__main__":
    global marks
    marks = fetch_mark_links()
    allowed_marks = [
        "John Deere"
    ]
    for mark in allowed_marks:
        models = fetch_mark(mark)