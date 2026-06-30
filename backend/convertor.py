import json

def float_list_str_to_float_list(str_list):
    float_list = json.loads(str_list)
    return float_list