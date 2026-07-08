import socket
import ssl
import urllib.parse
import re
import os
import requests

def levenshtein_distance(s1, s2):
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
    return previous_row[-1]

KNOWN_SAFE_DOMAINS = ["google.com", "apple.com", "paypal.com", "amazon.com", "microsoft.com", "facebook.com", "github.com"]

def scan_url(url: str) -> dict:
    parsed_url = urllib.parse.urlparse(url)
    # If the URL doesn't have a scheme, assume http:// for parsing purposes
    if not parsed_url.scheme:
        url = "http://" + url
        parsed_url = urllib.parse.urlparse(url)
        
    domain = parsed_url.netloc.split(':')[0]
    
    ssl_valid = False
    is_https = parsed_url.scheme == 'https'
    ssl_error = None
    
    if is_https and domain:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=3) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    ssl_valid = bool(cert)
        except Exception as e:
            ssl_error = str(e)
            
    # Pattern check
    is_ip = bool(re.match(r'^\d{1,3}(\.\d{1,3}){3}$', domain))
    subdomain_count = len(domain.split('.')) - 2 if not is_ip else 0
    
    typosquatting_detected = False
    if not is_ip:
        # Check against known domains
        domain_parts = domain.split('.')
        base_domain = domain_parts[-2] + "." + domain_parts[-1] if len(domain_parts) >= 2 else domain
        for safe_domain in KNOWN_SAFE_DOMAINS:
            if base_domain != safe_domain and levenshtein_distance(base_domain, safe_domain) <= 2:
                typosquatting_detected = True
                break
                
    domain_check = {
        "is_ip": is_ip,
        "too_many_subdomains": subdomain_count > 2,
        "typosquatting_detected": typosquatting_detected
    }
    
    # Google Safe Browsing
    api_key = os.environ.get("GOOGLE_SAFE_BROWSING_API_KEY")
    blacklist_status = "safe"
    
    if api_key and api_key != "your_google_safe_browsing_api_key_here":
        try:
            api_url = f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={api_key}"
            payload = {
                "client": {
                  "clientId": "neovault",
                  "clientVersion": "1.0.0"
                },
                "threatInfo": {
                  "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                  "platformTypes": ["ANY_PLATFORM"],
                  "threatEntryTypes": ["URL"],
                  "threatEntries": [
                    {"url": url}
                  ]
                }
            }
            response = requests.post(api_url, json=payload, timeout=5)
            if response.status_code == 200:
                data = response.json()
                if "matches" in data and len(data["matches"]) > 0:
                    blacklist_status = "dangerous"
        except Exception as e:
            print(f"Safe browsing API error: {e}")
            pass # Fallback to heuristics if API fails
            
    # Scoring Algorithm
    score = 100
    if not is_https: score -= 20
    if is_https and not ssl_valid: score -= 40
    if is_ip: score -= 30
    if subdomain_count > 2: score -= 15
    if typosquatting_detected: score -= 40
    if blacklist_status == "dangerous": score -= 100
    
    score = max(0, min(100, score))
    
    if score >= 80:
        verdict = "Safe"
    elif score >= 50:
        verdict = "Suspicious"
    else:
        verdict = "Dangerous"
        
    return {
        "safety_score": score,
        "verdict": verdict,
        "ssl_valid": ssl_valid,
        "is_https": is_https,
        "ssl_error": ssl_error,
        "domain_check": domain_check,
        "blacklist_status": blacklist_status
    }
