import ipywidgets as widgets
from traitlets import Unicode, Dict

import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist
import pynndescent

from heapdict import heapdict
from collections import defaultdict
from itertools import chain

def inverse(prime):
    
    dual = defaultdict(list)

    for i, values in prime.items():
        for v in values:
            dual[v].append(i)
     
    return dual

def min_cover(prime):
    covered_by = inverse(prime)
    
    priority = heapdict({i: -len(v) for i, v in prime.items()})

    solution = set()
    covered = set()

    while priority:
        k, v = priority.popitem()

        if v >= 0:
            break

        solution.add(k)

        for u in prime[k]:
            if u not in covered:
                covered.add(u)
                for v in covered_by[u]:
                    if v in priority:
                        priority[v] += 1
                        
    return solution

def reduce_duplicates(dfk):
    dual = dfk.train_sources
    dfk = dfk.assign(
        train_sources=dual.apply(min_cover(inverse(dual)).intersection).apply(list)
    )

    order = {}
    def key(k):
        return order.get(k, len(dfk))

    def sort(values):
        values = sorted(values, key=key)
        order[values[0]] = len(order)
        return values

    dfk['train_sources'] = dfk.train_sources.apply(sort)    

    return dfk

@widgets.register
class ReactJupyterWidget(widgets.DOMWidget):
    """An example widget."""
    _view_name = Unicode('ReactView').tag(sync=True)
    _model_name = Unicode('ReactModel').tag(sync=True)
    _view_module = Unicode('genx-widget').tag(sync=True)
    _model_module = Unicode('genx-widget').tag(sync=True)
    _view_module_version = Unicode('^0.1.0').tag(sync=True)
    _model_module_version = Unicode('^0.1.0').tag(sync=True)

    component = Unicode().tag(sync=True)
    props = Dict().tag(sync=True)

    def __init__(self, **kwargs):
        super().__init__()

        self.component = self.__class__.__name__
        self.props = kwargs


def neighbors_nndescent(train_emb, test_emb, n_neighbors=30, **kwargs):
    return pynndescent.NNDescent(train_emb.values, **kwargs)\
        .query(test_emb.values, k=n_neighbors)

def neighbors_cdist(train_emb, test_emb, n_neighbors=30, **kwargs):
    D = cdist(test_emb, train_emb, **kwargs)
    N = np.argsort(D, axis=1)[:, :n_neighbors]
    return N, np.vstack([d[i] for d, i in zip(D, N)])

@widgets.register
class GenX(ReactJupyterWidget):
    def __init__(self, train_sent, train_emb, test_sent, test_emb,
        approximate=True, epsilon=0.01,
        train_field='cleaned_text',
        train_sources_field='email_uuid',
        test_field='cleaned_text',
        test_sources_field='email_uuid',
        **kwargs
    ):
        self.train_emb = train_emb
        self.test_emb = test_emb

        if approximate:
            N, D = self.N, self.D = neighbors_nndescent(train_emb, test_emb, **kwargs)
        else:
            N, D = self.N, self.D = neighbors_cdist(train_emb, test_emb, **kwargs)

        # here is where we can play with the neighbor threhsold
        # we don't have to require the neighbor is exactly the smallest distance
        nearest_neighbors = self.nearest_neighbors = [
            train_sent.index[n[d <= d.min() + epsilon]].tolist()
            for d, n in zip(D, N)
        ]

        train_sources = [
            set(train_sent.loc[index, train_sources_field])
            for index in nearest_neighbors
        ]

        self.test_sent = test_sent.assign(
            train_sources=train_sources,
            neighbors=[self.train_emb.index[n].tolist() for n in N],
            distances=D.tolist(),
        )\
            .groupby(test_sources_field, as_index=False, group_keys=False)\
            .apply(reduce_duplicates)


        # remove unused documents
        index = sorted(set(np.hstack(self.test_sent.neighbors)))
        self.train_sent = train_sent.loc[index]

        # compute statistics at the document level
        g = self.test_sent.groupby(train_sources_field)

        diversity = g.train_sources.apply(
            lambda ser: len(set(chain.from_iterable(ser)))/len(ser)
        ).astype(float)

        closeness = g.distances.apply(
            lambda ser: np.vstack(ser.values)[:, 0].mean()
        ).astype(float)
        
        self.stats = pd.DataFrame(dict(
            diversity=diversity,
            closeness=closeness
        ))

        super().__init__(
            train=self.train_sent\
                .rename(columns={train_field: 'text'})\
                .to_dict(orient='split'),
            test=self.test_sent\
                .rename(columns={test_field: 'text'})\
                .to_dict(orient='split'),
            stats=self.stats.to_dict(orient='split')
        )
