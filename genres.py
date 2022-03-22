import xlsxwriter
import requests
import csv
import json

id_list = []
with open('mov_tv_export.csv', 'r', encoding='UTF8') as csvfile:
    csv_reader = csv.reader(csvfile)
    next(csv_reader)
    for ids in csv_reader:
        id_list.append(ids)

url = "https://unogsng.p.rapidapi.com/titlegenres"

headers = {
    'x-rapidapi-key': config.x-rapidapi-key,
    'x-rapidapi-host': "unogsng.p.rapidapi.com"
    }

genres = []
err = []
for nfid in id_list:
    query_str = {"netflixid": nfid}
    response = requests.request("GET", url, headers=headers, params=query_str).json()
    try:
        genres.append(response['results'])
    except KeyError:
        err.append(nfid)
        pass

full_lst = []
title_genres = []
for i in range(len(genres)):
    for i2 in range(len(genres[i])):
        lst = list(genres[i][i2].values())
        #print(lst)
        title_genres.append(lst[0])
    full_lst.append(title_genres)
    title_genres = []

row = 0
wb = xlsxwriter.Workbook('title_genres.xlsx')
ws = wb.add_worksheet()
for i in full_lst:
    genre_str = ", ".join(i)
    ws.write(row, 1, genre_str)
    row += 1
wb.close()
print(err)