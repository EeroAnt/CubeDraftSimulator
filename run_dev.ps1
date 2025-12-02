param(
  [switch]$Build = $false
)

try {
  if ($Build) {
    docker-compose -f docker-compose-dev.yml up --build
  } else {
    docker-compose -f docker-compose-dev.yml up
  }
}
finally {
  docker-compose -f docker-compose-dev.yml down
}