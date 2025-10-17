param(
    [string]$msg = "Update"
)

# .\deploy.ps1 -msg "Meine Commit-Message"

# Sicherstellen, dass wir auf Feature sind
git checkout Feature

# Alle Änderungen adden
git add .

# Commit mit Parameter-Message
git commit -m "$msg"

# Feature pushen
git push origin Feature

# Auf Main wechseln & pullen
git checkout main
git pull origin main

# Feature in Main mergen
git merge Feature

# Main pushen
git push origin main

# baut dist
npm run build

# deployed auf Seite
npm run deploy
