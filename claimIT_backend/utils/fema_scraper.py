import requests
import urllib.parse
from datetime import datetime
from ..models import DisasterUpdate

# Map FEMA disaster types to our internal types
DISASTER_MAP = {
    'Flood': 'flood',
    'Hurricane': 'hurricane',
    'Tornado': 'tornado',
    'Fire': 'wildfire',
    'Earthquake': 'earthquake',
    'Other': 'other',
}

# Map FEMA declaration types to severity levels
DECLARATION_SEVERITY = {
    'DR': 3,  # Major Disaster Declaration
    'EM': 3,  # Emergency Declaration
    'FM': 2,  # Fire Management Assistance Declaration
    'FS': 1,  # Fire Suppression Authorization
}

# Map FEMA declaration types to display names
DECLARATION_DISPLAY = {
    'DR': 'Major Disaster Declaration',
    'EM': 'Emergency Declaration',
    'FM': 'Fire Management Assistance Declaration',
    'FS': 'Fire Suppression Authorization',
}

# FEMA incident type codes
INCIDENT_TYPE_CODES = {
    'earthquake': 51018,
    'flood': 51019,
    'hurricane': 51020,
    'tornado': 51022,
    'wildfire': 51023,
    'winter storm': 51091,
}

def scrape_fema_disasters(user_state=None, postal_code=None):
    """
    Fetch disaster declarations from FEMA Open API and upsert to DisasterUpdate.
    """
    api_url = 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries'
    filters = []
    order_by='declarationDate desc'
    if user_state or postal_code:
        sts = user_state if isinstance(user_state, list) else [user_state]
        sf = " or ".join([f"state eq '{s}'" for s in sts])
        filters.append(f"({sf})")
    # build OData query manually to preserve `$` in parameter names
    query = [f'$top={10}']  # Limit to 10 most recent records
    if filters:
        filter_str = ' and '.join(filters)
        filter_enc = urllib.parse.quote_plus(filter_str)
        query.append(f'$filter={filter_enc}')
    if order_by:
        order_enc = urllib.parse.quote_plus(order_by)
        query.append(f'$orderby={order_enc}')
    url = f"{api_url}?{'&'.join(query)}"
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        records = resp.json().get('DisasterDeclarationsSummaries', [])
        print(f"Fetched {len(records)} DisasterDeclarationsSummaries records")
        
        DisasterUpdate.objects.all().delete()
        
        # Process and save new disaster updates
        for rec in records:
            # Extract and map the fields from FEMA data
            title = rec.get('declarationTitle', '')
            location = rec.get('designatedArea', '')
            d_type = DISASTER_MAP.get(rec.get('incidentType'), 'other')
            declaration_type = rec.get('declarationType', '')
            severity = DECLARATION_SEVERITY.get(declaration_type, 4)
            declaration_display_name = DECLARATION_DISPLAY.get(declaration_type, 'Unknown')
            
            # Check if any assistance programs are declared
            assistance_available = any([
                rec.get('ihProgramDeclared') == 1,
                rec.get('iaProgramDeclared') == 1,
                rec.get('paProgramDeclared') == 1,
                rec.get('hmProgramDeclared') == 1
            ])
            
            # Get the last refresh date
            last_refresh = rec.get('lastRefresh')
            if last_refresh:
                try:
                    updated_at = datetime.strptime(last_refresh, '%Y-%m-%dT%H:%M:%S.%fZ')
                except ValueError:
                    updated_at = datetime.now()
            else:
                updated_at = datetime.now()
                
            # Construct URL for more information
            disaster_number = rec.get('disasterNumber', '')
            url_link = f"https://www.fema.gov/disaster/{disaster_number}" if disaster_number else ''
            
            DisasterUpdate.objects.update_or_create(
                title=title,
                location=location,
                defaults={
                    'disaster_type': d_type,
                    'severity': severity,
                    'declaration_type': declaration_type,
                    'declaration_display': declaration_display_name,
                    'assistance_available': assistance_available,
                    'source': 'FEMA',
                    'url': url_link,
                    'updated_at': updated_at
                }
            )
    except Exception as e:
        print(f"Error fetching FEMA data: {e}")