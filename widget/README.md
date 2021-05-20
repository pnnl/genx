genx-widget
===============================

Text Generation Explanation

Installation
------------

To install use pip:

    $ pip install genx
    $ jupyter nbextension enable --py --sys-prefix genx

To install for jupyterlab

    $ jupyter labextension install genx

For a development installation (requires npm),

    $ git clone https://github.com/PNNL/genx-widget.git
    $ cd genx-widget
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix genx
    $ jupyter nbextension enable --py --sys-prefix genx
