"""Pruebas del backend de Nexis. No usan una clave real ni llaman a Google.

Ejecutar desde backend/:  python -m unittest -v
"""
import unittest
from unittest import mock

import gemini_back_end as nexis


class NexisApiTest(unittest.TestCase):
    def setUp(self):
        self.client = nexis.app.test_client()

    def test_health(self):
        res = self.client.get("/")
        self.assertEqual(res.status_code, 200)

    def test_empty_prompt_is_rejected(self):
        res = self.client.post("/chat", json={"prompt": "   "})
        self.assertEqual(res.status_code, 400)

    def test_missing_api_key(self):
        with mock.patch.object(nexis, "GEMINI_API_KEY", ""):
            res = self.client.post("/chat", json={"prompt": "Hola"})
        self.assertEqual(res.status_code, 500)
        self.assertIn("GEMINI_API_KEY", res.get_json()["error"])

    def test_answer_from_gemini(self):
        fake = mock.Mock()
        fake.models.generate_content.return_value = mock.Mock(text=" Sprout es gratis. ")
        with mock.patch.object(nexis, "create_gemini_client", return_value=fake):
            res = self.client.post("/chat", json={"prompt": "Planes?"})
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.get_json(), {"response": "Sprout es gratis."})
        kwargs = fake.models.generate_content.call_args.kwargs
        self.assertEqual(kwargs["model"], nexis.GEMINI_MODEL)
        self.assertIn("NEXIS", kwargs["config"].system_instruction)

    def test_rejected_key(self):
        fake = mock.Mock()
        fake.models.generate_content.side_effect = Exception("401 UNAUTHENTICATED")
        with mock.patch.object(nexis, "create_gemini_client", return_value=fake):
            res = self.client.post("/chat", json={"prompt": "Hola"})
        self.assertEqual(res.status_code, 401)

    def test_internal_error_is_not_leaked(self):
        fake = mock.Mock()
        fake.models.generate_content.side_effect = Exception("secret internal detail")
        with mock.patch.object(nexis, "create_gemini_client", return_value=fake):
            res = self.client.post("/chat", json={"prompt": "Hola"})
        self.assertEqual(res.status_code, 500)
        self.assertNotIn("secret", res.get_json()["error"])


if __name__ == "__main__":
    unittest.main()
