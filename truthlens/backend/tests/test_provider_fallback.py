import os
import unittest
from unittest.mock import patch

import main
from pipeline import ai_analyzer


SUCCESS_RESULT = {
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


class AnalyzeContentFallbackTests(unittest.TestCase):
    def test_groq_success_short_circuits_before_cohere(self):
        with patch.object(ai_analyzer, "analyze_with_groq", return_value=SUCCESS_RESULT.copy()) as groq_mock:
            with patch.object(ai_analyzer, "analyze_with_cohere") as cohere_mock:
                result = ai_analyzer.analyze_content("Scientists confirm a major finding", "HEADLINE")

        self.assertEqual(result["verdict"], "Likely Real")
        groq_mock.assert_called_once()
        cohere_mock.assert_not_called()

    def test_groq_failure_falls_back_to_cohere(self):
        with patch.object(ai_analyzer, "analyze_with_groq", side_effect=RuntimeError("groq unavailable")):
            with patch.object(ai_analyzer, "analyze_with_cohere", return_value=SUCCESS_RESULT.copy()) as cohere_mock:
                result = ai_analyzer.analyze_content("A longer article body goes here", "ARTICLE_TEXT")

        self.assertEqual(result["credibility_score"], 88)
        cohere_mock.assert_called_once()

    def test_both_providers_failing_returns_service_error_payload(self):
        with patch.object(ai_analyzer, "analyze_with_groq", side_effect=RuntimeError("groq unavailable")):
            with patch.object(ai_analyzer, "analyze_with_cohere", side_effect=RuntimeError("cohere unavailable")):
                result = ai_analyzer.analyze_content("A longer article body goes here", "ARTICLE_TEXT")

        self.assertEqual(result["verdict"], "Unverifiable")
        self.assertEqual(result["credibility_score"], 0)
        self.assertEqual(result["confidence"], "Low")
        self.assertEqual(result["key_claims"], ["Claim could not be extracted from this content"])


class StartupConfigTests(unittest.IsolatedAsyncioTestCase):
    async def test_lifespan_requires_cohere_not_gemini(self):
        with patch.dict(
            os.environ,
            {
                "GROQ_API_KEY": "groq-test-key",
                "SERPER_API_KEY": "serper-test-key",
            },
            clear=True,
        ):
            with patch.object(main.logger, "info"):
                with patch.object(main.logger, "warning") as warning_mock:
                    async with main.lifespan(main.app):
                        pass

        warning_messages = [call.args[0] for call in warning_mock.call_args_list]
        self.assertTrue(any("COHERE_API_KEY" in message for message in warning_messages))
        self.assertFalse(any("GEMINI_API_KEY" in message for message in warning_messages))
