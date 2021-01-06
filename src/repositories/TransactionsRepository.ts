import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomes = await this.find({
      where: { type: 'income' },
    });

    const outcomes = await this.find({
      where: { type: 'outcome' },
    });

    const income = incomes.reduce((prev, curr) => prev + curr.value, 0);

    const outcome = outcomes.reduce((prev, curr) => prev + curr.value, 0);

    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
