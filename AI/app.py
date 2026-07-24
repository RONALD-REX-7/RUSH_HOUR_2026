from flask import Flask, request, jsonify
from flask_cors import CORS
from services.prediction_service import PredictionService

app = Flask(__name__)
CORS(app)

prediction_service = PredictionService()

@app.errorhandler(400)
def bad_request(error):
    return jsonify({"success": False, "data": None, "message": "Bad Request"}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "data": None, "message": "Not Found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "data": None, "message": "Internal Server Error"}), 500

@app.route('/api/ai/health', methods=['GET'])
def health_check():
    return jsonify({"success": True, "data": {"status": "healthy"}, "message": "API is running."})

@app.route('/api/ai/categorize', methods=['POST'])
def categorize():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "data": None, "message": "No JSON payload provided"}), 400
            
        title = data.get('title', '')
        description = data.get('description', '')
        
        result = prediction_service.categorize(title, description)
        return jsonify({"success": True, "data": result, "message": "Categorization successful"})
    except Exception as e:
        return jsonify({"success": False, "data": None, "message": str(e)}), 500

@app.route('/api/ai/duplicate-check', methods=['POST'])
def duplicate_check():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "data": None, "message": "No JSON payload provided"}), 400
            
        title = data.get('title', '')
        description = data.get('description', '')
        existing_reports = data.get('existingReports', [])
        
        result = prediction_service.check_duplicate(title, description, existing_reports)
        return jsonify({"success": True, "data": result, "message": "Duplicate check successful"})
    except Exception as e:
        return jsonify({"success": False, "data": None, "message": str(e)}), 500

@app.route('/api/ai/demand-estimate', methods=['POST'])
def demand_estimate():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "data": None, "message": "No JSON payload provided"}), 400
            
        category = data.get('category', 'Other')
        report_count = data.get('reportCount', 1)
        population_estimate = data.get('populationEstimate', 10000)
        nearest_alternative_km = data.get('nearestAlternativeKm', 10.0)
        
        result = prediction_service.estimate_demand(category, report_count, population_estimate, nearest_alternative_km)
        return jsonify({"success": True, "data": result, "message": "Demand estimation successful"})
    except Exception as e:
        return jsonify({"success": False, "data": None, "message": str(e)}), 500

@app.route('/api/ai/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "data": None, "message": "No JSON payload provided"}), 400
            
        result = prediction_service.analyze(data)
        return jsonify({"success": True, "data": result, "message": "Analysis successful"})
    except Exception as e:
        return jsonify({"success": False, "data": None, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
