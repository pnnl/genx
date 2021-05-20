from ._version import version_info, __version__

from .react_jupyter_widget import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'genx-widget',
        'require': 'genx-widget/extension'
    }]
