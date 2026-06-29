import torch
self_host_device = "cuda" if torch.cuda.is_available() else "cpu"

