import unittest
from flask_app import create_app
from flask_cors import CORS

class TestCORS(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.client = self.app.test_client()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_cors_origins(self):
        """Test that the CORS origins include localhost:5173"""
        # Get the CORS extension from the Flask app
        cors = None
        for extension in self.app.extensions.get('cors', {}).values():
            if isinstance(extension, CORS):
                cors = extension
                break
        
        self.assertIsNotNone(cors, "CORS extension not found")
        
        # Check that localhost:5173 is in the allowed origins
        self.assertIn("http://localhost:5173", cors.origins)
        self.assertIn("http://127.0.0.1:5173", cors.origins)

if __name__ == '__main__':
    unittest.main()
