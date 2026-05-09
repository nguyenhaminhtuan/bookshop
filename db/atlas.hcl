variable "db_host" {
  type    = string
  default = getenv("DB_HOST")
}

variable "db_port" {
  type    = string
  default = getenv("DB_PORT")
}

variable "db_dbname" {
  type    = string
  default = getenv("DB_DBNAME")
}

variable "db_user" {
  type    = string
  default = getenv("DB_USER")
}

variable "db_password" {
  type    = string
  default = getenv("DB_PASSWORD")
}

locals {
  local_db_url = urlsetpath(urluserinfo("postgres://${var.db_host}:${var.db_port}", var.db_user, var.db_password), var.db_dbname)
}

env "local" {
  src = "file://schema.sql"
  url = urlqueryset(local.local_db_url, "sslmode", "disable")
  dev = "docker://postgres/17/dev"
  migration {
    dir = "file://migrations"
  }
  format {
    migrate {
      diff = "{{ sql . \"  \" }}"
    }
  }
}
