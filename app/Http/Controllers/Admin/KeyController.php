<?php

namespace REBELinBLUE\Deployer\Http\Controllers\Admin;

use Illuminate\Support\Facades\Lang;
use REBELinBLUE\Deployer\Contracts\Repositories\KeyRepositoryInterface;
use REBELinBLUE\Deployer\Http\Controllers\Resources\ResourceController as Controller;
use REBELinBLUE\Deployer\Http\Requests\StoreKeyRequest;

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
        $keys = $this->repository->getAll();

        return view('admin.keys.listing', [
            'title' => Lang::get('keys.manage'),
            'keys'  => $keys->toJson(), // Because PresentableInterface toJson() is not working in the view
        ]);
    }
}
