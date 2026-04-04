"""
Worker Registry — Maps all 32 workers and provides factory functions.

This is the single source of truth for which workers exist and how
to instantiate them. The master orchestrator reads from this registry.
"""

from typing import Dict, List, Type
from .base_worker import BaseWorker
from .front_matter_worker import FrontMatterWorker
from .table_extractor import TableExtractorWorker
from .exhibit_extractor import ExhibitExtractorWorker
from .recovery_worker import RecoveryWorker
from .lane_a_synthesizer import LaneASynthesizerWorker
from .lane_b_normalizer import LaneBNormalizerWorker
from .reconciler import ReconcilerWorker
from .final_assembler import FinalAssemblerWorker

# Item workers
from .item_workers.item01_worker import Item01Worker
from .item_workers.item02_worker import Item02Worker
from .item_workers.item03_worker import Item03Worker
from .item_workers.item04_worker import Item04Worker
from .item_workers.item05_worker import Item05Worker
from .item_workers.item06_worker import Item06Worker
from .item_workers.item07_worker import Item07Worker
from .item_workers.item08_worker import Item08Worker
from .item_workers.item09_worker import Item09Worker
from .item_workers.item10_worker import Item10Worker
from .item_workers.item11_worker import Item11Worker
from .item_workers.item12_worker import Item12Worker
from .item_workers.item13_worker import Item13Worker
from .item_workers.item14_worker import Item14Worker
from .item_workers.item15_worker import Item15Worker
from .item_workers.item16_worker import Item16Worker
from .item_workers.item17_worker import Item17Worker
from .item_workers.item18_worker import Item18Worker
from .item_workers.item19_worker import Item19Worker
from .item_workers.item20_worker import Item20Worker
from .item_workers.item21_worker import Item21Worker
from .item_workers.item22_worker import Item22Worker
from .item_workers.item23_worker import Item23Worker


# ══════════════════════════════════════════════════════════════════════════════
# FULL 32-WORKER REGISTRY
# ══════════════════════════════════════════════════════════════════════════════

ALL_WORKERS: List[Type[BaseWorker]] = [
    # Control layer
    # Worker 1 = MasterOrchestrator (not a BaseWorker — it's the controller)
    FrontMatterWorker,          # Worker 2

    # Item workers (3-25)
    Item01Worker,               # Worker 3
    Item02Worker,               # Worker 4
    Item03Worker,               # Worker 5
    Item04Worker,               # Worker 6
    Item05Worker,               # Worker 7
    Item06Worker,               # Worker 8
    Item07Worker,               # Worker 9
    Item08Worker,               # Worker 10
    Item09Worker,               # Worker 11
    Item10Worker,               # Worker 12
    Item11Worker,               # Worker 13
    Item12Worker,               # Worker 14
    Item13Worker,               # Worker 15
    Item14Worker,               # Worker 16
    Item15Worker,               # Worker 17
    Item16Worker,               # Worker 18
    Item17Worker,               # Worker 19
    Item18Worker,               # Worker 20
    Item19Worker,               # Worker 21
    Item20Worker,               # Worker 22
    Item21Worker,               # Worker 23
    Item22Worker,               # Worker 24
    Item23Worker,               # Worker 25

    # Cross-cutting specialists
    TableExtractorWorker,       # Worker 26
    ExhibitExtractorWorker,     # Worker 27
    RecoveryWorker,             # Worker 28

    # Truth-building layer
    LaneASynthesizerWorker,     # Worker 29
    LaneBNormalizerWorker,      # Worker 30
    ReconcilerWorker,           # Worker 31
    FinalAssemblerWorker,       # Worker 32
]

# Phase B high-yield subset (for incremental rollout)
PHASE_B_WORKERS: List[Type[BaseWorker]] = [
    FrontMatterWorker,
    Item05Worker, Item06Worker, Item07Worker, Item08Worker,
    Item11Worker, Item12Worker, Item17Worker,
    Item19Worker, Item20Worker, Item21Worker, Item22Worker,
    TableExtractorWorker, ExhibitExtractorWorker,
    ReconcilerWorker, FinalAssemblerWorker,
]

# Phase C adds the rest
PHASE_C_ADDITIONS: List[Type[BaseWorker]] = [
    Item01Worker, Item02Worker, Item03Worker, Item04Worker,
    Item09Worker, Item10Worker,
    Item13Worker, Item14Worker, Item15Worker, Item16Worker,
    Item18Worker, Item23Worker,
    RecoveryWorker,
    LaneASynthesizerWorker, LaneBNormalizerWorker,
]


def get_all_workers() -> List[Type[BaseWorker]]:
    """Get all 32 worker classes (31 BaseWorker subclasses + orchestrator is separate)."""
    return list(ALL_WORKERS)


def get_phase_b_workers() -> List[Type[BaseWorker]]:
    """Get Phase B high-yield workers only."""
    return list(PHASE_B_WORKERS)


def get_worker_map() -> Dict[str, Type[BaseWorker]]:
    """Get worker_id → class mapping."""
    result = {}
    for wc in ALL_WORKERS:
        temp = wc.__new__(wc)
        result[temp.worker_id] = wc
    return result


def describe_workers() -> List[Dict]:
    """Describe all workers for documentation."""
    descriptions = []
    for wc in ALL_WORKERS:
        temp = wc.__new__(wc)
        descriptions.append({
            "worker_num": temp.worker_num,
            "worker_id": temp.worker_id,
            "class": wc.__name__,
            "module": wc.__module__,
        })
    return sorted(descriptions, key=lambda d: d["worker_num"])
