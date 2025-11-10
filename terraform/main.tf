
provider "aws" {
  region = "us-west-2"
}

module "eks" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "shiptrackr-cluster"
  cluster_version = "1.27"
  subnets         = ["subnet-abc123", "subnet-def456"]
  vpc_id          = "vpc-xyz789"

  node_groups = {
    default = {
      desired_capacity = 2
      max_capacity     = 3
      min_capacity     = 1
      instance_types   = ["t3.medium"]
    }
  }
}
