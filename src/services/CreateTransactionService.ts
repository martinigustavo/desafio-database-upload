import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import CreateCategoryService from './CreateCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const categoryExists = await categoriesRepository.findCategory(category);

    const { total } = await transactionsRepository.getBalance();

    let category_id;

    if (!categoryExists) {
      const newCategory = await new CreateCategoryService().execute({
        title: category,
      });

      category_id = newCategory.id;
    } else {
      category_id = categoryExists;
    }

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'Invalid balance: not enough income to add a new outcome transaction.',
      );
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
