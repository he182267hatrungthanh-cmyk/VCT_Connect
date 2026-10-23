"""Worker-facing assessment execution boundary.

Queue/retry code should depend on this module rather than provider-specific
construction details. Story 3.8 extracted this from backend.worker.main without
changing worker behavior.
"""
from __future__ import annotations

from collections.abc import Callable, Sequence
from uuid import UUID

from backend.app.config import Settings
from backend.app.storage import Store

from .assessment import AssessmentBundle, build_assessment
from .assessment_store import load_assessment_snapshot, persist_assessment_and_handoff
from .media import ReviewMediaInput
from .yescale import YEScaleProvider


AssessmentCallable = Callable[..., AssessmentBundle]
MediaLoader = Callable[
    [Store, UUID, dict],
    Sequence[ReviewMediaInput] | None,
]


import logging

from .mock_provider import SmartMockProvider

log = logging.getLogger("worker.assessment")


def assessment_enabled(
    settings: Settings | None,
    assess: AssessmentCallable | None,
) -> bool:
    # Always enabled in hybrid mode so worker can assess with real AI or smart mock
    return True


def run_worker_assessment(
    store: Store,
    claim: dict,
    settings: Settings | None,
    *,
    assess: AssessmentCallable | None = None,
    media_loader: MediaLoader | None = None,
) -> None:
    snapshot_id, supplier_data = load_assessment_snapshot(
        store,
        claim["analysis_id"],
        claim["token"],
    )

    permitted_media: tuple[ReviewMediaInput, ...] = ()
    if media_loader is not None:
        loaded = media_loader(store, snapshot_id, supplier_data)
        permitted_media = tuple(loaded or ())

    if assess is not None:
        bundle = (
            assess(supplier_data, permitted_media)
            if media_loader is not None
            else assess(supplier_data)
        )
    else:
        bundle = None
        # 1. Attempt real AI provider if API key is present
        if settings and settings.yescale_api_key and settings.yescale_api_key.strip():
            try:
                base_url = getattr(settings, "yescale_base_url", "https://api.yescale.io/v1")
                with YEScaleProvider(settings.yescale_api_key.strip(), base_url=base_url) as provider:
                    bundle = build_assessment(
                        supplier_data,
                        provider=provider,
                        model=settings.yescale_model,
                        embedding_provider=(
                            provider if settings.yescale_embedding_model else None
                        ),
                        embedding_model=settings.yescale_embedding_model,
                        media=permitted_media,
                        multimodal_provider=provider if permitted_media else None,
                        multimodal_model=(
                            settings.yescale_model if permitted_media else None
                        ),
                        metadata={
                            "feature": "complete_assessment",
                            "session_id": str(claim["analysis_id"]),
                        },
                    )
            except Exception as exc:
                log.warning(
                    "Real AI assessment failed analysis_id=%s (%s); falling back to SmartMockProvider",
                    claim["analysis_id"],
                    exc,
                )
                bundle = None

        # 2. Hybrid fallback: Smart Mock Provider (0 VND, deterministic & never crashes)
        if bundle is None:
            mock_provider = SmartMockProvider(supplier_data)
            bundle = build_assessment(
                supplier_data,
                provider=mock_provider,
                model="smart-mock-v1",
                embedding_provider=None,
                embedding_model=None,
                media=permitted_media,
                metadata={
                    "feature": "complete_assessment",
                    "session_id": str(claim["analysis_id"]),
                    "mode": "smart_mock_hybrid",
                },
            )

    persist_assessment_and_handoff(
        store,
        analysis_id=claim["analysis_id"],
        token=claim["token"],
        supplier_snapshot_id=snapshot_id,
        bundle=bundle,
    )
