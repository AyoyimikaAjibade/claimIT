import requests
import urllib.parse
from datetime import datetime
from claimIT_backend.models import DisasterUpdate

# Map FEMA's incident labels to our disaster_type keys
DISASTER_MAP = {
    'Wildfire': 'wildfire',
    'Flood': 'flood',
    'Earthquake': 'earthquake',
    'Hurricane': 'hurricane',
    'Tornado': 'tornado',
}

# Map FEMA declaration types to severity levels
DECLARATION_SEVERITY = {
    'Major Disaster Declaration': 3,
    'Emergency Declaration': 2,
    'Fire Management Assistance Declaration': 2,
    'Fire Suppression Authorization': 1,
}

# Map human-friendly incident types to FEMA selection codes
INCIDENT_TYPE_CODES = {
    'biological': 49750,
    'earthquake': 49136,
    'fire': 49121,
    'flood': 49112,
    'straight-line winds': 51096,
    'tropical storm': 51093,
    'winter storm': 51091,
}

def scrape_fema_disasters(start_year=None, end_year=None, incident_type=None, states=None, limit=10, order_by='declarationDate desc'):
    """
    Fetch disaster declarations from FEMA Open API and upsert to DisasterUpdate.
    """
    api_url = 'https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries'
    filters = []
    # if start_year:
    #     filters.append(f"declarationDate ge '{start_year}-01-01T00:00:00Z'")
    # if end_year:
    #     filters.append(f"declarationDate le '{end_year}-12-31T23:59:59Z'")
    # if incident_type:
    #     code = INCIDENT_TYPE_CODES.get(str(incident_type).lower(), incident_type)
    #     filters.append(f"incidentType eq '{code}'")
    if states:
        sts = states if isinstance(states, list) else [states]
        sf = " or ".join([f"state eq '{s}'" for s in sts])
        filters.append(f"({sf})")
    # build OData query manually to preserve `$` in parameter names
    query = [f'$top={limit}']
    if filters:
        filter_str = ' and '.join(filters)
        filter_enc = urllib.parse.quote_plus(filter_str)
        query.append(f'$filter={filter_enc}')
    if order_by:
        order_enc = urllib.parse.quote_plus(order_by)
        query.append(f'$orderby={order_enc}')
    url = f"{api_url}?{'&'.join(query)}"
    print('FEMA API URL:', url)
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        records = resp.json().get('DisasterDeclarationsSummaries', [])
        print(f"Fetched {len(records)} DisasterDeclarationsSummaries records")
        for rec in records:
            title = rec.get('declarationTitle') or rec.get('incidentType')
            location = rec.get('state')
            d_type = DISASTER_MAP.get(rec.get('incidentType'), 'other')
            severity = DECLARATION_SEVERITY.get(rec.get('declarationType'), 2)
            url_link = rec.get('url', '')
            description = rec.get('type', '') or ''
            DisasterUpdate.objects.update_or_create(
                title=title,
                location=location,
                defaults={
                    'disaster_type': d_type,
                    'description': description,
                    'severity': severity,
                    'source': 'FEMA API',
                    'url': url_link
                }
            )
    except Exception as e:
        print('FEMA API fetch error:', e)