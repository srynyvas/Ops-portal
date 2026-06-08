"""A simple BankAccount class — dependency-free, class-based sample for TestAssist."""

from __future__ import annotations


class BankAccount:
    """A minimal bank account with deposit/withdraw and a transaction log."""

    def __init__(self, owner: str, balance: float = 0.0):
        if not owner or not owner.strip():
            raise ValueError("owner is required")
        if balance < 0:
            raise ValueError("initial balance cannot be negative")
        self.owner = owner.strip()
        self._balance = float(balance)
        self._transactions: list[tuple[str, float]] = []

    @property
    def balance(self) -> float:
        """Current account balance."""
        return self._balance

    def deposit(self, amount: float) -> float:
        """Add a positive amount to the balance and return the new balance."""
        if amount <= 0:
            raise ValueError("deposit amount must be positive")
        self._balance += amount
        self._transactions.append(("deposit", amount))
        return self._balance

    def withdraw(self, amount: float) -> float:
        """Subtract a positive amount; raises if it exceeds the balance."""
        if amount <= 0:
            raise ValueError("withdrawal amount must be positive")
        if amount > self._balance:
            raise ValueError("insufficient funds")
        self._balance -= amount
        self._transactions.append(("withdraw", amount))
        return self._balance

    def transfer(self, other: "BankAccount", amount: float) -> None:
        """Move money from this account to another account."""
        if not isinstance(other, BankAccount):
            raise TypeError("other must be a BankAccount")
        if other is self:
            raise ValueError("cannot transfer to the same account")
        self.withdraw(amount)
        other.deposit(amount)

    def transaction_count(self) -> int:
        """Number of deposit/withdraw operations performed on this account."""
        return len(self._transactions)

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self._balance:.2f})"
