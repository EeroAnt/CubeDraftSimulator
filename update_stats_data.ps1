cd ./Cubestats/CubestatsData/
python3 main.py
cd ../..
Write-Host "Data successfully updated!"
git add .\CubeStats\CubeStatsData\data.json
git commit -m "update data"
git push
Write-Host "Data successfully pushed to GitHub!"