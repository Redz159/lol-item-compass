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
git checkout Main
git pull origin Main

# Feature in Main mergen
git merge Feature

# Main pushen
git push origin Main

# Optional deployen
npm run deploy
