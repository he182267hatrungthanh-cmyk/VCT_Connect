"""Smart Heuristic Mock Provider for VCT Connect.

Provides dynamic, grounded Vietnamese supplier interpretations without requiring
an external LLM API key. Enables zero-cost, 100% reliable local and demo runs.
"""
from __future__ import annotations

from decimal import Decimal
import json
from typing import Mapping

from .contracts import SCHEMA_VERSION
from .provider import EmbeddingResponse, ProviderResponse, ProviderUsage


class SmartMockProvider:
    provider_name = "SMART_MOCK"

    def __init__(self, supplier_data: Mapping[str, object] | None = None) -> None:
        self.supplier_data = dict(supplier_data or {})
        self.chat_calls = 0
        self.embedding_calls = 0

    def generate_json(
        self,
        *,
        model: str,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        max_tokens: int,
        metadata: Mapping[str, str] | None = None,
    ) -> ProviderResponse:
        self.chat_calls += 1

        # Check if this is review interpretation
        if "review-evidence interpretation" in system_prompt or "review-signals" in system_prompt:
            output = {
                "schema_version": "review-interpretation.v1",
                "language": "vi",
                "findings": [],
                "confidence": 0.8,
            }
            response_model = "smart-mock-review-v1"
        else:
            # Supplier interpretation
            name = str(self.supplier_data.get("supplier_name") or "Nhà cung cấp")
            years = self.supplier_data.get("years_active")
            company_info = self.supplier_data.get("company_information")
            if not isinstance(company_info, dict):
                company_info = {}
            business_type = company_info.get("business_type")
            factory_area = company_info.get("factory_area_sqm")
            certifications = self.supplier_data.get("certifications")
            price_info = self.supplier_data.get("price_information")
            platform = str(self.supplier_data.get("platform") or "sàn TMĐT")

            # Dynamic summary
            if years and isinstance(years, (int, float)) and years >= 3:
                summary_vi = (
                    f"Nhà cung cấp {name} đã hoạt động {int(years)} năm trên nền tảng {platform} với hồ sơ hoạt động tương đối rõ ràng. "
                    "Bằng chứng thu thập cho thấy năng lực cơ bản khả quan, tuy nhiên người mua vẫn nên yêu cầu mẫu thử trước khi giao dịch lớn."
                )
            else:
                summary_vi = (
                    f"Nhà cung cấp {name} có thông tin niêm yết trên {platform}. "
                    "Hồ sơ cần kiểm chứng thêm về năng lực sản xuất thực tế và điều khoản chất lượng trước khi đặt hàng số lượng lớn."
                )

            positive_signals = []
            risk_signals = []
            uncertainties = []

            # Years active
            if years and isinstance(years, (int, float)):
                if years >= 2:
                    positive_signals.append({
                        "statement_vi": f"Nhà cung cấp đã duy trì hoạt động {int(years)} năm trên nền tảng {platform}.",
                        "evidence_fields": ["years_active"],
                        "confidence": 0.85,
                        "evidence_quotes": {},
                    })
                else:
                    risk_signals.append({
                        "statement_vi": "Nhà cung cấp mới tham gia sàn dưới 2 năm, lịch sử hoạt động và số lượng đánh giá còn hạn chế.",
                        "evidence_fields": ["years_active"],
                        "confidence": 0.75,
                        "evidence_quotes": {},
                    })

            # Business type & factory scale
            if business_type:
                b_str = str(business_type)
                if "manufacturer" in b_str.lower() or "xưởng" in b_str.lower() or "chế tạo" in b_str.lower():
                    scale_str = f", diện tích xưởng {factory_area} m²" if factory_area else ""
                    positive_signals.append({
                        "statement_vi": f"Hồ sơ đăng ký mô hình sản xuất trực tiếp (Manufacturer){scale_str}.",
                        "evidence_fields": ["company_information"],
                        "confidence": 0.8,
                        "evidence_quotes": {},
                    })
                else:
                    uncertainties.append({
                        "statement_vi": f"Hồ sơ đăng ký là đơn vị thương mại ({b_str}), có thể qua trung gian phân phối.",
                        "evidence_fields": ["company_information"],
                        "confidence": 0.75,
                        "evidence_quotes": {},
                    })

            # Price information
            if price_info and isinstance(price_info, dict):
                positive_signals.append({
                    "statement_vi": "Giá niêm yết và số lượng đặt hàng tối thiểu (MOQ) được công khai rõ ràng trên sản phẩm.",
                    "evidence_fields": ["price_information"],
                    "confidence": 0.8,
                    "evidence_quotes": {},
                })

            # Certifications
            if certifications and isinstance(certifications, list) and len(certifications) > 0:
                positive_signals.append({
                    "statement_vi": f"Đơn vị đã công bố {len(certifications)} chứng chỉ/chứng nhận năng lực trên sàn.",
                    "evidence_fields": ["certifications"],
                    "confidence": 0.85,
                    "evidence_quotes": {},
                })
            else:
                uncertainties.append({
                    "statement_vi": "Chưa có chứng nhận chất lượng quốc tế độc lập (ISO/CE) được đính kèm công khai.",
                    "evidence_fields": ["certifications"],
                    "confidence": 0.7,
                    "evidence_quotes": {},
                })

            # Standard recommended verifications
            recommended_verifications = [
                "Đặt mua mẫu thử nghiệm (sample) để kiểm tra chất lượng thực tế trước khi đặt số lượng lớn.",
                "Yêu cầu nhà cung cấp gửi hợp đồng mẫu kèm điều khoản bồi thường nếu hàng lỗi hoặc giao trễ.",
                "Xác minh thông tin tài khoản thụ hưởng trùng khớp với tên pháp nhân đăng ký kinh doanh.",
            ]

            output = {
                "schema_version": SCHEMA_VERSION,
                "language": "vi",
                "summary_vi": summary_vi,
                "positive_signals": positive_signals[:4],
                "risk_signals": risk_signals[:4],
                "uncertainties": uncertainties[:4],
                "recommended_verifications": recommended_verifications,
                "confidence": 0.8,
                "dimension_assessments": [],
            }
            response_model = "smart-mock-supplier-v1"

        return ProviderResponse(
            provider=self.provider_name,
            request_id=f"smart-mock-{self.chat_calls}",
            requested_model=model,
            response_model=response_model,
            content=json.dumps(output, ensure_ascii=False),
            usage=ProviderUsage(
                prompt_tokens=150,
                completion_tokens=100,
                total_tokens=250,
                cost_usd=Decimal("0.0"),
                raw={"total_tokens": 250},
            ),
            latency_ms=15,
            finish_reason="stop",
            settings={"temperature": temperature, "max_tokens": max_tokens},
        )

    def embed_texts(self, **kwargs) -> EmbeddingResponse:
        self.embedding_calls += 1
        texts = kwargs.get("texts") or []
        vectors = tuple(
            (1.0, 0.0) if idx % 2 == 0 else (0.0, 1.0)
            for idx, _ in enumerate(texts)
        )
        return EmbeddingResponse(
            provider=self.provider_name,
            request_id=f"embed-{self.embedding_calls}",
            requested_model=kwargs.get("model", "mock-embed"),
            response_model="smart-mock-embedding-v1",
            vectors=vectors,
            usage=ProviderUsage(
                prompt_tokens=len(texts) * 5,
                completion_tokens=0,
                total_tokens=len(texts) * 5,
                cost_usd=Decimal("0.0"),
                raw={"total_tokens": len(texts) * 5},
            ),
            latency_ms=5,
            settings={"encoding_format": "float"},
        )
