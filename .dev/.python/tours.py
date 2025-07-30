import json
import requests

def tour_whitelist():
  data = requests.get('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/tour-whitelist?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI').json()['values'][1:]
  
  print(data)
  
  response = {}
  
  for row in data:
    if row[2] not in response.keys():
      response[row[2]] = []
      print(row[2])
    response[row[2]].append(row[3])
    print(response[row[2]])
  
  return response