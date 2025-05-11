import time
from functools import wraps
from typing import Callable, Any, Dict, Tuple

class SimpleCache:
    def __init__(self, ttl: int = 300):
        self.ttl = ttl
        self._store: Dict[str, Tuple[float, Any]] = {}

    def __call__(self, fn: Callable):
        @wraps(fn)
        async def wrapped(*args, **kwargs):
            key = fn.__name__
            now = time.time()
            # cache miss or expired
            if key not in self._store or now - self._store[key][0] > self.ttl:
                result = await fn(*args, **kwargs)
                self._store[key] = (now, result)
            return self._store[key][1]
        return wrapped

# instantiate with 5-minute TTL
cache = SimpleCache(ttl=300)
