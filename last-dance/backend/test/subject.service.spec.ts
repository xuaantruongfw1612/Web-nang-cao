import { ConflictException, NotFoundException } from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { Subject } from '../src/subjects/subject.entity';
import { SubjectService } from '../src/subjects/subject.service';

/* eslint-disable @typescript-eslint/unbound-method */

describe('SubjectService', () => {
  const repository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  } as unknown as jest.Mocked<Repository<Subject>>;
  const service = new SubjectService(repository);

  beforeEach(() => jest.clearAllMocks());

  it('lists only subjects owned by the user', async () => {
    repository.find.mockResolvedValue([]);
    await service.findAll(7);
    expect(repository.find).toHaveBeenCalledWith({
      where: { user: { id: 7 } },
      order: { name: 'ASC' },
    });
  });

  it('rejects access to a missing or another user subject', async () => {
    repository.findOne.mockResolvedValue(null);
    await expect(service.findOne(5, 7)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('creates a trimmed subject for the authenticated user', async () => {
    const entity = { id: 1, name: 'Toán' } as Subject;
    repository.create.mockReturnValue(entity);
    repository.save.mockResolvedValue(entity);
    await expect(service.create({ name: ' Toán ' }, 7)).resolves.toBe(entity);
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Toán',
      icon: undefined,
      user: { id: 7 },
    });
  });

  it('returns a conflict for a duplicate subject name', async () => {
    const entity = { name: 'Toán' } as Subject;
    repository.create.mockReturnValue(entity);
    const error = new QueryFailedError('INSERT', [], { code: 'ER_DUP_ENTRY' });
    repository.save.mockRejectedValue(error);
    await expect(service.create({ name: 'Toán' }, 7)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('deletes only after resolving an owned subject', async () => {
    const entity = { id: 1 } as Subject;
    repository.findOne.mockResolvedValue(entity);
    repository.remove.mockResolvedValue(entity);
    await service.remove(1, 7);
    expect(repository.remove).toHaveBeenCalledWith(entity);
  });
});
