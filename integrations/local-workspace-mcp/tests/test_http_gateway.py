"""Adversarial tests for the HTTP/HTTPS ngrok ingress gate.

All credentials are synthetic. No network, credentials, or ngrok agent is used.
"""
import asyncio
import importlib
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from http_server import AuthGate, Config, config_from_environment, create_app, normalize_public_host

TOKEN = "F" * 64


async def sample_inner(scope, receive, send):
    body = b"inner MCP reached"
    await send({"type": "http.response.start", "status": 200,
                "headers": [(b"content-type", b"text/plain")]})
    await send({"type": "http.response.body", "body": body})


def invoke(guard, *, method="POST", host=b"127.0.0.1:8766",
           authorization=None, extra_headers=(), path="/mcp"):
    sent = []
    headers = [(b"host", host)]
    if authorization is not None:
        headers.append((b"authorization", authorization))
    headers.extend(extra_headers)
    scope = {"type": "http", "method": method, "path": path, "headers": headers,
             "root_path": "", "query_string": b"", "scheme": "http"}
    async def receive():
        return {"type": "http.request", "body": b"", "more_body": False}
    async def send(data):
        sent.append(data)
    asyncio.run(guard(scope, receive, send))
    status = next(data["status"] for data in sent
                  if data["type"] == "http.response.start")
    body = b"".join(data.get("body", b"") for data in sent
                    if data["type"] == "http.response.body")
    return status, body, sent


class HTTPGatewayTests(unittest.TestCase):
    def setUp(self):
        self.config = Config(token=TOKEN, public_host="my-mcp.ngrok-free.dev")
        self.guard = AuthGate(sample_inner, self.config)

    def test_valid_loopback_bearer(self):
        status, body, _ = invoke(
            self.guard, authorization=("Bearer " + TOKEN).encode())
        self.assertEqual((status, body), (200, b"inner MCP reached"))

    def test_valid_remote_hostname_bearer(self):
        status, body, _ = invoke(
            self.guard, host=b"my-mcp.ngrok-free.dev",
            authorization=("Bearer " + TOKEN).encode())
        self.assertEqual(status, 200)

    def test_no_authorization_fails_closed(self):
        status, body, messages = invoke(self.guard)
        self.assertEqual(status, 401)
        self.assertEqual(body, b"Unauthorized")
        self.assertNotIn(TOKEN.encode(), repr(messages).encode())

    def test_wrong_authorization_fails_closed(self):
        for candidate in (b"Basic Zm9vOmJhcg==", b"Bearer broken", b"bearer " + TOKEN.encode()):
            with self.subTest(candidate=candidate[:8]):
                self.assertEqual(invoke(self.guard, authorization=candidate)[0], 401)

    def test_duplicate_authorization_rejected(self):
        status, _, _ = invoke(self.guard, authorization=("Bearer " + TOKEN).encode(),
                              extra_headers=[(b"AUTHORIZATION", b"Bearer second")])
        self.assertEqual(status, 401)

    def test_unknown_or_duplicate_host_rejected(self):
        for host, headers in (
            (b"attacker.example", []),
            (b"0.0.0.0:8766", []),
            (b"127.0.0.1:8767", []),
            (b"127.0.0.1:8766", [(b"HOST", b"attacker.example")]),
            (b"my-mcp.ngrok-free.dev:80", []),
        ):
            with self.subTest(host=host):
                status, _, _ = invoke(self.guard, host=host, extra_headers=headers,
                                       authorization=("Bearer " + TOKEN).encode())
                self.assertIn(status, (400, 421))

    def test_browser_origin_always_rejected_even_with_token(self):
        status, _, _ = invoke(self.guard, authorization=("Bearer " + TOKEN).encode(),
                               extra_headers=[(b"origin", b"https://attacker.invalid")])
        self.assertEqual(status, 403)

    def test_no_unprotected_routes(self):
        for path in ("/", "/health", "/.well-known/oauth-authorization-server", "/mcp/tools"):
            with self.subTest(path=path):
                status, _, _ = invoke(self.guard, path=path)
                self.assertEqual(status, 404)

    def test_disallowed_methods(self):
        for method in ("OPTIONS", "PUT", "PATCH"):
            with self.subTest(method=method):
                self.assertEqual(invoke(self.guard, method=method)[0], 405)

    def test_request_length_limit(self):
        for value, expected in ((b"65537", 413), (b"-3", 413), (b"bad", 400)):
            status, _, _ = invoke(
                self.guard, authorization=("Bearer " + TOKEN).encode(),
                extra_headers=[(b"content-length", value)])
            self.assertEqual(status, expected)

    def test_duplicate_request_length_rejected(self):
        status, _, _ = invoke(
            self.guard, authorization=("Bearer " + TOKEN).encode(),
            extra_headers=[(b"content-length", b"3"), (b"Content-Length", b"3")])
        self.assertEqual(status, 400)

    def test_security_header_on_denied_request(self):
        _, _, messages = invoke(self.guard)
        start = next(m for m in messages if m["type"] == "http.response.start")
        headers = dict(start["headers"])
        self.assertEqual(headers[b"cache-control"], b"no-store")
        self.assertEqual(headers[b"x-content-type-options"], b"nosniff")

    def test_config_requires_strong_random_length_token(self):
        for token in ("", "abc", "no spaces " * 8, "!"):
            with self.subTest(value=token[:10]), self.assertRaises(ValueError):
                config_from_environment({"MF_MCP_HTTP_BEARER_TOKEN": token})

    def test_config_accepts_https_ngrok_url(self):
        data = config_from_environment({
            "MF_MCP_HTTP_BEARER_TOKEN": TOKEN,
            "MF_MCP_PUBLIC_HOST": "https://my-mcp.ngrok-free.dev",
        })
        self.assertEqual(data.public_host, "my-mcp.ngrok-free.dev")

    def test_public_host_validation(self):
        for host in (
            "http://my-mcp.ngrok-free.dev", "https://my-mcp.ngrok-free.dev:443",
            "https://user:pass@my-mcp.ngrok-free.dev",
            "https://my-mcp.ngrok-free.dev/path", "https://foo..ngrok.dev",
            "https://www.prescottsbestremodeling.com",
        ):
            with self.subTest(host=host), self.assertRaises(ValueError):
                normalize_public_host(host)

    def test_lifespan_forwarded_to_sdk(self):
        events = []
        async def inner(scope, receive, send):
            events.append(scope["type"])
        guard = AuthGate(inner, self.config)
        asyncio.run(guard({"type": "lifespan"}, None, None))
        self.assertEqual(events, ["lifespan"])

    def test_sdk_app_keeps_security_rebinding_allowlist(self):
        with patch("http_server.mcp.streamable_http_app") as mocked:
            mocked.return_value = sample_inner
            app = create_app(self.config)
            security = mocked.call_args.kwargs["transport_security"]
            self.assertTrue(security.enable_dns_rebinding_protection)
            self.assertIn("my-mcp.ngrok-free.dev", security.allowed_hosts)
            self.assertNotIn("*", security.allowed_hosts)
            self.assertEqual(security.allowed_origins, [])
            self.assertEqual(app.config, self.config)


if __name__ == "__main__":
    unittest.main(verbosity=2)
