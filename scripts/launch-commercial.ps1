$ErrorActionPreference = "Stop"
$expectedRepo = "https://github.com/ultraspeedweb/CRM-.git"
$expectedProjectId = "prj_gDo8CZUBN3QvEv1gqgkMuMn56JjG"

function Assert-Exit([string]$label) {
  if ($LASTEXITCODE -ne 0) { throw "$label failed with exit code $LASTEXITCODE" }
}

Write-Host "[SatışDesk] Local commercial PRE-FLIGHT ONLY (no push or deployment)" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) { throw "Run from the SatışDesk project root." }
if (-not (Test-Path ".git")) { throw "Git repository is required; refusing to initialize or rewrite a repository." }
if (-not (Test-Path ".vercel/project.json")) { throw "Vercel project link missing. This preflight does not link projects." }
if (-not (Test-Path ".env.local")) { throw "Local environment is missing. This preflight does not create or retrieve secrets." }

$vercelProject = Get-Content ".vercel/project.json" -Raw | ConvertFrom-Json
if ($vercelProject.projectId -ne $expectedProjectId) { throw "Safety gate: unexpected Vercel project. No changes made." }

$origin = git remote get-url origin
Assert-Exit "git remote get-url origin"
$normalizedOrigin = $origin.Trim().TrimEnd("/")
if ($normalizedOrigin -ne $expectedRepo -and $normalizedOrigin -ne "https://github.com/ultraspeedweb/CRM-" -and $normalizedOrigin -ne "git@github.com:ultraspeedweb/CRM-.git") {
  throw "Safety gate: Git remote is not the expected SatışDesk repository. No changes made."
}

$branch = (git branch --show-current).Trim()
Assert-Exit "git branch --show-current"
if ([string]::IsNullOrWhiteSpace($branch) -or $branch -eq "main" -or $branch -eq "master") {
  throw "Run on a named non-protected review branch, not a detached HEAD or main/master."
}

$changes = @(git status --porcelain)
Assert-Exit "git status --porcelain"
if ($changes.Count -gt 0) { throw "Working tree is not clean. Preserve local work and review changes first." }

Write-Host "Repository, branch, clean tree and Vercel project identity verified." -ForegroundColor Green
Write-Host "1/2 Installing pinned dependencies..." -ForegroundColor Yellow
npm ci
Assert-Exit "npm ci"
Write-Host "2/2 Running typecheck, lint, unit tests and build..." -ForegroundColor Yellow
npm run verify
Assert-Exit "npm run verify"

Write-Host "LOCAL QUALITY PREFLIGHT PASSED. Commercial release is NOT certified." -ForegroundColor Green
Write-Host "Next: require isolated Supabase migration/security tests, browser E2E, preview validation, independent review and rollback evidence." -ForegroundColor Yellow
Write-Host "This script intentionally does NOT commit, change remotes, force push, merge, rotate secrets, alter databases or deploy production." -ForegroundColor Yellow
Write-Host "Use a reviewed PR and separate approved release process after all gates pass." -ForegroundColor Cyan
