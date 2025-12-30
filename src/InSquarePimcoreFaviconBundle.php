<?php

namespace InSquare\PimcoreFaviconBundle;

use InSquare\PimcoreFaviconBundle\DependencyInjection\InSquarePimcoreFaviconExtension;
use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Pimcore\Extension\Bundle\Installer\InstallerInterface;
use Pimcore\Extension\Bundle\PimcoreBundleAdminClassicInterface;
use Pimcore\Extension\Bundle\Traits\BundleAdminClassicTrait;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;

final class InSquarePimcoreFaviconBundle extends AbstractPimcoreBundle implements PimcoreBundleAdminClassicInterface
{
    use BundleAdminClassicTrait;

    public function getJsPaths(): array
    {
        return [
            '/bundles/insquarepimcorefavicon/js/startup.js',
        ];
    }

    public function getInstaller(): ?InstallerInterface
    {
        return $this->container->get(Installer::class);
    }

    public function getContainerExtension(): ?ExtensionInterface
    {
        if ($this->extension === null) {
            $this->extension = new InSquarePimcoreFaviconExtension();
        }

        return $this->extension;
    }
}
