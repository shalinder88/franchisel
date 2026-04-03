"""
Engine Value Utilities

Shared helpers for unwrapping parser output envelopes.
Parser outputs are envelopes: {"value": ..., "state": ..., "provenance": ...}
Brand outputs are normalized values.

Rule: Never pass parser envelopes directly into brand JSON.
"""

from typing import Any, Optional


def pv(obj, default=None):
    """Parser value unwrap: parser field -> raw value.

    Parser outputs wrap values in {"value": X, "state": "present", "provenance": {...}}.
    This extracts X. If obj is already a plain value, returns it directly.
    """
    if obj is None:
        return default
    if isinstance(obj, dict) and "value" in obj:
        val = obj.get("value")
        return val if val is not None else default
    return obj


def pstate(obj, default="missing"):
    """Extract state from parser envelope."""
    if isinstance(obj, dict):
        return obj.get("state", default)
    return default


def pprov(obj):
    """Extract provenance from parser envelope."""
    if isinstance(obj, dict):
        return obj.get("provenance")
    return None
