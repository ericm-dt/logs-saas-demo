
resource "kubernetes_secret" "shiptrackr_secrets" {
  metadata {
    name = "shiptrackr-secrets"
  }
  data = {
    DATABASE_URL = base64encode("postgres://shiptrackr_user:password@shiptrackr-db:5432/shiptrackr_db")
    JWT_SECRET   = base64encode("supersecurejwtsecret")
    PORT         = base64encode("3000")
  }
}

resource "kubernetes_deployment" "shiptrackr_api" {
  metadata {
    name = "shiptrackr-api"
    labels = {
      app = "shiptrackr-api"
    }
  }
  spec {
    replicas = 2
    selector {
      match_labels = {
        app = "shiptrackr-api"
      }
    }
    template {
      metadata {
        labels = {
          app = "shiptrackr-api"
        }
      }
      spec {
        container {
          name  = "api"
          image = "123456789012.dkr.ecr.us-west-2.amazonaws.com/shiptrackr-api:latest"
          port {
            container_port = 3000
          }
          env_from {
            secret_ref {
              name = kubernetes_secret.shiptrackr_secrets.metadata[0].name
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "shiptrackr_api" {
  metadata {
    name = "shiptrackr-api"
  }
  spec {
    selector = {
      app = "shiptrackr-api"
    }
    port {
      port        = 80
      target_port = 3000
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_deployment" "shiptrackr_db" {
  metadata {
    name = "shiptrackr-db"
    labels = {
      app = "shiptrackr-db"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "shiptrackr-db"
      }
    }
    template {
      metadata {
        labels = {
          app = "shiptrackr-db"
        }
      }
      spec {
        container {
          name  = "db"
          image = "postgres:15"
          port {
            container_port = 5432
          }
          env {
            name  = "POSTGRES_USER"
            value = "shiptrackr_user"
          }
          env {
            name  = "POSTGRES_PASSWORD"
            value = "password"
          }
          env {
            name  = "POSTGRES_DB"
            value = "shiptrackr_db"
          }
          volume_mount {
            name       = "sql-init"
            mount_path = "/docker-entrypoint-initdb.d"
          }
        }
        volume {
          name = "sql-init"
          config_map {
            name = kubernetes_config_map.shiptrackr_sql.metadata[0].name
          }
        }

      }
    }
  }
}

resource "kubernetes_service" "shiptrackr_db" {
  metadata {
    name = "shiptrackr-db"
  }
  spec {
    selector = {
      app = "shiptrackr-db"
    }
    port {
      port        = 5432
      target_port = 5432
    }
    type = "ClusterIP"
  }
}

resource "kubernetes_deployment" "shiptrackr_locust" {
  metadata {
    name = "shiptrackr-locust"
    labels = {
      app = "shiptrackr-locust"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        app = "shiptrackr-locust"
      }
    }
    template {
      metadata {
        labels = {
          app = "shiptrackr-locust"
        }
      }
      spec {
        container {
          name  = "locust"
          image = "123456789012.dkr.ecr.us-west-2.amazonaws.com/shiptrackr-locust:latest"
          command = ["locust", "-f", "locustfile.py", "--headless", "-u", "10", "-r", "2", "--host", "http://shiptrackr-api.default.svc.cluster.local"]
          port {
            container_port = 8089
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "shiptrackr_locust" {
  metadata {
    name = "shiptrackr-locust"
  }
  spec {
    selector = {
      app = "shiptrackr-locust"
    }
    port {
      port        = 8089
      target_port = 8089
    }
    type = "LoadBalancer"
  }
}

resource "kubernetes_config_map" "shiptrackr_sql" {
  metadata {
    name = "shiptrackr-sql"
    namespace = "default"
  }

  data = {
    "init.sql" = file("${path.module}/sql/init.sql")
    "seed.sql" = file("${path.module}/sql/seed.sql")
  }
}
