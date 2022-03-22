import xlsxwriter
import requests
import json
import csv
id_list = []
with open('mov_tv_export.csv', 'r', encoding='UTF8') as csvfile:
    csv_reader = csv.reader(csvfile)
    next(csv_reader)
    for ids in csv_reader:
        id_list.append(ids)

link = []
for tt in id_list:
    tt = str(tt)
    tt = tt.strip("'[]'")
    url = "https://imdb-api.com/en/API/YouTubeTrailer/"  + config.imdb  + tt
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data = payload).json()
    link.append(response['videoUrl'])

row = 0
wb = xlsxwriter.Workbook('trailers.xlsx')
ws = wb.add_worksheet()
for i in link:
    ws.write(row, 1, i)
    row += 1
wb.close()
