# GitHub Data Flow

```txt
User opens Macfolio
  |
  v
Portfolio / Code Preview feature
  |
  v
Frontend GitHub adapter
  |
  +-- request succeeds -----------------------+
  |                                           |
  v                                           v
Express GitHub proxy                    Normalize data
  |                                           |
  +-- repository cache hit -> safe repos -----+
  |
  +-- cache miss
        |
        v
      GitHub REST API
        |
        v
      public-only + allowlist filtering
        |
        v
      safe-field mapping + memory cache

If the live request fails:

Frontend feature -> static fallback projects -> usable portfolio UI
```

Selected source files follow a narrower path:

```txt
User selects file
  -> frontend adapter
  -> backend verifies public/allowed repository
  -> backend rejects sensitive or oversized path
  -> GitHub file request
  -> selected text content only
  -> code preview
```
