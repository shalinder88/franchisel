"""
Cross-Brand Scorer — Compare extractor canonical export to gold corpus.

Works across all 3 gold schemas (item-based, module-based, lightweight)
by comparing at the semantic field level, not by path matching.

Strategy:
1. Normalize gold into flat fact records (already done by gold_normalizer)
2. Build canonical export from extraction
3. For each gold fact, check if a matching canonical field exists
4. Match by: gold_alias → canonical field, OR field name match, OR value match
"""

import json
import os
import re
import sys
import subprocess
import glob
from typing import Dict, Any, List, Optional


def score_brand(extraction_result: Dict, gold_path: str) -> Dict:
    """Score one brand's extraction against its gold."""
    sys.path.insert(0, '.')
    from v7_extractor.canonical_export import build_canonical_export, build_reverse_alias_map

    canonical = build_canonical_export(extraction_result)
    alias_map = build_reverse_alias_map()

    with open(gold_path) as f:
        gold = json.load(f)

    brand = gold.get('meta', {}).get('brandName', '?')

    # Build a lookup of all canonical values for value-matching
    canonical_values = {}
    for k, v in canonical.items():
        if v is not None and v != '' and v != {} and v != []:
            canonical_values[k] = v
            # Also index by string value for fuzzy matching
            if isinstance(v, (str, int, float, bool)):
                canonical_values[str(v).lower()] = k

    # Flatten gold into checkable facts
    skip_keys = {'meta', 'extractorLearnings', 'coverageGaps', 'confidence',
                 'notes', 'trend', 'confidenceNote', 'unresolvedReason',
                 'unresolvedNote', 'priorPassNote', 'priorPassData',
                 'keyInsights', 'keyInsight', 'note'}

    matched = []
    missed = []

    def check_gold_field(path: str, field: str, value: Any, item_context: str):
        if value is None or value == 'unresolved' or value == '':
            return
        if isinstance(value, (dict, list)):
            # For complex objects, just check if we have the parent field
            return

        # Strategy 1: direct alias lookup
        canonical_key = alias_map.get(field, field)
        cval = canonical.get(canonical_key)
        if cval is not None and cval != '' and cval != {} and cval != []:
            matched.append({'path': path, 'field': field, 'method': 'alias'})
            return

        # Strategy 2: common field name patterns
        # Map module fields to canonical fields
        field_lower = field.lower()
        for ckey in canonical:
            if field_lower == ckey.lower():
                if canonical[ckey] is not None and canonical[ckey] != '':
                    matched.append({'path': path, 'field': field, 'method': 'name_match'})
                    return

        # Strategy 3: value matching for scalars
        if isinstance(value, (int, float)):
            for ckey, cval in canonical.items():
                if cval == value:
                    matched.append({'path': path, 'field': field, 'method': 'value_match', 'canonical_field': ckey})
                    return

        # Strategy 4: string containment for key values
        if isinstance(value, bool):
            # Check if any canonical bool field with same name pattern matches
            for ckey, cval in canonical.items():
                if isinstance(cval, bool) and cval == value:
                    if _fields_semantically_similar(field, ckey):
                        matched.append({'path': path, 'field': field, 'method': 'bool_semantic', 'canonical_field': ckey})
                        return

        missed.append({'path': path, 'field': field, 'value': str(value)[:40], 'item': item_context})

    def walk_gold(obj: Dict, prefix: str = '', item_context: str = ''):
        for k, v in obj.items():
            if k in skip_keys:
                continue
            path = f'{prefix}.{k}' if prefix else k
            ctx = item_context or k

            if isinstance(v, dict):
                # Check if this dict itself is a matchable object
                walk_gold(v, path, ctx)
            elif isinstance(v, list):
                # Skip list internals for now
                pass
            else:
                check_gold_field(path, k, v, ctx)

    walk_gold(gold)

    total = len(matched) + len(missed)
    pct = round(len(matched) / max(total, 1) * 100, 1)

    # Classify misses by item/family
    miss_families = {}
    for m in missed:
        item = m.get('item', 'other')
        # Normalize item context
        if item.startswith('module'):
            if 'counterparty' in item.lower() or 'system' in item.lower():
                fam = 'identity'
            elif 'entry' in item.lower() or 'capex' in item.lower():
                fam = 'investment'
            elif 'fee' in item.lower() or 'stack' in item.lower():
                fam = 'fee_details'
            elif 'supplier' in item.lower():
                fam = 'supplier'
            elif 'kill' in item.lower() or 'switch' in item.lower():
                fam = 'contract_terms'
            elif 'financ' in item.lower() and 'strength' in item.lower():
                fam = 'financials'
            elif 'item19' in item.lower():
                fam = 'item19_performance'
            elif 'item20' in item.lower():
                fam = 'outlets'
            elif 'territory' in item.lower():
                fam = 'territory'
            elif 'support' in item.lower():
                fam = 'support'
            elif 'document' in item.lower():
                fam = 'document'
            else:
                fam = 'other_module'
        elif item.startswith('item'):
            num = re.match(r'item(\d+)', item)
            if num:
                n = int(num.group(1))
                fam = {1: 'identity', 2: 'leadership', 3: 'litigation',
                       4: 'bankruptcy', 5: 'investment', 6: 'fee_details',
                       7: 'investment', 8: 'supplier', 10: 'financing',
                       11: 'support', 12: 'territory', 15: 'participation',
                       16: 'product', 17: 'contract_terms', 18: 'public_figure',
                       19: 'item19_performance', 20: 'outlets', 21: 'financials'
                }.get(n, 'other')
            else:
                fam = 'other'
        else:
            fam = 'other'
        miss_families.setdefault(fam, []).append(m)

    return {
        'brand': brand,
        'matched': len(matched),
        'missed': len(missed),
        'total': total,
        'pct': pct,
        'match_methods': {m['method'] for m in matched},
        'miss_families': {k: len(v) for k, v in sorted(miss_families.items(), key=lambda x: -len(x[1]))},
        'top_misses': [m['path'] for m in missed[:8]],
    }


def _fields_semantically_similar(gold_field: str, canonical_field: str) -> bool:
    """Check if two field names are semantically similar."""
    g = gold_field.lower().replace('_', '')
    c = canonical_field.lower().replace('_', '').replace('item', '').replace('8', '').replace('11', '').replace('12', '')
    # Direct containment
    if g in c or c in g:
        return True
    # Common patterns
    pairs = [
        ('haslitigation', 'haslitigation'), ('hasbankruptcy', 'hasbankruptcy'),
        ('hasitem19', 'hasitem19'), ('exclusiveterritory', 'exclusiveterritory'),
        ('personalguaranty', 'personalguaranty'), ('renewalavailable', 'renewalavailable'),
        ('publiclytraded', 'publiclytraded'), ('operationsmanual', 'operationsmanual'),
        ('offersfinancing', 'offersfinancing'), ('franchisormaycompete', 'franchisormaycompete'),
    ]
    for gp, cp in pairs:
        if gp in g and cp in c:
            return True
    return False


def run_all_brands():
    """Run scorer on all 16 brands."""
    gold_files = sorted(glob.glob('wi-dfi/registry/extracted-facts/*GOLD*'))
    pdfs = glob.glob('wi-dfi/archive/*.pdf')
    pdf_map = {os.path.basename(p).split('-')[0]: p for p in pdfs}

    results = []
    for gf in gold_files:
        fdd_id = os.path.basename(gf).split('-')[0]
        pdf = pdf_map.get(fdd_id)
        if not pdf:
            continue

        # Run extractor
        proc = subprocess.run(['python3', 'satf_extractor.py', pdf],
            capture_output=True, text=True, timeout=300)
        with open('/tmp/satf_result.json') as f:
            extraction = json.load(f)

        result = score_brand(extraction, gf)
        results.append(result)
        print(f'{result["brand"]:<25} {result["matched"]:>3}/{result["total"]:>3} = {result["pct"]:>5.1f}%')

    # Summary
    total_m = sum(r['matched'] for r in results)
    total_t = sum(r['total'] for r in results)
    print(f'\nOverall: {total_m}/{total_t} = {round(total_m/max(total_t,1)*100,1)}%')

    # Aggregate miss families
    all_families = {}
    for r in results:
        for fam, count in r.get('miss_families', {}).items():
            all_families[fam] = all_families.get(fam, 0) + count

    print('\nMiss families (across all brands):')
    for fam, count in sorted(all_families.items(), key=lambda x: -x[1]):
        print(f'  {fam}: {count}')

    return results


if __name__ == '__main__':
    run_all_brands()
