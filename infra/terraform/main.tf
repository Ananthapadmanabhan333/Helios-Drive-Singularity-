terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = "helios-drive-singularity"
  region  = "us-central1"
  zone    = "us-central1-c"
}

# ─── GKE Cluster for Helios-Drive Singularity ──────────────────────────────────
resource "google_container_cluster" "primary" {
  name     = "helios-singularity-cluster"
  location = "us-central1"

  # We can't create a cluster with no node pool defined, but we want to only use
  # separately managed node pools. So we create the smallest possible default
  # node pool and immediately delete it.
  remove_default_node_pool = true
  initial_node_count       = 1
}

# ─── CPU Node Pool for Microservices (Frontend, Backend APIs) ──────────────────
resource "google_container_node_pool" "primary_nodes" {
  name       = "helios-microservices-pool"
  location   = "us-central1"
  cluster    = google_container_cluster.primary.name
  node_count = 3

  node_config {
    machine_type = "e2-standard-4"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}

# ─── GPU Node Pool for Perception & Edge Inference Mocking ─────────────────────
resource "google_container_node_pool" "gpu_nodes" {
  name       = "helios-perception-gpu-pool"
  location   = "us-central1"
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    machine_type = "n1-standard-8"
    
    guest_accelerator {
      type  = "nvidia-tesla-t4"
      count = 2
    }

    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
