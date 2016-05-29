<?php

namespace REBELinBLUE\Deployer\Repositories;

use REBELinBLUE\Deployer\Contracts\Repositories\KeyRepositoryInterface;
use REBELinBLUE\Deployer\Key;
use REBELinBLUE\Deployer\Repositories\EloquentRepository;

/**
 * The key repository.
 */
class EloquentKeyRepository extends EloquentRepository implements KeyRepositoryInterface
{
    /**
     * Class constructor.
     *
     * @param  key                   $model
     * @return EloquentKeyRepository
     */
    public function __construct(Key $model)
    {
        $this->model = $model;
    }
}
