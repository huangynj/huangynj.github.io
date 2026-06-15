import json
import os
from scholarly import scholarly

# Set the author ID (Yongjie Huang's Google Scholar ID)
AUTHOR_ID = "OUrJeeMAAAAJ"

def fetch_scholar_data():
    try:
        print(f"Fetching Google Scholar data for Author ID: {AUTHOR_ID}")
        # Search for the author and fetch detailed profile
        search_query = scholarly.search_author_id(AUTHOR_ID)
        author = scholarly.fill(search_query, sections=['counts', 'indices'])
        
        # Extract citations per year
        cites_per_year = author.get('cites_per_year', {})
        total_citations = author.get('citedby', 0)
        h_index = author.get('hindex', 0)
        i10_index = author.get('i10index', 0)
        
        if not cites_per_year:
            print("Warning: No citation data found. Scholar might be blocking the request.")
            return False

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

if __name__ == "__main__":
    success = fetch_scholar_data()
    if not success:
        # Exit with error code so GitHub Action fails and alerts if it breaks
        exit(1)
