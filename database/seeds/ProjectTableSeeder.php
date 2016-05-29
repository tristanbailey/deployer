<?php

use Illuminate\Database\Seeder;
use REBELinBLUE\Deployer\Project;

class ProjectTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('projects')->delete();

        Project::create([
            'name'               => 'Deployer',
            'hash'               => str_random(60),
            'repository'         => 'https://github.com/REBELinBLUE/deployer.git',
            'url'                => 'http://deployer.app',
            'group_id'           => 2,
            'key_id'             => 1,
            'last_run'           => null,
            'build_url'          => 'http://ci.rebelinblue.com/build-status/image/3?branch=master',
            'allow_other_branch' => true,
            'include_dev'        => false,
        ]);
    }
}
