import requests
import json
import random
import re
from datetime import datetime, timedelta
import time


def item_rating(service):
    #get ratings from each service
    serv = re.sub(r'\W+','', str(response[service]))
    try:
        if serv != '' or serv is None:
            serv = int(serv)
            global rating
            global count
            rating = rating + serv
            count = count + 1
    except:
        pass

def del_field(counter, fieldname):
    #delete fields from api that are not in bubble mov_tv table
    del unresponse['results'][counter][fieldname]

def title_chg(title):
    #remove all special characters, spaces and lowercase words
    ch = '[@_!#$%+^&*()<>?/\|}{~:]'
    t_mod = re.sub(ch, '', title)
    t_mod = t_mod.split()
    for i, word in enumerate(t_mod):
        if t_mod[i].islower() == True or len(t_mod[i]) < 4:
            t_mod.remove(word)
    t_mod = ''.join(t_mod)
    return t_mod


yesterday = datetime.now() - timedelta(1)
newdate = datetime.strftime(yesterday, '20' + '%y-%m-%d')
urlun = 'https://unogsng.p.rapidapi.com/search'
query = {'newdate':newdate, 'countrylist':'78','offset':'0', "audio":"english"}
#'un' suffix indicates unogs api
unheaders = {
    'x-rapidapi-key': config.x-rapidapi-key,
    'x-rapidapi-host': 'unogsng.p.rapidapi.com'
    }
unresponse = requests.request('GET', urlun, headers=unheaders, params=query).json()

titles = []
vtype = {}
nfid = {}
for c, item in enumerate(unresponse['results']):
    # titles.append(item['title'])
    # t_key = item['title']
    # vtype[t_key] = item['vtype']
    # nfid[t_key] = item['nfid']
    milli = 'no'
    if item['imdbid'] is None or item['imdbid'] == '':
        tt_id = ''
    else:
        tt_id = item['imdbid']
    untitle = item['title']
    untitle = untitle.replace('&#39;', "'")
    bub_title = untitle #keep this title to add in bubble (keeps spaces)
    untitle = title_chg(untitle)
    unyear = item['year']
    synopsis = item['synopsis'].replace('&#39;', "'")
    unid = item['imdbid']
    del_field(c, 'top250')
    del_field(c, 'top250tv')
    del_field(c, 'avgrating')
    del_field(c, 'imdbrating')
    del_field(c, 'poster')
    params = {}
    imheaders = {}
    try:
        if item['vtype'] == 'movie':
            url = 'https://imdb-api.com/en/API/SearchMovie/' + config.imdb + bub_title
        else:
            url = 'https://imdb-api.com/en/API/SearchSeries/' + config.imdb + bub_title
        response = requests.request('GET', url, headers=imheaders, params=params).json()
    except:
            char = '[@_!#$%^&*+()<>?/\|}{~:]'
            bub_title = re.sub(char, '', bub_title)
            if item['vtype'] == 'movie':
                url = 'https://imdb-api.com/en/API/SearchMovie/' + config.imdb + bub_title
            else:
                url = 'https://imdb-api.com/en/API/SearchSeries/' + config.imdb + bub_title
            response = requests.request('GET', url, headers=imheaders, params=params).json()
    if response['results'] == [] or response['results'] is None:
        tt_id = 'no_id'
    else:
        for media in response['results']:
                api_title = title_chg(media['title'])
                if tt_id == media['id']:
                    break
                elif api_title == untitle:
                    api_yr = media['description']
                    api_yr = api_yr[1:5]
                    if api_yr[:1] != '1' or api_yr[:1] != '2':  #extract the yr if the description doesn't start with the yr
                        api_yr = media['description']
                        api_yr = re.findall(r'\d+', api_yr)
                        if api_yr != []:
                            api_yr = api_yr[0]
                        else:
                            tt_id == 'no_id'
                    if api_title == untitle and api_yr == str(unyear):
                        tt_id = media['id']
                        break
                    else:
                        tt_id = 'no_id'
    if tt_id == 'no_id':
        #get genres
        query = {"netflixid" : item['nfid']}
        urlun = 'https://unogsng.p.rapidapi.com/titlegenres'
        response = requests.request('GET', urlun, headers=unheaders, params=query).json()
        genre_lst = []
        try:
            for c, genre in enumerate(response['results']):
                genre_lst.append(genre['genre'])
            j = ', '
            genre_lst = j.join(genre_lst)
        except:
            pass

        #get countries
        clist = []
        query = {"netflixid" : item['nfid']}
        urlun = "https://unogsng.p.rapidapi.com/titlecountries"
        response = requests.request("GET", urlun, headers=unheaders, params=query).json()
        for c, ctry in enumerate(response['results']):
            clist.append(ctry['country'])
        if len(clist) == 1:
            clist.append('Earth') #don't know how to parse list with single entry as json
        #add all fields for bubble
        item['title'] = bub_title
        item['synopsis'] = synopsis
        item['clist'] = clist
        if genre_lst != []:
            item['genre'] = genre_lst
        item['stream'] = 0
        item['skip'] = 0

        #create a thing in bubble
        bheaders = {'Authorization': config.bubble}
        urlB = 'https://streamorskip.com/api/1.1/obj/mov_tv/'
        bresponse = requests.request('POST', urlB, headers=bheaders, data=item).json()
        time.sleep(6)

    else:
        #get rating for item
        url = 'https://imdb-api.com/en/API/Ratings/' + config.imdb + tt_id
        response = requests.request('GET', url, headers=imheaders, params=params).json()
        rating = 0
        count = 0
        item_rating('metacritic')
        item_rating('imDb')
        item_rating('theMovieDb')
        item_rating('rottenTomatoes')
        item_rating('tV_com')
        item_rating('filmAffinity')
        try:
            rating = round((rating/count)/100, 2)
        except:
            rating = 0
        if rating == 1.0:
            rating = 0
        #get number of votes for item
        url = 'https://imdb-api.com/en/API/UserRatings/' + config.imdb + tt_id
        response = requests.request('GET', url, headers=imheaders, params=params).json()
        try:
            votes = response['totalRatingVotes']
            votes = float(votes) #catches vote counts that are decimals
            votes = int(votes)
            votes = str(votes)
            hi = ['7', '8', '9']
            mid = ['4', '5', '6']
            #decrease number of votes (more realistic)
            if len(votes) == 7:
                votes = votes[:-2]
                milli = 'yes'
                # random.shuffle(hi)
                # votes = hi[0] + votes[1:]
            elif len(votes) == 6:
                votes = votes[:-2]
                random.shuffle(hi)
                votes = hi[0] + votes[1:]
            elif len(votes) == 5:
                votes = votes[:-1]
            votes = int(votes)
            #add streamskip numbers from vote count and rating
            streams = 0
            skips = 0
            if rating == 0 and votes > 0:
                url = 'https://imdb-api.com/en/API/UserRatings/' + config.imdb + tt_id
                response = requests.request("GET", url, headers=imheaders, params=params).json()
                for c, votes in enumerate(response['ratings']):
                    if int(votes['rating']) > 6:
                        streams = streams + int(votes['votes'])
                    else:
                        skips = skips + int(votes['votes'])
            elif rating > 0:
                sos_votes = int(rating*votes)
                streams = sos_votes
                skips = votes - sos_votes
        except:
            streams = 0
            skips = 0
            pass

        #add trailer
        url = 'https://imdb-api.com/en/API/YouTubeTrailer/' + config.imdb + tt_id
        response = requests.request('GET', url, headers=imheaders, params=params).json()
        trailer = response['videoUrl']

        #get genres
        query = {"netflixid" : item['nfid']}
        urlun = 'https://unogsng.p.rapidapi.com/titlegenres'
        response = requests.request('GET', urlun, headers=unheaders, params=query).json()
        genre_lst = []
        try:
            for c, genre in enumerate(response['results']):
                genre_lst.append(genre['genre'])
            j = ', '
            genre_lst = j.join(genre_lst)
        except:
            pass

        #get countries
        clist = []
        query = {"netflixid" : item['nfid']}
        urlun = "https://unogsng.p.rapidapi.com/titlecountries"
        response = requests.request("GET", urlun, headers=unheaders, params=query).json()
        for c, ctry in enumerate(response['results']):
            clist.append(ctry['country'])
        if len(clist) == 1:
            clist.append('Earth')  #don't know how to parse list with single entry as json

        #add all fields for bubble
        item['title'] = bub_title
        item['synopsis'] = synopsis
        item['imdbid'] = tt_id
        item['trailer'] = trailer
        item['clist'] = clist
        if genre_lst != []:
            item['genre'] = genre_lst
        if len(str(streams)) > 4 and milli == 'no':
            streams = int(str(streams)[:4])
        item['stream'] = streams
        if len(str(skips)) > 4 and milli == 'no':
            skips = int(str(skips)[:4])
        item['skip'] = skips

        #verify thing doesn't already exist in bubble
        bheaders = {'Authorization': config.bubble}
        constraints = [{"key": "nfid", "constraint_type": "equals", "value": str(item['nfid'])}]
        urlB = 'https://streamorskip.com/api/1.1/obj/mov_tv?constraints=' + json.dumps(constraints)
        bresponse = requests.request('GET', urlB, headers=bheaders, params={}).json()
        if bresponse['response']['results'] == [] or bresponse['response']['count'] > 0:
            continue
        else:
            #create a thing in bubble
            urlB = 'https://streamorskip.com/api/1.1/obj/mov_tv/'
            bresponse = requests.request('POST', urlB, headers=bheaders, data=item).json()
            time.sleep(6)

#delete items no longer on nflx
urldel = "https://unogsng.p.rapidapi.com/titlesdel"
query = {"countrylist":"78","offset":"0","date":newdate}
response = requests.request("GET", urldel, headers=unheaders, params=query).json()
del_lst = []
id_lst = []
if response['results'] is not None:
    for c, item in enumerate(response['results']):
        del_lst.append(str(item['netflixid']))
    for c, item in enumerate(del_lst):
        constraints = [{"key": "nfid", "constraint_type": "equals", "value": str(item)}]
        urlB = 'https://streamorskip.com/api/1.1/obj/mov_tv?constraints=' + json.dumps(constraints)
        bresponse = requests.request('GET', urlB, headers=bheaders, params={}).json()
        time.sleep(6)
        if bresponse['response']['results'] != []:
            id_lst.append(bresponse['response']['results'][0]['_id'])
        else:
            continue
    params=params
    for c, item in enumerate(id_lst):
        urlB = 'https://streamorskip.com/api/1.1/obj/mov_tv/' + item
        try:
            bresponse = requests.request('DELETE', urlB, headers=bheaders, params=params).json()
            time.sleep(6)
        except:
          continue
    print(del_lst)