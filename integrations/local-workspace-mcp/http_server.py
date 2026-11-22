"""Opt-in, localhost-only Streamable HTTP transport for MeasuredField's MCP tools.

Use only behind an HTTPS tunnel (e.g. ngrok), with a separately generated,
non-reused high-entropy Bearer token. There is NO arbitrary terminal access.
This service never listens on an external network interface.
"""
from __future__ import annotations

import hmac
import os
import re
from dataclasses import dataclass
from typing import Awaitable, Callable
from urllib.parse import urlsplit

from mcp.server.transport_security import TransportSecuritySettings

from server import mcp

PORT = 8766
HOST = "127.0.0.1"
MAX_BODY = 65536
_HOSTNAME = re.compile(r"^[a-z0-9](?:[a-z0-9.-]{0,251}[a-z0-9])?$")


@dataclass(frozen=True)
class Config:
    token: str
    public_host: str | None
    port: int = PORT

    @property
    def allowed_hosts(self) -> tuple[str, ...]:
        local = (f"127.0.0.1:{self.port}", f"localhost:{self.port}")
        return local + ((self.public_host,) if self.public_host else ())


def normalize_public_host(value: str) -> str:
    """Only allow a configured HTTPS host, never arbitrary URL/userinfo/port."""
    value = value.strip()
    if "://" not in value:
        value = "https://" + value
    parsed = urlsplit(value)
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username
            or parsed.password or parsed.path not in ("", "/") or parsed.query
            or parsed.fragment or parsed.port is not None):
        raise ValueError("Expected a bare HTTPS hostname with no credentials, path or port")
    host = parsed.hostname.lower().rstrip(".")
    if (not _HOSTNAME.fullmatch(host) or ".." in host
            or any(not label or label.startswith("-") or label.endswith("-")
                   for label in host.split("."))):
        raise ValueError("Invalid remote hostname")
    # Don't accidentally associate the customer-facing remodeling domain.
    if host in {"prescottsbestremodeling.com", "www.prescottsbestremodeling.com"}:
        raise ValueError("Use a dedicated ngrok hostname, not the customer website")
    return host


def config_from_environment(env: dict[str, str] | None = None) -> Config:
    env = os.environ if env is None else env
    token = env.get("MF_MCP_HTTP_BEARER_TOKEN", "")
    if (len(token) < 43 or len(token) > 256
            or not token.isascii()
            or any(not (ch.isalnum() or ch in "-_=+/") for ch in token)):
        raise ValueError("Missing/invalid 256-bit-or-longer MCP HTTP token")
    host = env.get("MF_MCP_PUBLIC_HOST", "")
    normalized = normalize_public_host(host) if host else None
    return Config(token=token, public_host=normalized)


async def _respond(send, status: int, message: bytes) -> None:
    await send({
        "type": "http.response.start",
        "status": status,
        "headers": [
            (b"content-type", b"text/plain; charset=utf-8"),
            (b"cache-control", b"no-store"),
            (b"x-content-type-options", b"nosniff"),
            (b"content-length", str(len(message)).encode("ascii")),
        ],
    })
    await send({"type": "http.response.body", "body": message})


class AuthGate:
    """Enforce authentication on EVERY HTTP MCP method, before SDK dispatch.

    An outer ASGI wrapper also protects any future custom SDK routes. It rejects
    browser Origins and duplicate authority/authentication fields. No key
    material or request bodies are logged.
    """

    def __init__(self, app, config: Config):
        self.app = app
        self.config = config

    async def __call__(self, scope, receive, send):
        if scope["type"] == "lifespan":
            return await self.app(scope, receive, send)
        if scope["type"] != "http":
            return await _respond(send, 404, b"Not found")
        if scope.get("path") != "/mcp":
            return await _respond(send, 404, b"Not found")
        if scope.get("method") not in {"POST", "GET", "DELETE"}:
            return await _respond(send, 405, b"Method not allowed")
        headers = scope.get("headers", ())
        hosts = [v for k, v in headers if k.lower() == b"host"]
        if len(hosts) != 1:
            return await _respond(send, 400, b"Invalid Host")
        try:
            hostname = hosts[0].decode("ascii").lower()
        except UnicodeDecodeError:
            return await _respond(send, 400, b"Invalid Host")
        if hostname not in self.config.allowed_hosts:
            return await _respond(send, 421, b"Unrecognized Host")
        if any(k.lower() == b"origin" for k, _ in headers):
            return await _respond(send, 403, b"Browser Origin not permitted")
        auths = [v for k, v in headers if k.lower() == b"authorization"]
        expected = ("Bearer " + self.config.token).encode("ascii")
        if len(auths) != 1 or not hmac.compare_digest(auths[0], expected):
            return await _respond(send, 401, b"Unauthorized")
        lengths = [v for k, v in headers if k.lower() == b"content-length"]
        if len(lengths) > 1:
            return await _respond(send, 400, b"Invalid Content-Length")
        if lengths:
            try:
                size = int(lengths[0].decode("ascii"))
            except (UnicodeError, ValueError):
                return await _respond(send, 400, b"Invalid Content-Length")
            if size < 0 or size > MAX_BODY:
                return await _respond(send, 413, b"Request too large")
        return await self.app(scope, receive, send)


def create_app(config: Config | None = None):
    config = config or config_from_environment()
    # MCP SDK v2.3: transport configuration belongs on streamable_http_app.
    # Allow only the explicit loopback authority and one HTTPS forwarding host.
    security = TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=list(config.allowed_hosts),
        allowed_origins=[],
    )
    inner = mcp.streamable_http_app(
        host=HOST, streamable_http_path="/mcp",
        transport_security=security, stateless_http=True,
        json_response=True, max_request_body_size=MAX_BODY,
    )
    return AuthGate(inner, config)


def main() -> None:
    import uvicorn
    config = config_from_environment()
    # Uvicorn is always loopback-only. The ngrok process is the sole ingress.
    uvicorn.run(create_app(config), host=HOST, port=config.port,
                proxy_headers=False, access_log=False, log_level="warning")


if __name__ == "__main__":
    main()
