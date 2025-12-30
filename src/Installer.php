<?php

declare(strict_types=1);

namespace InSquare\PimcoreFaviconBundle;

use Pimcore\Extension\Bundle\Installer\SettingsStoreAwareInstaller;

final class Installer extends SettingsStoreAwareInstaller
{
    private const USER_PERMISSIONS_CATEGORY = 'InSquare Favicon Bundle';
    private const USER_PERMISSIONS = [
        'favicon_settings',
    ];

    public function install(): void
    {
        $this->addUserPermission();
        parent::install();
    }

    public function uninstall(): void
    {
        $this->removeUserPermission();
        parent::uninstall();
    }

    private function addUserPermission(): void
    {
        $db = \Pimcore\Db::get();

        foreach (self::USER_PERMISSIONS as $permission) {
            $db->insert('users_permission_definitions', [
                $db->quoteIdentifier('key') => $permission,
                $db->quoteIdentifier('category') => self::USER_PERMISSIONS_CATEGORY,
            ]);
        }
    }

    private function removeUserPermission(): void
    {
        $db = \Pimcore\Db::get();

        foreach (self::USER_PERMISSIONS as $permission) {
            $db->delete('users_permission_definitions', [
                $db->quoteIdentifier('key') => $permission,
            ]);
        }
    }
}
