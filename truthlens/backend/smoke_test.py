import subprocess
import time
import sys
import json
import os
import requests

def start_server():
    """Start uvicorn in a subprocess. Returns the process handle."""
    process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "8765", "--log-level", "warning"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL
    )
    return process

def wait_for_server(base_url: str, timeout: int = 30) -> bool:
    """Poll /api/health until the server responds or timeout expires."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            r = requests.get(f"{base_url}/api/health", timeout=2)
            if r.status_code == 200:
                return True
        except requests.exceptions.ConnectionError:
            pass
        time.sleep(0.5)
    return False

def run_tests(base_url: str):
    tests = []
    
    # Test 1 - Health Check
    try:
        r = requests.get(f"{base_url}/api/health", timeout=5)
        data = r.json()
        assert r.status_code == 200, f"Status code {r.status_code} != 200"
        assert data.get("status") == "ok", "Response missing status: ok"
        assert "version" in data, "Response missing version key"
        assert isinstance(data.get("uptime_seconds"), int) and data.get("uptime_seconds") >= 0, "uptime_seconds must be int >= 0"
        tests.append({"label": "[1] Health endpoint", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[1] Health endpoint", "passed": False, "detail": str(e)})

    # Test 2 - Root Endpoint
    try:
        r = requests.get(f"{base_url}/", timeout=5)
        data = r.json()
        assert r.status_code == 200, f"Status code {r.status_code} != 200"
        assert "message" in data, "Response missing message key"
        tests.append({"label": "[2] Root endpoint", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[2] Root endpoint", "passed": False, "detail": str(e)})

    valid_text_input = "Scientists at MIT have published a peer-reviewed study in Nature showing that regular exercise reduces the risk of cardiovascular disease by 35 percent. The study followed 50,000 participants over 10 years across 12 countries and was funded by the National Institutes of Health. Lead researcher Dr. Sarah Chen said the findings confirm decades of prior research. The study controlled for diet, age, smoking, and socioeconomic status."

    # Test 3 - Valid Text Input (Short Article)
    try:
        r = requests.post(f"{base_url}/api/analyze", json={"input": valid_text_input}, timeout=45)
        assert r.status_code == 200, f"Status code {r.status_code} != 200"
        data = r.json()
        required_fields = ["analysis_id", "timestamp", "input_type", "processing_time_ms", "verdict", "credibility_score", "confidence", "summary", "red_flags", "credible_signals", "manipulation_tactics", "key_claims", "reasoning", "advice"]
        for field in required_fields:
            assert field in data, f"Missing field: {field}"
        assert data["input_type"] == "ARTICLE_TEXT", "input_type must be ARTICLE_TEXT"
        assert isinstance(data["credibility_score"], int) and 0 <= data["credibility_score"] <= 100, "credibility_score invalid"
        assert data["verdict"] in ["Likely Real", "Likely Fake", "Misleading", "Mixed", "Unverifiable"], f"Invalid verdict: {data['verdict']}"
        assert data["confidence"] in ["High", "Medium", "Low"], f"Invalid confidence: {data['confidence']}"
        assert isinstance(data["processing_time_ms"], int) and data["processing_time_ms"] > 0, "processing_time_ms invalid"
        assert isinstance(data["red_flags"], list), "red_flags must be a list"
        assert isinstance(data["credible_signals"], list), "credible_signals must be a list"
        assert isinstance(data["key_claims"], list) and len(data["key_claims"]) >= 1, "key_claims must be a non-empty list"
        tests.append({"label": "[3] Valid text input", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[3] Valid text input", "passed": False, "detail": str(e)})

    # Test 4 - Headline / Short Claim
    try:
        r = requests.post(f"{base_url}/api/analyze", json={"input": "5G towers are causing cancer and the government is hiding the evidence"}, timeout=45)
        assert r.status_code == 200, f"Status code {r.status_code} != 200"
        data = r.json()
        assert data["input_type"] == "HEADLINE", "input_type must be HEADLINE"
        assert isinstance(data["credibility_score"], int) and 0 <= data["credibility_score"] <= 100, "credibility_score invalid"
        assert data["verdict"] in ["Likely Real", "Likely Fake", "Misleading", "Mixed", "Unverifiable"], f"Invalid verdict: {data['verdict']}"
        tests.append({"label": "[4] Headline classification", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[4] Headline classification", "passed": False, "detail": str(e)})

    # Test 5 - Fake News Pattern
    try:
        r = requests.post(f"{base_url}/api/analyze", json={"input": "SHOCKING: Bill Gates admits in leaked Davos recording that COVID vaccines contain microchips that track your location and will be activated by 5G networks in 2026. The mainstream media is suppressing this bombshell revelation. Share before they delete this! Anonymous insiders confirm the globalist agenda is now entering its final phase. Doctors are being paid to stay silent. Your government is lying to you. Wake up and spread the truth NOW before it is too late!!!"}, timeout=45)
        assert r.status_code == 200, f"Status code {r.status_code} != 200"
        data = r.json()
        assert data["credibility_score"] < 35, f"credibility_score too high: {data['credibility_score']}"
        assert len(data["red_flags"]) >= 2, "Should detect at least 2 red flags"
        assert data["verdict"] in ["Likely Fake", "Misleading"], f"Unexpected verdict: {data['verdict']}"
        tests.append({"label": "[5] Fake news detection", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[5] Fake news detection", "passed": False, "detail": str(e)})

    # Test 6 - Input Too Short
    try:
        r = requests.post(f"{base_url}/api/analyze", json={"input": "hi"}, timeout=5)
        assert r.status_code == 400, f"Status code {r.status_code} != 400"
        assert "error" in r.json() or "detail" in r.json(), "Response missing error description"
        tests.append({"label": "[6] Validation - too short", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[6] Validation - too short", "passed": False, "detail": str(e)})

    # Test 7 - Empty Input
    try:
        r = requests.post(f"{base_url}/api/analyze", json={"input": ""}, timeout=5)
        assert r.status_code in [400, 422], f"Status code {r.status_code} not in [400, 422]"
        tests.append({"label": "[7] Validation - empty input", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[7] Validation - empty input", "passed": False, "detail": str(e)})

    # Test 8 - History Endpoint
    try:
        r1 = requests.get(f"{base_url}/api/history", timeout=5)
        assert r1.status_code == 200, "history status != 200"
        assert isinstance(r1.json().get("analyses"), list), "analyses missing or not a list"
        
        requests.post(f"{base_url}/api/analyze", json={"input": valid_text_input}, timeout=45)
        
        r2 = requests.get(f"{base_url}/api/history", timeout=5)
        data2 = r2.json()
        assert len(data2.get("analyses", [])) >= 1, "history list is empty after successful analysis"
        assert "analysis_id" in data2["analyses"][0], "history item missing analysis_id key"
        tests.append({"label": "[8] History endpoint", "passed": True, "detail": ""})
    except Exception as e:
        tests.append({"label": "[8] History endpoint", "passed": False, "detail": str(e)})

    passed_count = sum(1 for t in tests if t["passed"])
    total_count = len(tests)
    
    # Print Report
    print("════════════════════════════════════════")
    print(" TruthLens Backend Smoke Test Report")
    print("════════════════════════════════════════")
    
    for t in tests:
        status_str = "PASS" if t["passed"] else "FAIL"
        print(f" {t['label'].ljust(30)} {status_str}")
        if not t["passed"] and t["detail"]:
            print(f"    {t['detail']}")
            
    print("════════════════════════════════════════")
    if passed_count == total_count:
        print(f" Results: {passed_count}/{total_count} passed\n Backend is ready for deployment.")
    else:
        print(f" Results: {passed_count}/{total_count} passed — fix failures before deploying.")
    print("════════════════════════════════════════")
    
    return passed_count, total_count

if __name__ == "__main__":
    BASE_URL = "http://127.0.0.1:8765"
    
    print("Starting TruthLens backend for smoke testing...")
    server = start_server()
    
    try:
        print("Waiting for server to be ready...")
        ready = wait_for_server(BASE_URL, timeout=60)
        
        if not ready:
            print("ERROR: Server did not start within 60 seconds.")
            print("Check that all dependencies are installed and .env file exists.")
            server.terminate()
            sys.exit(1)
        
        print("Server is ready. Running tests...\n")
        passed, total = run_tests(BASE_URL)
        
    finally:
        server.terminate()
        server.wait()
    
    sys.exit(0 if passed == total else 1)
