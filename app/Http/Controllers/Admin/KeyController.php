<?php

namespace REBELinBLUE\Deployer\Http\Controllers\Admin;

use REBELinBLUE\Deployer\Http\Controllers\Resources\ResourceController as Controller;
use REBELinBLUE\Deployer\Http\Requests\StoreKeyRequest;
use REBELinBLUE\Deployer\Repositories\Contracts\KeyRepositoryInterface;

/**
 * SSH key management controller.
 */
class KeyController extends Controller
{
    /**
     * Class constructor.
     *
     * @param  KeyRepositoryInterface $repository
     * @return void
     */
    public function __construct(KeyRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function index()
    {
        return [
            'keys' => $this->repository->getAll(),
        ];
    }
}
