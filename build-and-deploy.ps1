# Define directories
$DistDir = "C:\Users\SrihariVB\Desktop\Mindgraph\saaspe-keycloak\dist_keycloak"
$ProviderDir = "C:\Users\SrihariVB\Desktop\docker-keycloakify-saaspe\provider"
$DockerComposeDir = "C:\Users\SrihariVB\Desktop\docker-keycloakify-saaspe" # Update to the directory with docker-compose.yml

# Build Keycloakify project
Write-Host "Building the Keycloakify project..."
npm run build-keycloak-theme
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build the Keycloakify project." -ForegroundColor Red
    pause
    exit
}

Write-Host "Build completed successfully."

# Check for .jar files and move them
if (Test-Path "$DistDir\*.jar") {
    Write-Host "Moving .jar files to the provider directory..."
    Move-Item -Path "$DistDir\*.jar" -Destination $ProviderDir -Force
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to move .jar files to the provider directory." -ForegroundColor Red
        pause
        exit
    }
} else {
    Write-Host "Warning: No .jar files found in the dist_keycloak directory." -ForegroundColor Yellow
    pause
    exit
}

# Restart the Keycloak container
Write-Host "Restarting Keycloak container..."
Push-Location $DockerComposeDir
docker-compose stop keycloak_web
docker-compose up -d keycloak_web
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to restart the Keycloak container." -ForegroundColor Red
    Pop-Location
    pause
    exit
}
Pop-Location

Write-Host "Deployment complete!" -ForegroundColor Green
pause

