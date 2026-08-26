$ErrorActionPreference = "Stop"
$repo = "https://github.com/ultraspeedweb/CRM-.git"
$expectedProjectId = "prj_gDo8CZUBN3QvEv1gqgkMuMn56JjG"

function Assert-Exit([string]$label) {
  if ($LASTEXITCODE -ne 0) { throw "$label failed with exit code $LASTEXITCODE" }
}

Write-Host "[SatışDesk] Commercial launch gate" -ForegroundColor Cyan

if (-not (Test-Path "package.json")) { throw "Run this from the SatışDesk project root." }
if (-not (Test-Path ".env.local")) { throw ".env.local is missing. Use the original SatışDesk folder that already contains the Supabase environment values." }
if (-not (Test-Path ".vercel/project.json")) { throw ".vercel/project.json is missing. Use the original SatışDesk folder that is linked to Vercel." }

$vercelProject = Get-Content ".vercel/project.json" -Raw | ConvertFrom-Json
if ($vercelProject.projectId -ne $expectedProjectId) {
  throw "Safety gate: this folder is linked to a different Vercel project ($($vercelProject.projectId))."
}
Write-Host "Safety gate OK: linked to satisdesk / $expectedProjectId" -ForegroundColor Green

Write-Host "1/6 Installing exact dependencies..." -ForegroundColor Yellow
npm ci
Assert-Exit "npm ci"

Write-Host "2/6 Running full quality gate (typecheck + lint + tests + build)..." -ForegroundColor Yellow
npm run verify
Assert-Exit "npm run verify"

Write-Host "3/6 Preparing GitHub source of truth..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) { git init; Assert-Exit "git init" }
if (-not (git config user.name)) { git config user.name "OpenAI ChatGPT" }
if (-not (git config user.email)) { git config user.email "noreply@openai.com" }

$remotes = @(git remote)
if ($remotes -contains "origin") {
  git remote set-url origin $repo
  Assert-Exit "git remote set-url"
} else {
  git remote add origin $repo
  Assert-Exit "git remote add"
}

git add -A
Assert-Exit "git add"
# Hard safety gate: never publish runtime secrets or generated/build directories.
git reset -- .env.local .vercel .next node_modules tsconfig.tsbuildinfo 2>$null
$staged = @(git diff --cached --name-only)
if ($staged -match '^\.env\.local$|^\.vercel/|^\.next/|^node_modules/|^tsconfig\.tsbuildinfo$') {
  throw "Secret/build artifact safety gate failed. Nothing was pushed."
}
if ($staged.Count -gt 0) {
  git commit -m "Prepare SatışDesk commercial launch"
  Assert-Exit "git commit"
}

Write-Host "4/6 Synchronizing the new GitHub repository..." -ForegroundColor Yellow
git fetch origin main
Assert-Exit "git fetch"

Write-Host "5/6 Publishing verified source to GitHub..." -ForegroundColor Yellow
git push -u origin HEAD:main --force-with-lease
Assert-Exit "git push"

Write-Host "6/6 Deploying to the EXISTING SatışDesk Vercel production project..." -ForegroundColor Yellow
if (Get-Command vercel -ErrorAction SilentlyContinue) {
  vercel --prod --yes
} else {
  npx --yes vercel@59.3.0 --prod --yes
}
Assert-Exit "Vercel production deploy"

Write-Host "SATISDESK LAUNCH DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "Production: https://satisdesk.vercel.app" -ForegroundColor Cyan
Write-Host "Do not close this window until ChatGPT confirms the production smoke checks." -ForegroundColor Cyan
