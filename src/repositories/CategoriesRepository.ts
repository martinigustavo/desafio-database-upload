import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findCategory(title: string): Promise<string | null> {
    const findCategory = await this.findOne({
      where: { title },
    });

    const category_id = findCategory?.id ? findCategory.id : null;

    return category_id;
  }
}

export default CategoriesRepository;
