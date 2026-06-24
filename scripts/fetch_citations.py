import json
import os
import urllib.request
from scholarly import scholarly

# Set the author ID (Yongjie Huang's Google Scholar ID)
AUTHOR_ID = "OUrJeeMAAAAJ"

def skip_update(reason):
    print(f"Warning: {reason}. Keeping existing citations.json.")
    return True

def fetch_scholar_data():
    try:
        print(f"Fetching Google Scholar data for Author ID: {AUTHOR_ID}")
        
        # Search for the author and fetch detailed profile
        search_query = scholarly.search_author_id(AUTHOR_ID)
        if search_query is None:
            return skip_update("Google Scholar returned no author profile")

        try:
            author = scholarly.fill(search_query, sections=['counts', 'indices'])
        except AttributeError as e:
            if "'NoneType' object has no attribute 'get'" in str(e):
                return skip_update("Google Scholar returned an empty author profile")
            raise

        if author is None:
            return skip_update("Google Scholar returned no citation profile")
        if not isinstance(author, dict):
            return skip_update(f"Google Scholar returned an unexpected profile payload ({type(author).__name__})")
        
        # Extract citations per year
        cites_per_year = author.get('cites_per_year', {})
        total_citations = author.get('citedby', 0)
        h_index = author.get('hindex', 0)
        i10_index = author.get('i10index', 0)
        
        if not cites_per_year:
            return skip_update("No citation data found; Scholar might be blocking the request")

        # Sort and write to citations.json
        output_file = 'citations.json'
        
        new_data = {
            "total_citations": total_citations,
            "h_index": h_index,
            "i10_index": i10_index,
            "cites_per_year": dict(sorted(cites_per_year.items()))
        }
        existing_data = {}
        if os.path.exists(output_file):
            with open(output_file, 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    pass

        if existing_data == new_data:
            print("No changes in citation data.")
            return True
            
        with open(output_file, 'w') as f:
            json.dump(new_data, f, indent=4)
            
        print("Successfully saved updated citation data to citations.json.")
        return True

    except Exception as e:
        print(f"Error fetching Google Scholar data: {e}")
        return False

def fetch_orcid_peer_reviews():
    try:
        print("Fetching ORCID peer review data...")
        url = "https://pub.orcid.org/v3.0/0000-0001-7883-8768/peer-reviews"
        request = urllib.request.Request(
            url,
            headers={"Accept": "application/json"},
        )
        with urllib.request.urlopen(request) as response:
            data = json.load(response)

        reviews = [
            review
            for group in data.get("group", [])
            for peer_group in group.get("peer-review-group", [])
            for review in peer_group.get("peer-review-summary", [])
        ]

        output_file = "orcid_peer_reviews.json"
        existing_data = []
        if os.path.exists(output_file):
            with open(output_file, 'r') as f:
                try:
                    existing_data = json.load(f)
                except json.JSONDecodeError:
                    pass

        if existing_data == reviews:
            print(f"No changes in ORCID peer review data (total {len(reviews)}).")
            return True

        with open(output_file, "w") as f:
            json.dump(reviews, f, indent=2)

        print(f"Successfully saved {len(reviews)} ORCID peer reviews to {output_file}.")
        return True
    except Exception as e:
        print(f"Error fetching ORCID peer review data: {e}")
        return False

if __name__ == "__main__":
    scholar_success = fetch_scholar_data()
    orcid_success = fetch_orcid_peer_reviews()
    if not scholar_success or not orcid_success:
        # Exit with error code so GitHub Action fails and alerts if it breaks
        exit(1)

