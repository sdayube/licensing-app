export interface IRepository<Entity, WhereInput, CreateDTO, UpdateDTO> {
  findMany(
    filter: WhereInput,
    pagination?: { skip?: number; take?: number },
  ): Promise<Entity[]>;

  count(filter: WhereInput): Promise<number>;

  findOne(filter: WhereInput): Promise<Entity | null>;

  create(data: CreateDTO): Promise<Entity>;

  update(id: string, data: UpdateDTO): Promise<Entity>;

  delete(id: string): Promise<Entity>;
}
