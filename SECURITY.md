# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in FedSpeak, please report it responsibly by opening a [GitHub Issue](https://github.com/MetaPhase-Consulting/fedspeak/issues) marked with the `security` label.

For sensitive disclosures, please use [GitHub's private vulnerability reporting](https://github.com/MetaPhase-Consulting/fedspeak/security/advisories/new).

## Scope

FedSpeak is a public, read-only reference tool. The API serves static data with no authentication, no user accounts, and no database. The attack surface is minimal by design:

- **No secrets or credentials** are stored in the repository
- **No user input is persisted** — all data is static JSON
- **CORS headers** are set on all API responses
- **No authentication** is required or implemented

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |

## Response

We aim to acknowledge security reports within 48 hours and will work to address confirmed vulnerabilities promptly.
