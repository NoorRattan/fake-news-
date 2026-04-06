from typing import Optional

class AnalysisCache:
    def __init__(self):
        self._storage = []

    def store(self, result: dict) -> None:
        self._storage.append(result)
        if len(self._storage) > 20:
            self._storage.pop(0)

    def get_all(self) -> list:
        return list(reversed(self._storage))

    def clear(self) -> None:
        self._storage.clear()

    def get_by_id(self, analysis_id: str) -> Optional[dict]:
        for item in self._storage:
            if item.get("analysis_id") == analysis_id:
                return item
        return None

cache = AnalysisCache()
