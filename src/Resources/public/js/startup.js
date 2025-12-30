/**
 * InSquare Pimcore Favicon bundle.
 */

pimcore.registerNS("pimcore.plugin.insquarefavicon");
pimcore.registerNS("pimcore.settings.favicon");

pimcore.settings.favicon = Class.create({
    initialize: function () {
        this.getTabPanel();
    },

    getTabPanel: function () {
        if (!this.panel) {
            this.panel = Ext.create("Ext.panel.Panel", {
                id: "pimcore_settings_favicon",
                title: t("favicon"),
                iconCls: "pimcore_icon_image",
                border: false,
                layout: "fit",
                closable: true
            });

            this.panel.on("destroy", function () {
                pimcore.globalmanager.remove("settings_favicon");
            }.bind(this));

            this.layout = Ext.create("Ext.form.Panel", {
                bodyStyle: "padding:20px 5px 20px 5px;",
                border: false,
                autoScroll: true,
                forceLayout: true,
                defaults: {
                    forceLayout: true
                },
                fieldDefaults: {
                    labelWidth: 250
                },
                items: [
                    {
                        xtype: "fieldset",
                        title: t("favicon"),
                        collapsible: true,
                        width: "100%",
                        autoHeight: true,
                        items: [
                            {
                                xtype: "container",
                                html: t("favicon_upload_description"),
                                style: "margin-bottom:10px;"
                            },
                            {
                                xtype: "container",
                                id: "pimcore_favicon_preview",
                                html: '<img src="' + Routing.generate("insquare_pimcore_favicon_display") + '" />'
                            },
                            {
                                xtype: "button",
                                text: t("upload"),
                                iconCls: "pimcore_icon_upload",
                                handler: function () {
                                    pimcore.helpers.uploadDialog(
                                        Routing.generate("insquare_pimcore_favicon_upload"),
                                        null,
                                        function () {
                                            var cont = Ext.getCmp("pimcore_favicon_preview");
                                            var date = new Date();
                                            cont.update('<img src="' + Routing.generate("insquare_pimcore_favicon_display", {"_dc": date.getTime()}) + '" />');
                                        }.bind(this)
                                    );
                                }.bind(this)
                            },
                            {
                                xtype: "button",
                                text: t("delete"),
                                iconCls: "pimcore_icon_delete",
                                handler: function () {
                                    Ext.Ajax.request({
                                        url: Routing.generate("insquare_pimcore_favicon_delete"),
                                        method: "DELETE",
                                        success: function () {
                                            var cont = Ext.getCmp("pimcore_favicon_preview");
                                            var date = new Date();
                                            cont.update('<img src="' + Routing.generate("insquare_pimcore_favicon_display", {"_dc": date.getTime()}) + '" />');
                                        }
                                    });
                                }.bind(this)
                            }
                        ]
                    }
                ]
            });

            this.panel.add(this.layout);

            var tabPanel = Ext.getCmp("pimcore_panel_tabs");
            tabPanel.add(this.panel);
            tabPanel.setActiveItem(this.panel);

            pimcore.layout.refresh();
        }

        return this.panel;
    },

    activate: function () {
        var tabPanel = Ext.getCmp("pimcore_panel_tabs");
        tabPanel.setActiveItem("pimcore_settings_favicon");
    }
});

pimcore.plugin.insquarefavicon = Class.create({
    initialize: function () {
        if (pimcore.events.preMenuBuild) {
            document.addEventListener(pimcore.events.preMenuBuild, this.preMenuBuild.bind(this));
        } else {
            document.addEventListener(pimcore.events.pimcoreReady, this.pimcoreReady.bind(this));
        }
    },

    preMenuBuild: function (e) {
        var perspectiveCfg = pimcore.globalmanager.get("perspective");

        if (!perspectiveCfg.inToolbar("settings")) {
            return;
        }

        var user = pimcore.globalmanager.get("user");
        if (!(user && (user.admin || user.isAllowed("favicon_settings")))) {
            return;
        }

        var menu = e.detail.menu;
        if (!menu.settings || !menu.settings.items) {
            return;
        }

        menu.settings.items.push({
            text: t("favicon"),
            iconCls: "pimcore_icon_image",
            itemId: "pimcore_menu_settings_favicon",
            handler: this.openFaviconSettings.bind(this)
        });
    },

    pimcoreReady: function () {
        var perspectiveCfg = pimcore.globalmanager.get("perspective");

        if (!perspectiveCfg.inToolbar("settings")) {
            return;
        }

        var user = pimcore.globalmanager.get("user");
        if (!(user && (user.admin || user.isAllowed("favicon_settings")))) {
            return;
        }

        var menu = Ext.getCmp("pimcore_menu_settings");
        if (!menu) {
            return;
        }

        menu.add({
            text: t("favicon"),
            iconCls: "pimcore_icon_image",
            itemId: "pimcore_menu_settings_favicon",
            handler: this.openFaviconSettings.bind(this)
        });
    },

    openFaviconSettings: function () {
        try {
            pimcore.globalmanager.get("settings_favicon").activate();
        } catch (e) {
            pimcore.globalmanager.add("settings_favicon", new pimcore.settings.favicon());
        }
    }
});

new pimcore.plugin.insquarefavicon();
