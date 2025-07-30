import json
import requests

def get_users():
  values = requests.get('https://sheets.googleapis.com/v4/spreadsheets/1RCxdryrlsUn37VZz5UlndUcFWjCUDElhGQMJLTfx6rk/values/signup?key=AIzaSyCPoCo9JcBf6_p7JqlPDZ_6frBODdw4EAI').json()['values']
  headers = values[0][10:]
  data = values[1:]
  data = list(filter(lambda v:v!=[],list(map(lambda v:v[10:],data))))
  
  response = {}
  print(data)
  
  for row in data:
    response[row[0]] = {}
    for i,k in enumerate(headers):
      response[row[0]][k] = row[i]
  
  return response