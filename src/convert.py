import torch
from torch.utils.data import Dataset

from json import JSONEncoder
import json
#import torch
model = torch.load("state_dict.pt")

class EncodeTensor(JSONEncoder,Dataset):
    def default(self, obj):
        if isinstance(obj, torch.Tensor):
            return obj.cpu().detach().numpy().tolist()
        return super(NpEncoder, self).default(obj)

with open('yolov8s.json', 'w') as json_file:
    json.dump(model.state_dict(), json_file,cls=EncodeTensor)