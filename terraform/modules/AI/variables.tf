variable "location" {}
variable "resource_group" {}
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