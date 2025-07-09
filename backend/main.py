from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import json

app = Flask(__name__)
CORS(app)  # Allow React to access this API

client = MongoClient('mongodb://localhost:27017/')
db = client['demo']
collection = db['courses']

# Custom serializer for ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return super().default(o)


@app.route('/api/grades', methods=['GET'])
def get_people2():
    name_query = request.args.get('dept_name')
    number_query = (request.args.get('course_num'))
    query = {}

    print(name_query, number_query)
    if name_query:
        query['dept_name'] = {'$regex': name_query, '$options': 'i'}
        
        #courses = list(collection.find(query))

    if number_query:
        query['course_num'] = number_query
        # try:
        #     query['course'] = int(number_query)
        # except ValueError:
        #     return {'error': 'course must be an integer'}, 400
    courses = list(collection.find(query))
    print(courses)

    return JSONEncoder().encode(courses), 200, {'Content-Type': 'application/json'}

if __name__ == '__main__':
    app.run(debug=True)
