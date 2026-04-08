import unittest
from unittest.mock import AsyncMock, patch

from pipeline import content_extractor
from pipeline import orchestrator


BASE_AI_RESULT = {
    "verdict": "Likely Real",
    "credibility_score": 88,
    "confidence": "High",
    "summary": "A grounded summary.",
    "red_flags": [],
    "credible_signals": ["Named expert sources"],
    "manipulation_tactics": [],
    "key_claims": ["Primary claim"],
    "reasoning": "The supporting evidence is strong.",
    "advice": "Keep checking primary sources.",
}

MOCK_EXTRACT_RESULT = {
    "text": (
        "This is a mocked article body long enough to exercise the pipeline without "
        "touching any live upstream services during the test run."
    ),
    "title": "Mock article",
    "domain": "example.com",
    "date": "2026-04-09",
    "extraction_method": "mock",
    "images": [
        {
            "url": "https://example.com/photo.jpg",
            "alt_text": "A photo from the article",
        }
    ],
}

MOCK_IMAGE_RESULT = [
    {
        "image_url": "https://example.com/photo.jpg",
        "image_type": "photo",
        "contains_text": False,
        "manipulation_likelihood": "Low",
        "credibility_flags": [],
        "credible_signals": ["Clear editorial photo"],
        "summary": "A mocked image analysis result.",
    }
]


class ImageAnalysisPipelineTests(unittest.IsolatedAsyncioTestCase):
    async def test_url_pipeline_attaches_mocked_image_analysis(self):
        with patch.object(orchestrator, "extract_from_url", return_value=MOCK_EXTRACT_RESULT.copy()):
            with patch.object(orchestrator, "analyze_content", return_value=BASE_AI_RESULT.copy()):
                with patch.object(
                    orchestrator,
                    "analyze_article_images",
                    AsyncMock(return_value=MOCK_IMAGE_RESULT.copy()),
                ) as image_mock:
                    with patch.object(
                        orchestrator,
                        "search_claims",
                        AsyncMock(return_value={"corroboration_results": []}),
                    ):
                        with patch.object(
                            orchestrator,
                            "check_source_credibility",
                            return_value={"cited_sources": []},
                        ):
                            with patch.object(orchestrator.cache, "store"):
                                result = await orchestrator.run_pipeline("https://example.com/story")

        self.assertEqual(result["input_type"], "URL")
        self.assertEqual(result["verdict"], "Likely Real")
        self.assertEqual(result["image_analysis"], MOCK_IMAGE_RESULT)
        image_mock.assert_awaited_once_with(MOCK_EXTRACT_RESULT["images"])

    async def test_url_pipeline_returns_empty_image_analysis_on_failure(self):
        with patch.object(orchestrator, "extract_from_url", return_value=MOCK_EXTRACT_RESULT.copy()):
            with patch.object(orchestrator, "analyze_content", return_value=BASE_AI_RESULT.copy()):
                with patch.object(
                    orchestrator,
                    "analyze_article_images",
                    AsyncMock(side_effect=RuntimeError("vision service unavailable")),
                ):
                    with patch.object(
                        orchestrator,
                        "search_claims",
                        AsyncMock(return_value={"corroboration_results": []}),
                    ):
                        with patch.object(
                            orchestrator,
                            "check_source_credibility",
                            return_value={"cited_sources": []},
                        ):
                            with patch.object(orchestrator.cache, "store"):
                                result = await orchestrator.run_pipeline("https://example.com/story")

        self.assertEqual(result["input_type"], "URL")
        self.assertEqual(result["verdict"], "Likely Real")
        self.assertEqual(result["image_analysis"], [])
        self.assertEqual(result["credibility_score"], 88)

    async def test_non_url_input_skips_image_analysis(self):
        article_text = (
            "Scientists at MIT have published a peer-reviewed study in Nature showing "
            "that regular exercise reduces the risk of cardiovascular disease by 35 percent. "
            "The study followed 50,000 participants over 10 years across 12 countries."
        )

        with patch.object(orchestrator, "analyze_content", return_value=BASE_AI_RESULT.copy()):
            with patch.object(
                orchestrator,
                "search_claims",
                AsyncMock(return_value={"corroboration_results": []}),
            ):
                with patch.object(
                    orchestrator,
                    "check_source_credibility",
                    return_value={"cited_sources": []},
                ):
                    with patch.object(
                        orchestrator,
                        "analyze_article_images",
                        AsyncMock(),
                    ) as image_mock:
                        with patch.object(orchestrator.cache, "store"):
                            result = await orchestrator.run_pipeline(article_text)

        self.assertEqual(result["input_type"], "ARTICLE_TEXT")
        self.assertEqual(result["image_analysis"], [])
        image_mock.assert_not_awaited()


class ContentExtractorImageFilteringTests(unittest.TestCase):
    def test_placeholder_images_are_skipped(self):
        html = """
        <html>
          <head><title>Mock Title</title></head>
          <body>
            <img src="https://static.example.com/grey-placeholder.png" width="1200" height="800" />
            <img src="/images/real-photo.jpg" alt="Real article image" width="1200" height="800" />
          </body>
        </html>
        """

        class MockResponse:
            status_code = 200
            headers = {"Content-Type": "text/html"}
            text = html

            def raise_for_status(self):
                return None

        with patch.object(content_extractor.httpx, "get", return_value=MockResponse()):
            with patch.object(
                content_extractor.trafilatura,
                "extract",
                return_value="Mock extracted article text with enough content.",
            ):
                result = content_extractor.extract_from_url("https://example.com/story")

        self.assertEqual(len(result["images"]), 1)
        self.assertEqual(result["images"][0]["url"], "https://example.com/images/real-photo.jpg")
