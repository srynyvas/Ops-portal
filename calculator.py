"""A tiny calculator module used as a TestAssist sample.

Three small functions covering a happy path, an error path, and a
parameterisable case — gives the planner / generator / reflection
loop something meaningful to chew on.
"""


def add(a: float, b: float) -> float:
    """Return the sum of two numbers."""
    return a + b


def divide(numerator: float, denominator: float) -> float:
    """Divide ``numerator`` by ``denominator``.

    Raises:
        ZeroDivisionError: if ``denominator`` is zero.
    """
    if denominator == 0:
        raise ZeroDivisionError("denominator must not be zero")
    return numerator / denominator


def is_even(n: int) -> bool:
    """Return True if ``n`` is even, False otherwise."""
    if not isinstance(n, int):
        raise TypeError(f"n must be int, got {type(n).__name__}")
    return n % 2 == 0
