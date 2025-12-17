variable "resource_group" {}

## Using multiple regions lets us circumvent rate limits

variable "regions" {
  type = map(string)
  default = {
    sweden  = "swedencentral"
    poland  = "polandcentral"
    italy   = "italynorth"
    germany = "germanywestcentral"
    france  = "francecentral"
    swiss = "switzerlandnorth"
    spain = "spaincentral"
  }
}